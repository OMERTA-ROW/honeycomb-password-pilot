import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { VaultShell, PageHead, meta } from "@/components/VaultShell";
import { clampWaitDays } from "@/lib/breach";

export const Route = createFileRoute("/emergency-access")({
  head: () => meta("Emergency access", "Trusted contact access after an owner-set waiting period (demo)."),
  component: Page,
});

function Page() {
  const [days, setDays] = useState(7);
  const [state, setState] = useState<"idle" | "waiting" | "denied">("idle");
  return (
    <VaultShell>
      <PageHead title="Trusted contact / emergency access" tag={<span className="tag-sim">Demo</span>}
        sub="A trusted contact can request access. It opens only after your waiting period, and you can deny it any time before then." />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="panel space-y-3 text-sm">
          <p className="font-medium">Sample contact: alex@example.com</p>
          <label className="flex items-center gap-2">Waiting period (days)
            <input type="number" min={1} max={30} value={days} onChange={(e) => setDays(clampWaitDays(Number(e.target.value)))}
              className="w-20 rounded-md border bg-input/10 px-2 py-1" />
          </label>
          <div className="flex flex-wrap gap-2">
            <Button className="btn-ghost" onClick={() => setState("waiting")}>Simulate contact request</Button>
            <Button className="btn-primary" disabled={state !== "waiting"} onClick={() => setState("denied")}>Deny request</Button>
          </div>
          {state === "waiting" && <p className="tag-info">Demo: access would open in {days} day(s) unless you deny</p>}
          {state === "denied" && <p className="tag-ok">Demo: request denied</p>}
        </div>
        <div className="panel text-sm text-muted-foreground">
          <h2 className="mb-3 font-medium text-foreground">Limits</h2>
          <div className="card-grid sm:grid-cols-1 xl:grid-cols-1">
            <p className="mini-card">Not built: needs real accounts and key sharing designed for the encrypted vault, plus security review.</p>
            <p className="mini-card">The contact would get an encrypted copy unlocked only after the wait; the server still cannot read it.</p>
          </div>
        </div>
      </div>
    </VaultShell>
  );
}
