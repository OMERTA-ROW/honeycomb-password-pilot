import { createFileRoute } from "@tanstack/react-router";
import { VaultShell, PageHead, meta } from "@/components/VaultShell";

export const Route = createFileRoute("/roadmap")({
  head: () => meta("Roadmap & pricing", "What works in the preview, what is mocked, and proposed pricing."),
  component: Page,
});

const working = ["Responsive preview shell and branding", "Simulated batch flow: per-account replacement, generator preferences, preview/authorize, MFA pause, verification, outcome report", "Sample evidence file download"];
const mocked = ["Vault unlock state (shows Locked; no unlock exists)", "Digital Honey Pack alerts", "Recovery actions", "Device check-ins and locations", "Vault lock status"];
const notBuilt = ["Desktop browser extension / companion (first priority)", "Mobile autofill where feasible", "On-device encryption; encrypted sync the server cannot decrypt", "Device-backed keys, biometrics, hardware keys, passkeys", "Stronger export & new-device verification, auto-lock, session revocation, key rotation", "Find Nearby (OS/UWB dependent)", "Tamper-evident event chain", "Real sign-in, vault unlock and connecting account sources", "Real password changes on any website (first target: a small set of explicitly supported desktop sites)", "Accounts, billing, real decoy service"];

function List({ title, items, tag }: { title: string; items: string[]; tag: string }) {
  return <div className="panel"><h2 className="mb-2 flex items-center gap-2 font-medium">{title}<span className={tag}>{items.length}</span></h2><ul className="space-y-1 text-sm text-muted-foreground">{items.map((i) => <li key={i}>• {i}</li>)}</ul></div>;
}

function Page() {
  return (
    <VaultShell showPromo>
      <PageHead title="Roadmap & proposed pricing" sub="Honest status. Key management and recovery require independent security review before launch." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <List title="Working in preview" items={working} tag="tag-ok" />
        <List title="Mocked interfaces" items={mocked} tag="tag-sim" />
        <List title="Not implemented" items={notBuilt} tag="tag-bad" />
      </div>
      <h2 className="mt-8 mb-3 flex items-center gap-2 font-medium">Pricing <span className="tag-sim">proposed only · no billing</span></h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-sm">
        <div className="panel"><p className="font-medium">Individual</p><p className="text-xl text-primary">$4.99/mo · $49/yr</p><p className="text-muted-foreground">1 user, 10 devices</p></div>
        <div className="panel"><p className="font-medium">Household</p><p className="text-xl text-primary">$9.99/mo · $99/yr</p><p className="text-muted-foreground">6 private vaults, 30 devices</p></div>
        <div className="panel"><p className="font-medium">VPN add-on</p><p className="text-xl text-muted-foreground">$7.99/mo · $79/yr</p><p className="text-muted-foreground">Possible later, subject to costs. Outside initial core.</p></div>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">Name, domain and trademark are not cleared. Prices are proposals, not launched plans or validated margins (audits, support, storage, fees and acquisition costs not yet costed). No universal site control and no Google Password Manager write-back are assumed. Malwarebytes: affiliate interest only — no application, partnership, tracked link, or bundle exists; bundling would need reseller terms. Malware scanning is outside the core build. Parrot Security OS is a possible test environment, not a security guarantee. No product is "unhackable".</p>
    </VaultShell>
  );
}
