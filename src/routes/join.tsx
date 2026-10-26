import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { VaultShell, PageHead, meta } from "@/components/VaultShell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { bootstrapOwner } from "@/lib/testing.functions";
import { hashInvitation } from "@/lib/invitation-policy";
export const Route = createFileRoute("/join")({ head: () => meta("Accept private invitation", "Verified invitation-only testing for Honeycomb Vault. No real vault secrets."), component: Join });
function Join() {
  const [code, setCode] = useState(""); const [password, setPassword] = useState(""); const [message, setMessage] = useState(""); const [busy,setBusy]=useState(false);
  const bootstrap = useServerFn(bootstrapOwner);
  async function accept() {
    setBusy(true);
    try {
      const identity = await supabase.auth.getUser();
      if (!identity.data.user?.email_confirmed_at) { setMessage("Open your account invitation email or sign in to your verified account first."); return; }
      const result = await supabase.rpc("accept_testing_invitation", { invite_token_hash: await hashInvitation(code.trim()) });
      if (result.error) { setMessage("Invitation unavailable: it may be expired, revoked, used or assigned to another verified account."); return; }
      if (password) {
        const saved = await supabase.auth.updateUser({ password });
        if (saved.error) { setMessage("Membership accepted; password setup was not confirmed. Use account recovery before signing in again."); return; }
      }
      setCode("");setPassword("");setMessage("Invitation accepted. Open your private account.");
    } catch { setMessage("Invitation could not be accepted."); } finally { setBusy(false); }
  }
  return <VaultShell accountMode><PageHead title="Private testing invitation" sub="Verified account access only. Invitation codes are single-use and must match your confirmed email." />
    <div className="max-w-lg space-y-4"><label className="block text-sm">One-time invitation code<input value={code} onChange={e=>setCode(e.target.value)} autoComplete="off" className="mt-1 w-full rounded-md border bg-background p-2" /></label><label className="block text-sm">New account password (email invitation setup only)<input type="password" autoComplete="new-password" value={password} onChange={e=>setPassword(e.target.value)} className="mt-1 w-full rounded-md border bg-background p-2" /></label><Button disabled={busy || !code} onClick={accept}>Accept invitation</Button><Button asChild variant="outline"><Link to="/auth">Sign in</Link></Button><Button asChild variant="outline"><Link to="/account">Open private account</Link></Button>
    <div className="border-t pt-4"><h2 className="mb-2 font-medium">Verified owner setup</h2><p className="mb-3 text-xs text-muted-foreground">Requires a verified account matching trusted owner configuration. Never assigns ownership to the first visitor.</p><Button variant="outline" disabled={busy} onClick={async()=>{setBusy(true);try{setMessage((await bootstrap()).message);}catch{setMessage("Sign in to your verified, configured owner account first.");}finally{setBusy(false);}}}>Verify configured owner</Button></div>{message && <p role="status" className="text-warning">{message}</p>}</div>
  </VaultShell>;
}