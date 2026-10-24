import { createFileRoute } from "@tanstack/react-router";
import { VaultShell, PageHead, meta } from "@/components/VaultShell";
import { recoveryActions } from "@/lib/sample-data";

export const Route = createFileRoute("/recovery")({
  head: () => meta("Recovery", "Recover from a lost device: revoke future access and follow OS lock guidance."),
  component: Page,
});

const cls = { confirmed: "tag-ok", pending: "tag-info", offline: "tag-muted", failed: "tag-bad" } as const;

function Page() {
  return (
    <VaultShell>
      <PageHead title="Lost-device recovery" tag={<span className="tag-sim">Mock interface</span>}
        sub="Use this from another device. Sign-in will not depend solely on the lost device (planned: recovery key + second factor)." />
      <div className="panel mb-4">
        <h2 className="mb-2 font-medium">Actions</h2>
        <ul className="space-y-2 text-sm">{recoveryActions.map((a) => (
          <li key={a.action} className="flex items-center justify-between gap-2 border-t pt-2"><span>{a.action}</span><span className={cls[a.status]}>{a.status}</span></li>
        ))}</ul>
      </div>
      <div className="panel text-sm text-muted-foreground space-y-1">
        <p className="text-foreground font-medium">What this can and can't do</p>
        <p>• Revokes <em>future</em> vault access for the lost device. Secrets already seen cannot be recalled — change them.</p>
        <p>• Covers phones, iPads and computers only through capabilities each platform supports. Normal app permissions do not give whole-device remote control.</p>
        <p>• Vault data already on the lost device is meant to stay protected by local encryption and auto-lock (not built yet).</p>
        <p>• No automatic data destruction on suspicious activity.</p>
        <p>• Locking the device itself uses your OS provider (e.g. Apple Find My, Google Find My Device). We guide you there; we do not control the whole device.</p>
      </div>
    </VaultShell>
  );
}
