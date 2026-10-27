import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { VaultShell, PageHead, meta } from "@/components/VaultShell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { hashInvitation } from "@/lib/invitation-policy";
import { accountError } from "@/lib/account-policy";
import { useAccount } from "@/hooks/use-account";
export const Route = createFileRoute("/join")({ head: () => meta("Accept private invitation", "Email-bound single-use memberships for independently verified Honeycomb Vault accounts."), component: Join });
function Join() {
  const [code, setCode] = useState(""); const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); const [busy, setBusy] = useState(false);
  const { user, ready, refresh } = useAccount(); const navigate = useNavigate();
  useEffect(() => {
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    setCode(fragment.get("code") ?? "");
    if (fragment.has("invite")) setMessage("Older activation links are not accepted here. Independently verify your account email and ask for a new membership-only invitation.");
    if (window.location.hash) history.replaceState(null, "", "/join");
  }, []);
  async function signIn(event: FormEvent) {
    event.preventDefault(); setBusy(true); setMessage("");
    try { const result = await supabase.auth.signInWithPassword({ email, password }); setPassword(""); if (result.error) setMessage(accountError(result.error.code)); else await refresh(); }
    catch { setMessage(accountError()); } finally { setBusy(false); }
  }
  async function accept() {
    setBusy(true); setMessage("");
    try {
      const identity = await supabase.auth.getUser();
      if (identity.error || !identity.data.user?.email_confirmed_at) { setMessage("Sign in with the independently verified email this invitation belongs to."); return; }
      const result = await supabase.rpc("accept_testing_invitation", { invite_token_hash: await hashInvitation(code.trim()) });
      if (result.error) { setMessage("Invitation unavailable: expired, revoked, used, or assigned to another email."); return; }
      setCode(""); await refresh(); await navigate({ to: "/dashboard", replace: true });
    } catch { setMessage("Invitation could not be accepted."); } finally { setBusy(false); }
  }
  async function signOut() {
    setBusy(true);
    try { const result = await supabase.auth.signOut({ scope: "local" }); if (result.error) setMessage("Sign-out failed. Try again."); else await refresh(); }
    catch { setMessage(accountError()); } finally { setBusy(false); }
  }
  return <VaultShell accountMode><PageHead title="Accept private invitation" sub="Each tester uses their own verified account. A membership link does not create an account or prove email control." /><div className="max-w-lg space-y-4">
    <label className="block text-sm">One-time invitation code<input value={code} onChange={e => setCode(e.target.value)} autoComplete="off" className="mt-1 w-full rounded-md border bg-background p-2" /></label>
    {!ready ? <p>Checking account…</p> : user ? <div className="space-y-3"><p>Signed in as {user.email}</p><Button variant="outline" disabled={busy} onClick={signOut}>Use another account</Button></div> : <form onSubmit={signIn} className="space-y-3"><label className="block text-sm">Account email<input required type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 w-full rounded-md border bg-background p-2" /></label><label className="block text-sm">Account password<input required type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 w-full rounded-md border bg-background p-2" /></label><Button type="submit" disabled={busy}>Sign in to accept</Button><p className="text-sm text-muted-foreground">New accounts require trusted account provisioning and independent email confirmation. Public signup is disabled. Your invitation stays on this page during sign-in; reopening the original link restores it after leaving or reloading.</p></form>}
    <Button disabled={busy || !code || !user || !ready} onClick={accept}>{busy ? "Checking…" : "Accept invitation"}</Button>{message && <p role="status" className="text-warning">{message}</p>}
  </div></VaultShell>;
}
