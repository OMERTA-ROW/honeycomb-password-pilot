import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { VaultShell, PageHead, meta } from "@/components/VaultShell";
import { sampleHealth } from "@/lib/sample-data";
import { summarize, fixNextQueue, changePasswordUrls } from "@/lib/health";
import { generateReplacement } from "@/lib/batch";

export const Route = createFileRoute("/health")({
  head: () => meta("Password health", "Weak, reused and breached counts with a ranked Fix Next queue (sample data)."),
  component: Page,
});

function Page() {
  const [done, setDone] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState<string | null>(null);
  const [suggested, setSuggested] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const s = summarize(sampleHealth.map((a) => (done.has(a.id) ? { ...a, weak: false, breached: false, reuseGroup: undefined } : a)));
  const queue = fixNextQueue(sampleHealth, done);

  const start = (id: string) => {
    setOpen(id);
    setSuggested((m) => (m[id] ? m : { ...m, [id]: generateReplacement({ style: "random", length: 20, symbols: true }) }));
  };

  return (
    <VaultShell>
      <PageHead title="Password health" tag={<span className="tag-sim">Sample data</span>}
        sub="Flags are fictional sample values. Breach checking is not built yet, so 'breached' here is a sample label, not a real lookup." />
      <div className="card-grid mb-6 lg:grid-cols-4 xl:grid-cols-4">
        <Stat label="Overall score" value={`${s.score}/100`} accent />
        <Stat label="Weak" value={s.weak} />
        <Stat label="Reused" value={s.reused} />
        <Stat label="Breached (sample)" value={s.breached} />
      </div>

      <h2 className="mb-3 font-medium">Fix Next</h2>
      {queue.length === 0 && <p className="panel text-sm text-muted-foreground">Nothing left to fix in the sample vault.</p>}
      <div className="grid gap-4 md:grid-cols-2">
        {queue.map((a, i) => (
          <div key={a.id} className="panel space-y-3 text-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground">#{i + 1}</span>
              <span className="font-medium">{a.site}</span>
              {a.breached && <span className="tag-bad">breached</span>}
              {a.reused && <span className="tag-sim">reused</span>}
              {a.weak && <span className="tag-muted">weak</span>}
            </div>
            {a.passkey && <p className="text-info">This site supports passkeys (sample) — prefer setting up a passkey instead of a new password.</p>}
            {open !== a.id ? (
              <Button className="btn-primary" onClick={() => start(a.id)}>Fix this account</Button>
            ) : (
              <div className="space-y-3">
                <p className="text-muted-foreground">1. Open the site's change-password page (opens a new tab; nothing is sent from Vault).</p>
                <Button asChild className="btn-ghost">
                  <a href={changePasswordUrls(a.site)[0]} target="_blank" rel="noopener noreferrer">Open change-password page ↗</a>
                </Button>
                <p className="text-muted-foreground">2. Suggested unique password (sample — not stored anywhere):</p>
                <p className="mini-card break-all font-mono text-xs">{suggested[a.id]}</p>
                <div className="flex flex-wrap gap-2">
                  <Button className="btn-ghost" onClick={() => setSaved((x) => new Set(x).add(a.id))} disabled={saved.has(a.id)}>
                    {saved.has(a.id) ? "Saved to sample vault (memory only)" : "3. Save to vault (simulated)"}
                  </Button>
                  <Button className="btn-primary" disabled={!saved.has(a.id)}
                    onClick={() => { setDone((x) => new Set(x).add(a.id)); setOpen(null); }}>
                    4. I changed it on the site — mark done
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {done.size > 0 && <p className="mt-4 text-xs text-muted-foreground">{done.size} marked done by you. Vault cannot verify the site actually accepted the change.</p>}
    </VaultShell>
  );
}

function Stat({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className="panel">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`mt-1 text-2xl font-semibold ${accent ? "text-primary" : ""}`}>{value}</p>
    </div>
  );
}
