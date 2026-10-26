import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { canIssue, hashInvitation, inviteSchema } from "./invitation-policy";

export const bootstrapOwner = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const configured = process.env["VAULT_OWNER_EMAIL"]?.trim().toLowerCase();
  const identity = await context.supabase.auth.getUser();
  if (!configured || !identity.data.user?.email_confirmed_at || identity.data.user.email?.toLowerCase() !== configured) return { ok: false, message: "Verified owner configuration required. No ownership assigned." };
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const existing = await supabaseAdmin.from("user_roles").select("user_id").eq("role", "owner").maybeSingle();
  if (existing.error || (existing.data && existing.data.user_id !== context.userId)) return { ok: false, message: "Owner already configured." };
  if (!existing.data) {
    const saved = await supabaseAdmin.from("user_roles").insert({ user_id: context.userId, role: "owner", can_invite: true });
    if (saved.error) return { ok: false, message: "Owner setup failed; no success assumed." };
    await supabaseAdmin.from("testing_audit").insert({ actor_id: context.userId, event: "owner_bootstrapped", subject_id: context.userId });
  }
  return { ok: true, message: "Verified owner enrolled. Reload to register your session." };
});

export const issueInvitation = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator(inviteSchema).handler(async ({ context, data }) => {
  const active = await context.supabase.rpc("account_session_active");
  const role = await context.supabase.from("user_roles").select("role,can_invite,active").eq("user_id", context.userId).single();
  if (active.data !== true || !role.data?.active || !canIssue(role.data.role, role.data.can_invite, data.role)) throw new Error("Invite permission required");
  const requestOrigin = new URL(getRequest().url).origin;
  if (data.origin !== requestOrigin) throw new Error("Same-origin invitation required");
  const token = Array.from(crypto.getRandomValues(new Uint8Array(32)), b => b.toString(16).padStart(2, "0")).join("");
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const saved = await supabaseAdmin.from("testing_invitations").insert({ email: data.email, token_hash: await hashInvitation(token), role: data.role, created_by: context.userId, expires_at: new Date(Date.now() + data.days * 86400000).toISOString() }).select("id").single();
  if (saved.error || !saved.data) return { ok: false as const, message: "Invitation could not be created." };
  // Account invitation delivery is provider-limited; no email contents or token are logged.
  // Generate a provider invitation capability without sending email. Existing
  // accounts must authenticate themselves; never generate a login link for them.
  const delivery = await supabaseAdmin.auth.admin.generateLink({ type: "invite", email: data.email, options: { redirectTo: `${data.origin}/join` } });
  const providerToken = delivery.data?.properties?.hashed_token;
  if (delivery.error && delivery.error.code !== "email_exists" && delivery.error.code !== "user_already_exists") {
    await supabaseAdmin.from("testing_invitations").update({ revoked_at: new Date().toISOString() }).eq("id", saved.data.id);
    return { ok: false as const, message: "Account invitation could not be prepared; invitation revoked. No email sent." };
  }
  const fragment = new URLSearchParams({ code: token });
  if (providerToken) fragment.set("invite", providerToken);
  await supabaseAdmin.from("testing_audit").insert({ actor_id: context.userId, event: "invite_link_created", subject_id: saved.data.id });
  return { ok: true as const, code: `${data.origin}/join#${fragment}`, message: "Private single-use link created. No email sent. Deliver only to the intended email owner; existing users sign in with their own credentials." };
});

export const ownerSetupStatus = createServerFn({ method: "GET" }).handler(async () => ({
  configured: Boolean(process.env["VAULT_OWNER_EMAIL"]?.trim()),
}));