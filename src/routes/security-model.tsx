import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { VaultShell, PageHead, meta } from "@/components/VaultShell";
import { sha1Hex, splitHash } from "@/lib/breach";

export const Route = createFileRoute("/security-model")({
  head: () => meta("Security model", "Planned on-device encryption, encrypted-only sync, and a k-anonymity breach check (demo)."),
  component: Page,
});

const steps = [
  ["Master password", "Never leaves your device. Turned into a key with Argon2id (vetted library), PBKDF2 only as fallback."],
  ["Face ID / device key", "Device-backed key (Secure Enclave / platform keystore) unlocks a wrapped vault key. Needs native app — not built."],
  ["Vault key", "Random key encrypts each item with AES-GCM on your device."],
  ["Sync", "Server stores only encrypted data. It holds no key and can never read your vault."],
  ["Recovery", "Recovery key and/or second device — owner decision pending. Independent security review required."],
];

function Page() {
  const [demo, setDemo] = useState("");
  const [out, setOut] = useState<{ prefix: string; suffix: string } | null>(null);
  return (
    <VaultShell>
      <PageHead title="Security model" tag={<span className="tag-sim">Demo · design only</span>}
        sub="How the vault is planned to protect data. Nothing here encrypts real data yet; signing in alone would never protect vault contents." />
      <div className="card-grid mb-6">
        {steps.map(([t, d], i) => (
          <div key={t} className="panel text-sm">
            <p className="font-mono text-xs text-primary">Step {i + 1}</p>
            <p className="mt-1 font-medium">{t}</p>
            <p className="mt-1 text-muted-foreground">{d}</p>
          </div>
        ))}
      </div>
      <div className="panel space-y-3 text-sm">
        <h2 className="font-medium">Breach check — what would leave the device <span className="tag-sim ml-1">Demo</span></h2>
        <p className="text-muted-foreground">Type a made-up sample value (never a real password). Vault hashes it here; only the first 5 characters would be sent and matches checked locally. This demo sends nothing.</p>
        <div className="flex flex-wrap gap-2">
          <input value={demo} onChange={(e) => setDemo(e.target.value)} placeholder="sample value, e.g. hunter2"
            className="min-w-0 flex-1 rounded-md border bg-input/10 px-3 py-2" autoComplete="off" aria-label="Sample value" />
          <Button className="btn-primary" disabled={!demo} onClick={async () => setOut(splitHash(await sha1Hex(demo)))}>Show what is sent</Button>
        </div>
        {out && (
          <div className="card-grid">
            <p className="mini-card">Sent: <span className="font-mono text-primary">{out.prefix}</span></p>
            <p className="mini-card break-all">Kept on device: <span className="font-mono">{out.suffix}</span></p>
          </div>
        )}
      </div>
    </VaultShell>
  );
}
