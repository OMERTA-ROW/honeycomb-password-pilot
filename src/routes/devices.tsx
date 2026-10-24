import { createFileRoute } from "@tanstack/react-router";
import { VaultShell, PageHead, meta } from "@/components/VaultShell";
import { sampleDevices } from "@/lib/sample-data";

export const Route = createFileRoute("/devices")({
  head: () => meta("Devices", "Enrolled devices, authenticated check-ins, and location feasibility."),
  component: Page,
});

function Page() {
  return (
    <VaultShell>
      <PageHead title="Enrolled devices" tag={<span className="tag-sim">Sample data</span>}
        sub="Each device would hold its own cryptographic identity and send authenticated check-ins." />
      <div className="grid gap-4 md:grid-cols-2">
        {sampleDevices.map((d) => (
          <div key={d.id} className="panel text-sm space-y-1">
            <div className="flex items-center gap-2"><span className="font-medium">{d.name}</span>{d.stale ? <span className="tag-bad">stale</span> : <span className="tag-ok">current</span>}</div>
            <p className="text-muted-foreground">{d.os} · key <span className="font-mono">{d.keyFp}</span></p>
            <p>Last seen: <span className="font-mono text-xs">{d.lastSeen}</span></p>
            <p>Public IP: <span className="font-mono text-xs">{d.ip}</span></p>
            <p>Permitted location: {d.location}</p>
            <button className="btn-ghost mt-2" disabled title="Not implemented — needs native app">Find Nearby (not implemented)</button>
          </div>
        ))}
      </div>
      <div className="panel mt-4 text-sm text-muted-foreground space-y-1">
        <p className="text-foreground font-medium">Locate / Find Nearby feasibility</p>
        <p>• Depends on OS permissions, UWB/Bluetooth hardware. 5–10 ft precision is a test goal, not a promise.</p>
        <p>• No guaranteed tracking when offline or powered off, after factory reset, or on devices where the app wasn't installed beforehand.</p>
        <p>• Check-ins only happen when the installed app can run and reconnect; background reporting is never guaranteed. Last known location is kept and marked stale.</p>
        <p>• Offline location would need a supported relay network. An old IP cannot locate a disconnected device.</p>
        <p>• No access to Apple Find My data. VPNs/proxies can mask the address; an early direct check-in may capture an earlier one, but there is no guaranteed unmasked window.</p>
        <p>• The device must be enrolled before it is lost.</p>
      </div>
    </VaultShell>
  );
}
