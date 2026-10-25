import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Activity, KeyRound, Hexagon, LifeBuoy, Monitor, NotebookPen, FileDown, ListChecks, LockKeyhole } from "lucide-react";
import { HiveBackdrop } from "@/components/HiveBackdrop";

const nav = [
  { to: "/", label: "Status", icon: Activity },
  { to: "/accounts", label: "Password batches", icon: KeyRound },
  { to: "/honey-pack", label: "Digital Honey Pack", icon: Hexagon },
  { to: "/recovery", label: "Recovery", icon: LifeBuoy },
  { to: "/devices", label: "Devices", icon: Monitor },
  { to: "/incident-notes", label: "Incident notes", icon: NotebookPen },
  { to: "/evidence", label: "Evidence export", icon: FileDown },
  { to: "/roadmap", label: "Roadmap & pricing", icon: ListChecks },
] as const;

export function Hex({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M12 2l8.66 5v10L12 22l-8.66-5V7z" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="2.6" fill="currentColor" />
    </svg>
  );
}

export function VaultShell({ children, showPromo = false }: { children: ReactNode; showPromo?: boolean }) {
  return (
    <>
    <HiveBackdrop />
    <div className="vault-layout min-h-screen md:flex">
      <aside className="vault-sidebar min-w-0 border-b md:w-64 md:shrink-0 md:border-b-0 md:border-r p-4 md:py-8">
        <Link to="/" className="flex items-center gap-2 text-primary">
          <Hex />
          <span className="font-semibold tracking-tight text-foreground">Honeycomb Vault</span>
        </Link>
        <p className="mt-1 text-xs text-muted-foreground">Your access. Under your control.</p>
        <nav className="mt-5 flex gap-1 overflow-x-auto md:flex-col">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: true }}
              className="vault-nav-link shrink-0 whitespace-nowrap rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "bg-accent text-accent-foreground" }}>
              <n.icon className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
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
          Private preview · Simulation only · Sample data · No real passwords are stored or changed.
          </span>
        </div>
        {children}
        </div>
      </main>
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
