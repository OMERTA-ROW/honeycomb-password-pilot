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
  const delivery = await supabaseAdmin.auth.admin.inviteUserByEmail(data.email, { redirectTo: `${data.origin}/join` });
  await supabaseAdmin.from("testing_audit").insert({ actor_id: context.userId, event: delivery.error ? "invite_created_email_unconfirmed" : "invite_created_email_requested", subject_id: saved.data.id });
  return { ok: true as const, code: token, message: delivery.error ? "Invitation created; email request failed or account already exists. Share the one-time code privately with the intended tester." : "Invitation created; account invitation email requested, delivery unverified. Share the one-time code privately with the intended tester." };
});