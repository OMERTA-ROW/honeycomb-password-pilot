import { createFileRoute, Link } from "@tanstack/react-router";
import { VaultShell, Hex, meta } from "@/components/VaultShell";
import { sampleAccounts, sampleDevices } from "@/lib/sample-data";

export const Route = createFileRoute("/")({
  head: () => meta("Status", "Honeycomb Vault private preview — your access, under your control."),
  component: Index,
});

function Index() {
  const stale = sampleDevices.filter((d) => d.stale).length;
  return (
    <VaultShell showPromo>
      <section className="panel mb-4 flex flex-col gap-4 md:flex-row md:items-center">
        <Hex className="h-14 w-14 text-primary" />
        <div className="flex-1">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Vault status</p>
          <h1 className="text-2xl font-semibold">Locked · {sampleAccounts.length} sample accounts</h1>
          <p className="text-sm text-muted-foreground">Your access. Under your control.</p>
        </div>
        <Link to="/accounts" className="btn-primary">Start a password update batch →</Link>
      </section>
      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Devices" value={`${sampleDevices.length} enrolled`} note={stale ? `${stale} stale check-in` : "All current"} to="/devices" />
        <Card title="Digital Honey Pack" value="1 decoy alert" note="Review observed events" to="/honey-pack" />
        <Card title="Recovery" value="Ready" note="Use from another device" to="/recovery" />
      </div>
    </VaultShell>
  );
}

function Card({ title, value, note, to }: { title: string; value: string; note: string; to: string }) {
  return (
    <Link to={to} className="panel block hover:border-primary/60">
      <p className="text-xs text-muted-foreground">{title}</p>
      <p className="mt-1 text-lg font-medium">{value}</p>
      <p className="text-xs text-muted-foreground">{note} <span className="tag-sim ml-1">mock</span></p>
    </Link>
  );
}
