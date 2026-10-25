import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { PageHead, VaultShell, meta } from "@/components/VaultShell";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import "@lovable.dev/cloud-auth-js/styles.css";
import { useAccount } from "@/hooks/use-account";
import { accountError } from "@/lib/account-policy";

export const Route = createFileRoute("/auth")({ head: () => meta("Account access", "Sign in or create a Honeycomb Vault account. Account identity does not encrypt or unlock Demo vault records."), component: AuthPage });
function AuthPage() {
  const { user, ready, error } = useAccount();
  const [mode, setMode] = useState<"login" | "signup" | "reset">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true); setMessage("");
    try {
      if (mode === "reset") {
        const result = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + "/reset-password" });
        setMessage(result.error ? accountError(result.error.code) : "Reset request accepted. If this account is eligible, check your email. Delivery is not confirmed here.");
      } else if (mode === "signup") {
        const result = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + "/auth" } });
        setPassword("");
        setMessage(result.error ? accountError(result.error.code) : result.data.session ? "Account session created. Vault records remain Demo." : "Signup request accepted. Verify your email before signing in. Delivery is not confirmed here.");
      } else {
        const result = await supabase.auth.signInWithPassword({ email, password });
        setPassword(""); setMessage(result.error ? accountError(result.error.code) : "Signed in. Account identity does not unlock or encrypt the vault.");
      }
    } catch { setMessage(accountError()); } finally { setBusy(false); }
  }
  async function social(provider: "google" | "lovable") {
    setBusy(true); setMessage("");
    try { const result = await lovable.auth.signInWithOAuth(provider, { redirect_uri: window.location.origin + "/auth" }); if (result.error) setMessage(accountError()); } catch { setMessage(accountError()); } finally { setBusy(false); }
  }
  return <VaultShell accountMode><PageHead title="Account access" sub="Real account identity. Vault and Wallet Protection still use Demo records; authentication is not vault encryption." />
    {!ready ? <p>Checking account…</p> : user ? <div className="space-y-3"><p>Signed in as {user.email}</p><Button asChild><Link to="/account">Account & security</Link></Button></div> : <div className="max-w-lg space-y-5">
      {error && <p role="alert" className="text-warning">{error}</p>}
      <div className="flex flex-wrap gap-2" aria-label="Account access mode">{(["login", "signup", "reset"] as const).map(m => <Button key={m} variant={mode === m ? "default" : "outline"} onClick={() => { setMode(m); setMessage(""); setPassword(""); }} aria-pressed={mode === m}>{m === "login" ? "Sign in" : m === "signup" ? "Create account" : "Forgot password"}</Button>)}</div>
      <form onSubmit={submit} className="space-y-4"><label className="block text-sm">Email<input required type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full rounded-md border bg-background px-3 py-2" /></label>{mode !== "reset" && <label className="block text-sm">Account password<input required type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} value={password} onChange={e => setPassword(e.target.value)} className="mt-1 block w-full rounded-md border bg-background px-3 py-2" /></label>}<Button type="submit" disabled={busy}>{busy ? "Please wait…" : mode === "login" ? "Sign in with email" : mode === "signup" ? "Submit signup" : "Request reset email"}</Button></form>
      {mode !== "reset" && <div className="flex flex-wrap gap-3"><Button variant="outline" onClick={() => social("google")} disabled={busy}>Continue with Google</Button><Button className="lovable-auth-button" onClick={() => social("lovable")} disabled={busy}>Continue with Lovable</Button></div>}
      <p className="text-xs text-muted-foreground">Use an account password, never a vault master password or recovery code. Email confirmation stays on. Default Cloud auth sender is configured; email delivery and social sign-in remain to be verified.</p>
    </div>}{message && <p role="status" className="mt-4 text-warning">{message}</p>}
  </VaultShell>;
}