import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

const nav = [
  { to: "/", label: "Status" },
  { to: "/accounts", label: "Password batches" },
  { to: "/honey-pack", label: "Digital Honey Pack" },
  { to: "/recovery", label: "Recovery" },
  { to: "/devices", label: "Devices" },
  { to: "/incident-notes", label: "Incident notes" },
  { to: "/evidence", label: "Evidence export" },
  { to: "/roadmap", label: "Roadmap & pricing" },
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
    <div className="min-h-screen md:flex">
      <aside className="border-b md:w-64 md:shrink-0 md:border-b-0 md:border-r bg-card/70 p-4">
        <Link to="/" className="flex items-center gap-2 text-primary">
          <Hex />
          <span className="font-semibold tracking-tight text-foreground">Honeycomb Vault</span>
        </Link>
        <p className="mt-1 text-xs text-muted-foreground">Your access. Under your control.</p>
        <nav className="mt-5 flex gap-1 overflow-x-auto md:flex-col">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: true }}
              className="whitespace-nowrap rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary"
              activeProps={{ className: "bg-accent text-accent-foreground" }}>
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
      <main className="flex-1 p-4 md:p-8">
        <div className="mb-4 rounded-lg border border-warning/40 bg-warning/10 px-3 py-2 text-xs text-warning">
          Private preview · Simulation only · Sample data · No real passwords are stored or changed.
        </div>
        {children}
      </main>
    </div>
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
