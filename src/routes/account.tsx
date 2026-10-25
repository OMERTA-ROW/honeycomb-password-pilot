import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { PageHead, VaultShell, meta } from "@/components/VaultShell";
import { supabase } from "@/integrations/supabase/client";
import { useAccount } from "@/hooks/use-account";
import { accountError, displayNameSchema } from "@/lib/account-policy";

export const Route = createFileRoute("/account")({ head: () => meta("Account & security", "Manage your Honeycomb Vault profile, account sessions and security activity. All private records are owner-scoped."), component: AccountPage });
function AccountPage() {
  const { user, ready, error, sessionId } = useAccount();
  const client = useQueryClient();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const account = useQuery({
    queryKey: ["account-private", user?.id, sessionId], enabled: Boolean(user && sessionId), refetchInterval: 30_000,
    queryFn: async () => {
      if (!user) throw new Error("Unauthorized");
      const [profile, sessions, activity] = await Promise.all([
        supabase.from("profiles").select("display_name,created_at").eq("id", user.id).single(),
        supabase.from("account_sessions").select("id,label,created_at,last_seen_at,expires_at,revoked_at").order("created_at", { ascending: false }),
        supabase.from("account_activity").select("id,event,occurred_at").order("occurred_at", { ascending: false }).limit(50),
      ]);
      if (profile.error || sessions.error || activity.error) throw new Error("Account data unavailable");
      return { profile: profile.data, sessions: sessions.data, activity: activity.data };
    },
  });
  useEffect(() => { if (account.data) setName(account.data.profile.display_name); }, [account.data]);
  useEffect(() => { if (ready && !user) client.removeQueries({ queryKey: ["account-private"] }); }, [ready, user, client]);
  async function save(event: FormEvent) {
    event.preventDefault(); if (!user) return;
    const result = displayNameSchema.safeParse(name);
    if (!result.success) { setMessage("Display name must be 80 characters or fewer."); return; }
    setBusy(true);
    try {
      const { data, error } = await supabase.from("profiles").update({ display_name: result.data }).eq("id", user.id).select("display_name").single();
      setMessage(error || !data ? "Profile could not be saved. Your session may have expired." : "Profile saved.");
      await client.invalidateQueries({ queryKey: ["account-private"] });
    } catch { setMessage(accountError()); } finally { setBusy(false); }
  }
  async function signOut() {
    if (!sessionId) return;
    setBusy(true);
    try {
      const revoked = await supabase.rpc("revoke_account_session", { target_id: sessionId });
      if (revoked.error) { setMessage("Session revocation failed. Try again; sign-out is not confirmed."); return; }
      await client.cancelQueries(); client.clear();
      const result = await supabase.auth.signOut({ scope: "local" });
      if (result.error) { setMessage("Vault account access revoked, but local sign-out failed. Retry sign-out."); return; }
      await navigate({ to: "/auth", replace: true });
    } catch { setMessage(accountError()); } finally { setBusy(false); }
  }
  async function revoke(id?: string) {
    if (id === sessionId) { await signOut(); return; }
    setBusy(true);
    try {
      const result = id ? await supabase.rpc("revoke_account_session", { target_id: id }) : await supabase.rpc("revoke_other_account_sessions");
      setMessage(result.error ? "Revocation could not be completed." : "Other registered Vault account access revoked. Wallet cards and Terminal accounts are unchanged.");
      await client.invalidateQueries({ queryKey: ["account-private"] });
    } catch { setMessage(accountError()); } finally { setBusy(false); }
  }
  return <VaultShell><PageHead title="Account & security" sub="Real account settings, separate from Demo vault and wallet records. Signing in does not encrypt or unlock vault contents." />
    {!ready ? <p>Checking account…</p> : !user ? <div className="space-y-3"><p role="status">{error || "Sign in to access private account records."}</p><Button asChild><Link to="/auth">Sign in / create account</Link></Button></div> : <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><div><p>{user.email}</p><span className="tag-ok">Real account · {user.email_confirmed_at ? "email verified" : "email not verified"}</span></div><Button variant="outline" onClick={signOut} disabled={busy}>Sign out</Button></div>
      {account.isPending ? <p>Loading private account records…</p> : account.isError ? <p role="alert" className="text-warning">Account data unavailable. Your session may be expired or revoked; sign in again.</p> : account.data && <>
        <form onSubmit={save} className="mb-6 max-w-md space-y-3"><label className="block text-sm">Display name<input value={name} maxLength={80} onChange={e => setName(e.target.value)} className="mt-1 block w-full rounded-md border bg-background p-2" autoComplete="nickname" /></label><Button type="submit" disabled={busy}>Save profile</Button></form>
        <h2 className="mb-3 font-medium">Registered Vault account sessions</h2><div className="card-grid mb-4">{account.data.sessions.map(s => <article key={s.id} className="panel text-xs"><div className="mb-2 flex flex-wrap gap-2"><h3 className="font-medium text-sm">{s.label}</h3><span className={s.revoked_at ? "tag-bad" : "tag-muted"}>{s.revoked_at ? "Revoked" : new Date(s.expires_at).getTime() <= Date.now() ? "Expired" : s.id === sessionId ? "This session" : "Active"}</span></div><p>Registered: {s.created_at}</p><p className="mt-1">Last observed: {s.last_seen_at}</p><p className="mt-1">Vault access expires: {s.expires_at}</p><Button className="mt-3" variant="outline" disabled={busy || Boolean(s.revoked_at)} onClick={() => revoke(s.id)}>Revoke {s.id === sessionId ? "& sign out" : "session"}</Button></article>)}</div><Button variant="outline" onClick={() => revoke()} disabled={busy}>Revoke other registered sessions</Button>
        <p className="my-4 text-xs text-muted-foreground">These are real registered account sessions, not cryptographic device enrollment or all provider sessions. Vault account access has a 7-day absolute limit and server-enforced revocation. Existing provider tokens may remain valid until expiry; these private records still deny revoked sessions. Already downloaded data cannot be recalled. No Apple/Google Wallet or Terminal access changes.</p>
        <h2 className="mb-3 font-medium">Security activity</h2><ul className="mb-6 space-y-2 text-xs">{account.data.activity.map(a => <li key={a.id} className="flex flex-wrap justify-between gap-2 border-b py-2"><span>{a.event.replaceAll("_", " ")}</span><time className="font-mono text-muted-foreground">{a.occurred_at}</time></li>)}</ul>
        <p className="text-xs text-muted-foreground">Server-timestamped session registration, revocation and profile updates only. This is not a full provider login/failure audit or tamper-evident log. Passwords, tokens and biometric templates are never stored in these records.</p>
      </>}
      <div className="mt-6 border-t pt-4 text-sm"><h2 className="mb-2 font-medium">Account recovery & security settings</h2><Button asChild variant="outline"><Link to="/auth">Request account password reset</Link></Button><p className="mt-3 text-muted-foreground">Verification and recovery use Cloud account emails. Changing email, MFA, passkeys, password change with current-password verification and profile preferences are queued, not implemented. Vault encryption/recovery decisions remain pending. Terminal shared identity requires separate authorization; no SSO exists.</p></div>
    </>}{message && <p role="status" className="mt-4 text-warning">{message}</p>}
  </VaultShell>;
}