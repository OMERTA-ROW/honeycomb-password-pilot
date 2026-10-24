import { createFileRoute } from "@tanstack/react-router";
import { VaultShell, PageHead, meta } from "@/components/VaultShell";
import { sampleHoneyEvents } from "@/lib/sample-data";

export const Route = createFileRoute("/evidence")({
  head: () => meta("Evidence export", "Tamper-evident incident timeline separating observation, suspicion, and corroboration."),
  component: Page,
});

function Page() {
  const download = () => {
    const body = { generated: new Date().toISOString(), notice: "SAMPLE — simulated preview data. Contains no passwords or recovery codes.", collectionHistory: ["Decoy alert service (simulated)"], events: sampleHoneyEvents };
    const url = URL.createObjectURL(new Blob([JSON.stringify(body, null, 2)], { type: "application/json" }));
    const a = document.createElement("a"); a.href = url; a.download = "honeycomb-sample-incident.json"; a.click(); URL.revokeObjectURL(url);
  };
  return (
    <VaultShell>
      <PageHead title="Incident evidence export" tag={<span className="tag-sim">Sample export</span>}
        sub="Planned: hash-chained events so edits are detectable, plus a record of how each item was collected." />
      <div className="panel mb-4 grid gap-3 text-sm md:grid-cols-3">
        <div><span className="tag-info">observation</span><p className="mt-1 text-muted-foreground">What a system recorded.</p></div>
        <div><span className="tag-sim">suspicion</span><p className="mt-1 text-muted-foreground">An inference worth checking.</p></div>
        <div><span className="tag-ok">corroboration</span><p className="mt-1 text-muted-foreground">Confirmed by an independent source.</p></div>
      </div>
      <button className="btn-primary" onClick={download}>Download sample incident file</button>
      <p className="mt-3 text-xs text-muted-foreground">An IP address alone doesn't identify a person. Exports carry no guarantee of any legal outcome. Tamper-evidence is not yet implemented.</p>
    </VaultShell>
  );
}
