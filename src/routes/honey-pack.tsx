import { createFileRoute } from "@tanstack/react-router";
import { VaultShell, PageHead, meta } from "@/components/VaultShell";
import { sampleHoneyEvents } from "@/lib/sample-data";

export const Route = createFileRoute("/honey-pack")({
  head: () => meta("Digital Honey Pack", "Decoy credentials for a controlled service that alert you when used."),
  component: Page,
});

function Page() {
  return (
    <VaultShell>
      <PageHead title="Digital Honey Pack" tag={<span className="tag-sim">Mock interface</span>}
        sub="Decoy credentials that only work against a service we control. If someone tries them, you get an alert with what we observed." />
      <div className="panel mb-4">
        <h2 className="mb-2 font-medium">Observed events (sample)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-muted-foreground"><tr><th className="py-1 pr-4">Time</th><th className="pr-4">Decoy</th><th className="pr-4">Event</th><th className="pr-4">Observed address</th><th>Class</th></tr></thead>
            <tbody>{sampleHoneyEvents.map((e) => (
              <tr key={e.t} className="border-t"><td className="py-2 pr-4 font-mono text-xs">{e.t}</td><td className="pr-4">{e.decoy}</td><td className="pr-4">{e.event}</td><td className="pr-4 font-mono text-xs">{e.ip}</td><td><span className="tag-info">{e.kind}</span></td></tr>
            ))}</tbody>
          </table>
        </div>
      </div>
      <div className="panel text-sm text-muted-foreground space-y-1">
        <p className="text-foreground font-medium">Limits</p>
        <p>• No destructive payload, no hack-back. Decoys only record use against our controlled service.</p>
        <p>• False positives happen (security scanners, shared networks, your own tests).</p>
        <p>• A stolen offline copy used without contacting our service cannot be detected.</p>
        <p>• An IP address does not identify a person.</p>
        <p>• A decoy being used does not by itself prove theft, malicious intent, or who did it — investigate before concluding.</p>
        <p>• No unauthorized spreading and no damage to your data. Alert evidence is planned to be stored separately from any missing device.</p>
      </div>
    </VaultShell>
  );
}
