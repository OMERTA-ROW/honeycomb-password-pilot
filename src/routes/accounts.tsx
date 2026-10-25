import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { VaultShell, PageHead, meta } from "@/components/VaultShell";
import { sampleAccounts } from "@/lib/sample-data";
import { runBatch, itemIssues, recoveryGuidance, generateReplacement, type BatchItem, type Outcome, type GenPrefs, type GenStyle } from "@/lib/batch";

export const Route = createFileRoute("/accounts")({
  head: () => meta("Password batches", "Guided, simulated password update batches with MFA pauses and verification."),
  component: Accounts,
});

type Step = "select" | "preview" | "running" | "report";
const tagFor: Record<Outcome, string> = { completed: "tag-ok", waiting: "tag-info", unsupported: "tag-muted", failed: "tag-bad" };

function Accounts() {
  const [step, setStep] = useState<Step>("select");
  const [items, setItems] = useState<Record<string, BatchItem>>({});
  const [prefs, setPrefs] = useState<GenPrefs>({ style: "random", length: 20, symbols: true, words: 5 });
  const [mfa, setMfa] = useState<Set<string>>(new Set());
  const [result, setResult] = useState<Record<string, Outcome>>({});
  const chosen = Object.values(items);
  const [sample, setSample] = useState("");
  useEffect(() => setSample(generateReplacement(prefs).slice(0, 18)), [prefs]);

  const toggle = (id: string) => setItems((s) => {
    const n = { ...s };
    if (n[id]) delete n[id]; else n[id] = { accountId: id, mode: "generate" };
    return n;
  });
  const run = (approved: Set<string>) => { setResult(runBatch(sampleAccounts, chosen, approved)); setStep("report"); };
  const waiting = Object.entries(result).filter(([, o]) => o === "waiting").map(([id]) => id);

  return (
    <VaultShell>
      <PageHead title="Guided password update batch" tag={<span className="tag-sim">Simulation</span>}
        sub="Pick accounts, choose a replacement for each, preview, authorize. Nothing is sent to any website." />

      {step === "select" && (
        <>
          <div className="panel mb-4 flex flex-wrap items-center gap-4 text-sm">
            <span className="text-muted-foreground">Generation preferences:</span>
            <select aria-label="Style" value={prefs.style} onChange={(e) => setPrefs({ ...prefs, style: e.target.value as GenStyle })} className="rounded border bg-background px-2 py-1">
              <option value="random">Random characters</option>
              <option value="passphrase">Passphrase</option>
            </select>
            {prefs.style === "passphrase" ? (
              <label className="flex items-center gap-2">Words
                <input type="number" min={4} max={10} value={prefs.words} aria-label="Words"
                  onChange={(e) => setPrefs({ ...prefs, words: +e.target.value })} className="w-16 rounded border bg-background px-2 py-1" />
              </label>
            ) : (
              <label className="flex items-center gap-2">Length
                <input type="number" min={12} max={64} value={prefs.length} aria-label="Length"
                  onChange={(e) => setPrefs({ ...prefs, length: +e.target.value })} className="w-16 rounded border bg-background px-2 py-1" />
              </label>
            )}
            <label className="flex items-center gap-2"><input type="checkbox" checked={prefs.symbols} onChange={(e) => setPrefs({ ...prefs, symbols: e.target.checked })} />Symbols</label>
            <span className="text-xs text-muted-foreground">Each account gets its own independent value.</span>
            <span className="font-mono text-xs text-muted-foreground">e.g. {sample}…</span>
          </div>
          <ul className="space-y-2">
            {sampleAccounts.map((a) => {
              const it = items[a.id];
              return (
                <li key={a.id} className="panel flex flex-col gap-3 md:flex-row md:items-center">
                  <label className="flex flex-1 items-center gap-3">
                    <input type="checkbox" checked={!!it} onChange={() => toggle(a.id)} aria-label={`Select ${a.site}`} />
                    <span><span className="font-medium">{a.site}</span> <span className="text-xs text-muted-foreground">{a.username}</span></span>
                    {a.requiresMfa && <span className="tag-info">MFA</span>}
                    {!a.supported && <span className="tag-muted">no supported flow</span>}
                  </label>
                  {it && (
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <select value={it.mode} aria-label={`Mode for ${a.site}`} className="rounded border bg-background px-2 py-1"
                        onChange={(e) => setItems({ ...items, [a.id]: { ...it, mode: e.target.value as BatchItem["mode"] } })}>
                        <option value="generate">Generate</option>
                        <option value="manual">Enter my own</option>
                      </select>
                      {it.mode === "manual" && (
                        <input type="password" placeholder="Sample only — not a real password" autoComplete="off" value={it.manualValue ?? ""}
                          onChange={(e) => setItems({ ...items, [a.id]: { ...it, manualValue: e.target.value } })}
                          className="rounded border bg-background px-2 py-1" />
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
          <Button className="btn-primary mt-4" disabled={!chosen.length} onClick={() => setStep("preview")}>Preview batch ({chosen.length})</Button>
        </>
      )}

      {step === "preview" && (
        <div className="panel space-y-3">
          <h2 className="font-medium">Review before authorizing</h2>
          <ul className="space-y-1 text-sm">
            {chosen.map((it) => {
              const a = sampleAccounts.find((x) => x.id === it.accountId)!;
              return <li key={it.accountId}>• {a.site} — {it.mode === "generate" ? (prefs.style === "passphrase" ? `unique passphrase (${prefs.words} words)` : `unique generated (${prefs.length} chars)`) : "your own value"} {itemIssues(it, chosen).map((x) => <span key={x} className="tag-bad ml-1">{x}</span>)}</li>;
            })}
          </ul>
          <p className="text-xs text-muted-foreground">Authorizing starts a simulated run. Items are marked completed only after (simulated) verification.</p>
          <div className="flex gap-2">
            <Button className="btn-ghost" onClick={() => setStep("select")}>Back</Button>
            <Button className="btn-primary" onClick={() => run(mfa)}>Authorize simulated batch</Button>
          </div>
        </div>
      )}

      {step === "report" && (
        <div className="space-y-3">
          {waiting.length > 0 && (
            <div className="panel border-info/50">
              <p className="text-sm">Paused: {waiting.length} account(s) need MFA approval.</p>
              <Button className="btn-primary mt-2" onClick={() => { const n = new Set([...mfa, ...waiting]); setMfa(n); run(n); }}>
                I approved MFA (simulated) — resume
              </Button>
            </div>
          )}
          <ul className="space-y-2">
            {Object.entries(result).map(([id, o]) => {
              const a = sampleAccounts.find((x) => x.id === id)!;
              return (
                <li key={id} className="panel">
                  <div className="flex items-center gap-2"><span className="font-medium">{a.site}</span><span className={tagFor[o]}>{o}</span></div>
                  <p className="mt-1 text-xs text-muted-foreground">{recoveryGuidance(o)}</p>
                </li>
              );
            })}
          </ul>
          <Button className="btn-ghost" onClick={() => { setStep("select"); setItems({}); setMfa(new Set()); setResult({}); }}>New batch</Button>
        </div>
      )}
    </VaultShell>
  );
}
