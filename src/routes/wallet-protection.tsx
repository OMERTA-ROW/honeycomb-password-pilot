import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CreditCard, Fingerprint, LockKeyhole, ShieldOff, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHead, VaultShell, meta } from "@/components/VaultShell";
import { sampleWalletRecords } from "@/lib/sample-data";
import { approveWalletDemo, canViewWalletDemo, initialWalletDemo, lockWalletDemo, performWalletDemo, type DemoAction, type DemoOutcome } from "@/lib/wallet-demo";

export const Route = createFileRoute("/wallet-protection")({
  head: () => meta("Wallet Protection", "Sample masked wallet records and staged native authentication design. Payment provisioning and NFC are unavailable."),
  component: WalletProtection,
});

const outcomes: { value: DemoOutcome; label: string }[] = [
  { value: "success", label: "Demo biometric success" },
  { value: "fallback", label: "Demo credential fallback" },
  { value: "canceled", label: "Canceled" },
  { value: "failed", label: "Failed" },
  { value: "lockout", label: "Biometric lockout" },
  { value: "unsupported", label: "Unsupported device" },
];

function WalletProtection() {
  const [state, setState] = useState(initialWalletDemo);
  const [now, setNow] = useState(0);
  const [outcome, setOutcome] = useState<DemoOutcome>("success");
  const [action, setAction] = useState<DemoAction>("unlock");
  const [message, setMessage] = useState("Demo: locked. No native authentication or encryption is active.");
  const [history, setHistory] = useState<{ time: string; event: string }[]>([]);
  const visible = canViewWalletDemo(state, now);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const timer = window.setInterval(tick, 500);
    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => {
    if (state.unlockedUntil > 0 && now >= state.unlockedUntil) {
      setState(lockWalletDemo(state));
      setMessage("Demo: timeout auto-locked sample records. Fresh authorization required.");
    }
  }, [now, state]);
  const record = (event: string) => setHistory(items => [{ time: new Date().toISOString(), event }, ...items].slice(0, 8));
  function approve() {
    const next = approveWalletDemo(state, action, outcome, Date.now());
    setState(next);
    setMessage(next.approval ? `Demo: approval for ${action === "unlock" ? "unlock only" : "this Vault session revocation only"}; expires in 15 seconds.` : "Demo: authorization denied. No action approved.");
    record(next.approval ? "Sample action approval granted" : `Sample authorization denied: ${outcome}`);
  }
  function execute() {
    const time = Date.now();
    const next = performWalletDemo(state, action, time);
    setState(next);
    setNow(time);
    const success = action === "unlock" ? canViewWalletDemo(next, time) : next.revoked && !state.revoked;
    setMessage(success ? action === "unlock" ? "Demo: sample records unlocked for 60 seconds. No biometric was collected." : "Demo: this sample Vault session revoked. Apple/Google Wallet cards and payments are unchanged." : "Demo: access denied. Fresh approval for this exact action is required.");
    record(success ? `Sample ${action} completed` : "Sample action denied");
  }
  return <VaultShell>
    <PageHead title="Wallet Protection" tag={<span className="tag-sim">Demo · staged</span>} sub="Permitted wallet-related records, not payment credentials. “ISO” is assumed to mean iOS / Apple Wallet." />
    <div className="card-grid mb-6">
      <div className="panel text-sm"><LockKeyhole className="mb-3 text-primary" aria-hidden="true" /><h2 className="font-medium">Record protection</h2><p className="mt-2 text-muted-foreground">On-device encryption, encrypted-only sync and secure auto-lock are planned, not implemented. Sample masked references only.</p></div>
      <div className="panel text-sm"><Fingerprint className="mb-3 text-primary" aria-hidden="true" /><h2 className="font-medium">Native authorization</h2><p className="mt-2 text-muted-foreground">Face ID / fingerprint / device credential unlock and action-specific step-up are planned. No face images, templates or custom recognition.</p></div>
      <div className="panel text-sm"><ShieldOff className="mb-3 text-primary" aria-hidden="true" /><h2 className="font-medium">Tap-to-pay unavailable</h2><p className="mt-2 text-muted-foreground">No provisioning or NFC in this preview. Vault cannot intercept, wrap, encrypt, control or block Apple/Google transactions or replace wallet security.</p></div>
    </div>
    <section className="mb-6 border-y py-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><h2 className="font-medium">Sample record access</h2><span className={visible ? "tag-ok" : "tag-sim"}>Demo · {state.revoked ? "session revoked" : visible ? "unlocked" : "locked"}</span></div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="min-w-0 space-y-3 text-sm">
          <label className="block">Proposed Vault action<select aria-label="Proposed Vault action" value={action} onChange={e => { setAction(e.target.value as DemoAction); setState(s => ({ ...s, approval: null })); }} className="mt-1 block w-full rounded-md border bg-background px-3 py-2"><option value="unlock">Unlock sample records</option><option value="revoke-vault-session">Revoke Demo Vault session</option></select></label>
          <label className="block">Demo authentication outcome<select aria-label="Demo authentication outcome" value={outcome} onChange={e => { setOutcome(e.target.value as DemoOutcome); setState(s => ({ ...s, approval: null })); }} className="mt-1 block w-full rounded-md border bg-background px-3 py-2">{outcomes.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select></label>
          <div className="flex flex-wrap gap-2"><Button onClick={approve} disabled={state.revoked}><Fingerprint />Demo authorize</Button><Button onClick={execute} disabled={state.revoked}>Demo perform action</Button><Button variant="outline" onClick={() => { setState(lockWalletDemo(state)); setMessage("Demo: sample records locked; approvals cleared."); record("Sample manual lock"); }} disabled={!visible}><LockKeyhole />Lock Demo</Button>{state.revoked && <Button variant="outline" onClick={() => { setState(initialWalletDemo); setMessage("Demo reset: locked. No real session was restored."); }}>Reset Demo</Button>}</div>
          <p role="status" className="text-warning">{message}</p>
          <p className="text-xs text-muted-foreground">Demo approval: 15 seconds, one named action only. Demo unlock: 60 seconds. Real timeout policy and key-backed authorization require native implementation and review. Web user verification cannot promise Face ID or fingerprint.</p>
        </div>
        <div className="space-y-3" aria-label="Sample wallet records">
          {visible ? sampleWalletRecords.map(item => <article key={item.id} className="panel text-sm"><div className="flex items-center gap-2"><CreditCard className="text-primary" aria-hidden="true" /><h3 className="font-medium">{item.label}</h3><span className="tag-sim">Demo</span></div><p className="my-3 font-mono text-xl text-primary">{item.masked}</p><p>{item.platform}</p><p className="mt-1 text-muted-foreground">{item.device} · fictional reference, not a usable card</p></article>) : <div className="flex min-h-48 items-center justify-center gap-3 rounded-md border bg-card p-5 text-sm text-muted-foreground"><LockKeyhole className="shrink-0 text-primary" aria-hidden="true" /><p>Demo access denied. Sample records remain hidden until authorized.</p></div>}
        </div>
      </div>
    </section>
    <h2 className="mb-3 font-medium">Platform assessment <span className="tag-muted">No integration selected</span></h2>
    <div className="mb-6 grid gap-4 md:grid-cols-2">
      <article className="panel text-sm"><h3 className="font-medium">Android / Google Wallet</h3><p className="my-3 text-muted-foreground">Planned: AndroidX BiometricPrompt + device-credential fallback, with capability/version checks and Keystore-backed action approval. Wallet pass APIs are not payment-card provisioning. Issuer/provider eligibility, region, native app and production access remain unverified.</p><Button asChild variant="outline"><a href="https://support.google.com/wallet/answer/7643925" target="_blank" rel="noopener noreferrer">Google Wallet help<ExternalLink /></a></Button></article>
      <article className="panel text-sm"><h3 className="font-medium">iOS / Apple Wallet</h3><p className="my-3 text-muted-foreground">Planned: LocalAuthentication + Keychain/Secure Enclave access controls, with passcode fallback and availability checks. Payment-card provisioning requires separate entitlement/provider eligibility; grant criteria, region and this app’s eligibility remain unverified.</p><Button asChild variant="outline"><a href="https://support.apple.com/en-us/101593" target="_blank" rel="noopener noreferrer">Apple lost-device guidance<ExternalLink /></a></Button></article>
    </div>
    <div className="mb-6 border-y py-4 text-sm text-muted-foreground"><h2 className="mb-2 font-medium text-foreground">Lost-device scope & safety gates</h2><p>Revocation is for OUR Vault sessions only; it cannot suspend payment cards or recall exposed data. Use official wallet, account and issuer controls. Payment authorization stays within Apple/Google/issuer flows; Vault cannot add approval to every external transaction.</p><p className="mt-2">Never provide full card numbers, CVV, PINs, payment keys or wallet tokens. No entry form or persistent wallet storage exists here. Real records require reviewed encryption foundations; any payment-data scope also requires provider architecture and compliance review.</p></div>
    <h2 className="mb-3 font-medium">Access history <span className="tag-sim">Demo · this page only</span></h2>
    {history.length ? <ul className="space-y-2 text-xs">{history.map((item, i) => <li key={`${item.time}-${i}`} className="flex flex-wrap justify-between gap-2 border-b py-2"><span>{item.event}</span><time className="font-mono text-muted-foreground">{item.time}</time></li>)}</ul> : <p className="text-sm text-muted-foreground">No sample access events this visit. Not an audit log or payment history.</p>}
  </VaultShell>;
}