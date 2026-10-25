import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { PageHead, VaultShell, meta } from "@/components/VaultShell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { accountError, isRecoveryFlow } from "@/lib/account-policy";
export const Route = createFileRoute("/reset-password")({ head: () => meta("Reset account password", "Reset a Honeycomb Vault account password using a verified recovery session. This does not recover vault encryption keys."), component: ResetPassword });
function ResetPassword() {
  const [allowed, setAllowed] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    const fromRecoveryLink = isRecoveryFlow(window.location.hash);
    const { data } = supabase.auth.onAuthStateChange(event => { if (event === "PASSWORD_RECOVERY") setAllowed(true); });
    if (fromRecoveryLink) void supabase.auth.getUser().then(({ data, error }) => setAllowed(!error && Boolean(data.user)));
    return () => data.subscription.unsubscribe();
  }, []);
  async function submit(event: FormEvent) {
    event.preventDefault(); if (!allowed || password !== confirm) { setMessage("Passwords must match and a valid recovery link is required."); return; }
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) setMessage(accountError(error.code));
      else { setPassword(""); setConfirm(""); setAllowed(false); await supabase.auth.signOut({ scope: "global" }); setMessage("Account password reset. Sign in again. Vault recovery keys were not changed."); }
    } catch { setMessage(accountError()); } finally { setBusy(false); }
  }
  return <VaultShell><PageHead title="Reset account password" sub="Account recovery is separate from encrypted-vault recovery; it cannot restore vault keys." />{allowed ? <form onSubmit={submit} className="max-w-md space-y-4"><label className="block">New account password<input type="password" required autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 block w-full rounded-md border bg-background p-2" /></label><label className="block">Confirm account password<input type="password" required autoComplete="new-password" value={confirm} onChange={e => setConfirm(e.target.value)} className="mt-1 block w-full rounded-md border bg-background p-2" /></label><Button type="submit" disabled={busy}>Reset account password</Button></form> : <p className="text-sm text-muted-foreground">Open a valid account recovery link from your email. No password change is permitted here without it.</p>}{message && <p role="status" className="my-4 text-warning">{message}</p>}<Button asChild variant="outline" className="mt-4"><Link to="/auth">Back to account access</Link></Button></VaultShell>;
}