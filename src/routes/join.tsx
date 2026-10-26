import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { VaultShell, PageHead, meta } from "@/components/VaultShell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { hashInvitation } from "@/lib/invitation-policy";
import { useAccount } from "@/hooks/use-account";
export const Route = createFileRoute("/join")({ head: () => meta("Accept private invitation", "Single-use private testing invitations for Honeycomb Vault."), component: Join });
function Join() {
  const [code, setCode] = useState(""); const [password, setPassword] = useState(""); const [confirm, setConfirm] = useState(""); const [providerToken,setProviderToken] = useState(""); const [message,setMessage] = useState(""); const [busy,setBusy] = useState(false);
  const { refresh } = useAccount(); const navigate = useNavigate();
  useEffect(() => { const f = new URLSearchParams(window.location.hash.slice(1)); setCode(f.get("code") ?? ""); setProviderToken(f.get("invite") ?? ""); if (window.location.hash) history.replaceState(null, "", "/join"); }, []);
  async function accept() {
    setBusy(true); setMessage("");
    try {
      if (providerToken) {
        if (password.length < 12 || password !== confirm) { setMessage("Use matching account passwords of at least 12 characters."); return; }
        const verified = await supabase.auth.verifyOtp({ token_hash: providerToken, type: "invite" });
        if (verified.error) { setMessage("Account invitation invalid, used or expired. Request a new private link."); return; }
        setProviderToken("");
        const saved = await supabase.auth.updateUser({ password });
        setPassword(""); setConfirm("");
        if (saved.error) { setMessage("Password setup failed. Use account recovery; membership has not been accepted."); return; }
      }
      const identity = await supabase.auth.getUser();
      if (!identity.data.user?.email_confirmed_at) { setMessage("Sign in with the verified email this invitation belongs to, then accept the code."); return; }
      const result = await supabase.rpc("accept_testing_invitation", { invite_token_hash: await hashInvitation(code.trim()) });
      if (result.error) { setMessage("Invitation unavailable: expired, revoked, used, or assigned to another email."); return; }
      setCode(""); await refresh(); await navigate({ to: "/dashboard", replace: true });
    } catch { setMessage("Invitation could not be accepted."); } finally { setBusy(false); }
  }
  return <VaultShell accountMode><PageHead title="Accept private invitation" sub="Each tester uses their own account. Invitation links are private, email-bound and single-use; no shared credentials." /><div className="max-w-lg space-y-4">
    <label className="block text-sm">One-time invitation code<input value={code} onChange={e => setCode(e.target.value)} autoComplete="off" className="mt-1 w-full rounded-md border bg-background p-2" /></label>
    {providerToken && <><label className="block text-sm">Create account password<input type="password" minLength={12} autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 w-full rounded-md border bg-background p-2" /></label><label className="block text-sm">Confirm account password<input type="password" autoComplete="new-password" value={confirm} onChange={e => setConfirm(e.target.value)} className="mt-1 w-full rounded-md border bg-background p-2" /></label></>}
    <Button disabled={busy || !code} onClick={accept}>{busy ? "Checking…" : "Accept invitation"}</Button><Button asChild variant="outline"><Link to="/auth" search={{ returnTo: "/join", recovery: false }}>Sign in to existing account</Link></Button>{message && <p role="status" className="text-warning">{message}</p>}
    </div></VaultShell>;
}
