import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Activity, ShieldCheck, Users, HeartPulse, KeyRound, Hexagon, LifeBuoy, Monitor, NotebookPen, FileDown, ListChecks, LockKeyhole, Wallet, UserRound } from "lucide-react";
import { HiveBackdrop } from "@/components/HiveBackdrop";
import { useAccount } from "@/hooks/use-account";

const nav = [
  { to: "/", label: "Status", icon: Activity },
  { to: "/health", label: "Password health", icon: HeartPulse },
  { to: "/spam-shield", label: "Spam Shield", icon: ShieldCheck },
  { to: "/accounts", label: "Password batches", icon: KeyRound },
  { to: "/honey-pack", label: "Digital Honey Pack", icon: Hexagon },
  { to: "/recovery", label: "Recovery", icon: LifeBuoy },
  { to: "/devices", label: "Devices", icon: Monitor },
  { to: "/wallet-protection", label: "Wallet Protection", icon: Wallet },
  { to: "/incident-notes", label: "Incident notes", icon: NotebookPen },
  { to: "/evidence", label: "Evidence export", icon: FileDown },
  { to: "/security-model", label: "Security model", icon: ShieldCheck },
  { to: "/emergency-access", label: "Emergency access", icon: Users },
  { to: "/account", label: "Account & security", icon: UserRound },
  { to: "/roadmap", label: "Roadmap & pricing", icon: ListChecks },
] as const;

export function Hex({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M12 2l8.66 5v10L12 22l-8.66-5V7z" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M12 7.2l4.16 2.4v4.8L12 16.8l-4.16-2.4V9.6z" fill="none" stroke="currentColor" strokeWidth="1.1" />
      <path d="M12 2v5.2M20.66 7l-4.5 2.6M20.66 17l-4.5-2.6M12 22v-5.2M3.34 17l4.5-2.6M3.34 7l4.5 2.6" fill="none" stroke="currentColor" strokeWidth="0.7" opacity="0.7" />
    </svg>
  );
}

export function VaultShell({ children, showPromo = false, accountMode = false }: { children: ReactNode; showPromo?: boolean; accountMode?: boolean }) {
  const { user, sessionId } = useAccount();
  return (
    <>
    <HiveBackdrop />
    <div className="vault-frame-wrap">
      <div className="vault-frame">
        <header className="vault-topbar">
          <span className="vault-dots" aria-hidden="true"><i /><i /><i /></span>
          <Link to="/" className="flex min-w-0 items-center gap-3 text-primary">
            <Hex />
            <span className="vault-wordmark">Honeycomb Vault</span>
          </Link>
          <p className="vault-tagline">Your access. Under your control.</p>
        </header>
        <div className="vault-layout md:flex">
          <aside className="vault-sidebar min-w-0 border-b md:w-64 md:shrink-0 md:border-b-0 p-4 md:py-6">
            <Link to={sessionId ? "/dashboard" : "/auth"} search={{ returnTo: "/dashboard", recovery: false }} className="vault-nav-link mb-3 rounded-md px-3 py-2.5 text-sm text-primary"><UserRound className="h-4 w-4 shrink-0" aria-hidden="true" />{sessionId ? "Private dashboard" : user ? "Account access" : "Private sign in"}</Link>
            <nav className="flex gap-1.5 overflow-x-auto md:flex-col" aria-label="Vault sections">
              {nav.map((n) => (
                <Link key={n.to} to={n.to} activeOptions={{ exact: true }}
                  className="vault-nav-link shrink-0 whitespace-nowrap rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground"
                  activeProps={{ className: "vault-nav-active" }}>
                  <n.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {n.label}
                </Link>
              ))}
            </nav>
            {showPromo && (
              <div className="mt-6 hidden rounded-lg border border-dashed p-3 text-xs text-muted-foreground md:block">
                <span className="tag-muted">Promo</span>
                <p className="mt-2">Also from Honeycomb: <span className="text-foreground">Honeycomb Terminal</span>. Separate product.</p>
              </div>
            )}
          </aside>
          <main className="vault-main min-w-0 flex-1">
            <div className="vault-content">
            <div className="mb-6 flex items-start gap-2 rounded-md border border-warning/40 bg-card px-3 py-3 text-xs leading-relaxed text-warning">
              <LockKeyhole className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>
              {accountMode ? "Private preview · Real account access only · Vault and wallet records remain Demo · No vault encryption or payment integration." : "Private preview · Simulation only · Sample data · No real vault passwords are stored or changed."}
              </span>
            </div>
            {children}
            </div>
          </main>
        </div>
      </div>
    </div>
    </>
  );
}

export function PageHead({ title, sub, tag }: { title: string; sub: string; tag?: ReactNode }) {
  return (
    <header className="mb-6">
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {tag}
      </div>
      <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{sub}</p>
    </header>
  );
}

export const meta = (title: string, description: string) => ({
  meta: [
    { title: `${title} · Honeycomb Vault` },
    { name: "description", content: description },
    { property: "og:title", content: `${title} · Honeycomb Vault` },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ],
});
