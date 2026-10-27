import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { PageHead, VaultShell, meta } from "@/components/VaultShell";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import "@lovable.dev/cloud-auth-js/styles.css";
import { useAccount } from "@/hooks/use-account";
import { accountError } from "@/lib/account-policy";
import { useQueryClient } from "@tanstack/react-query";
import { safeReturnTo } from "@/lib/access-policy";
export const Route = createFileRoute("/auth")({ validateSearch: (s: Record<string, unknown>) => ({ returnTo: safeReturnTo(s["returnTo"]), recovery: s["recovery"] === true || s["recovery"] === "true" }), head: () => meta("Private sign in", "Invitation-only Honeycomb Vault accounts. Authentication does not encrypt vault secrets."), component: AuthPage });
function AuthPage() {
  const { user, ready, error, sessionId, refresh } = useAccount(); const search = Route.useSearch(); const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [reset, setReset] = useState(search.recovery); const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [message, setMessage] = useState(""); const [busy, setBusy] = useState(false);
  useEffect(() => { if (ready && sessionId && !reset) void navigate({ to: safeReturnTo(search.returnTo), replace: true }); }, [ready, sessionId, reset, navigate, search.returnTo]);
  async function submit(e: FormEvent) {
    e.preventDefault(); setBusy(true); setMessage("");
    try {
      if (reset) { const r = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + "/reset-password" }); setMessage(r.error ? accountError(r.error.code) : "Reset request accepted. If eligible, check your email. Delivery is unverified."); }
      else { const r = await supabase.auth.signInWithPassword({ email, password }); setPassword(""); if (r.error) setMessage(accountError(r.error.code)); else { await refresh(); setMessage("Identity confirmed. Checking private membership…"); } }
    } catch { setMessage(accountError()); } finally { setBusy(false); }
  }
  async function signOut() { setBusy(true); try { await queryClient.cancelQueries(); queryClient.clear(); const revoked = sessionId ? await supabase.rpc("revoke_account_session", { target_id: sessionId }) : null; const result = await supabase.auth.signOut({ scope: "local" }); if (result.error) setMessage("Sign-out failed. Retry; no success assumed."); else { await refresh(); setMessage(revoked?.error ? "Local sign-out completed; server session revocation unconfirmed." : "Signed out."); } } catch { setMessage(accountError()); } finally { setBusy(false); } }
  async function social(provider: "google" | "lovable") { setBusy(true); try { sessionStorage.setItem("vault-return-to", safeReturnTo(search.returnTo)); const r = await lovable.auth.signInWithOAuth(provider, { redirect_uri: window.location.origin + "/auth" }); if (r.error) setMessage(accountError()); } catch { setMessage(accountError()); } finally { setBusy(false); } }
  return <VaultShell accountMode><PageHead title={reset ? "Account recovery" : "Private sign in"} sub="Invitation-only accounts. Public self-signup is disabled. Account passwords are separate from vault secrets." />
    {!ready ? <p>Checking account…</p> : user && !reset ? <div className="space-y-3"><p>{sessionId ? "Login confirmed." : error}</p><Button asChild><Link to={sessionId ? "/dashboard" : "/join"}>{sessionId ? "Dashboard" : "Accept invitation"}</Link></Button><Button asChild variant="outline"><Link to="/owner-setup">Owner setup</Link></Button><Button variant="outline" onClick={signOut} disabled={busy}>Sign out</Button></div> : <div className="max-w-lg space-y-5">
    <div className="flex flex-wrap gap-2"><Button onClick={() => setReset(false)} variant={!reset ? "default" : "outline"}>Sign in</Button><Button onClick={() => setReset(true)} variant={reset ? "default" : "outline"}>Forgot password</Button></div>
    <form onSubmit={submit} className="space-y-4"><label className="block text-sm">Email<input required type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full rounded-md border bg-background px-3 py-2" /></label>{!reset && <label className="block text-sm">Account password<input required type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 block w-full rounded-md border bg-background px-3 py-2" /></label>}<Button disabled={busy} type="submit">{busy ? "Please wait…" : reset ? "Request reset email" : "Sign in with email"}</Button></form>
    {!reset && <div className="flex flex-wrap gap-3"><Button variant="outline" onClick={() => social("google")} disabled={busy}>Continue with Google</Button><Button onClick={() => social("lovable")} disabled={busy}>Continue with Lovable</Button></div>}
    <Button asChild variant="outline"><Link to="/join">Accept invitation</Link></Button><Button asChild variant="outline"><Link to="/owner-setup">Owner setup</Link></Button>
    </div>}{message && <p role="status" className="mt-4 text-warning">{message}</p>}
  </VaultShell>;
}
