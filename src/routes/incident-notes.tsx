import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { VaultShell, PageHead, meta } from "@/components/VaultShell";
import { screenNotes, MAX_NOTES_CHARS, type Timeline } from "@/lib/incident-notes";
import { getIncidentAiStatus, organizeIncidentNotes } from "@/lib/incident-ai.functions";

export const Route = createFileRoute("/incident-notes")({
  head: () => meta("Incident notes", "Organize your incident notes into a neutral timeline of observations, suspicions and corroboration."),
  loader: () => getIncidentAiStatus(),
  component: Page,
});

const kindTag = { observation: "tag-info", suspicion: "tag-sim", corroboration: "tag-ok" } as const;

function Page() {
  const { enabled } = Route.useLoaderData();
  const organize = useServerFn(organizeIncidentNotes);
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeline, setTimeline] = useState<Timeline | null>(null);
  const warning = notes.trim() ? screenNotes(notes) : null;

  const submit = async () => {
    setError(null); setTimeline(null); setBusy(true);
    try {
      const r = await organize({ data: { notes } });
      if (r.ok) setTimeline(r.timeline); else setError(r.error);
    } catch { setError("Couldn't reach the service."); }
    finally { setBusy(false); }
  };

  return (
    <VaultShell>
      <PageHead title="Incident notes" tag={enabled ? <span className="tag-ok">AI on</span> : <span className="tag-muted">Disabled in preview</span>}
        sub="Describe what happened in your own words. An AI model can sort it into a neutral timeline for your review." />
      {!enabled && (
        <div className="panel mb-4 border-warning/40 text-sm text-muted-foreground">
          AI organizing is turned off in this private preview and nothing is sent anywhere. It stays off until the owner authorizes the AI service.
        </div>
      )}
      <div className="panel space-y-3">
        <p className="text-xs text-warning">Never include passwords, recovery codes, keys or tokens. Honeycomb will never ask for them.</p>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={MAX_NOTES_CHARS} rows={8} aria-label="Incident notes"
          placeholder="e.g. Oct 23 around 3am I got a login alert from an address I don't recognize…" autoComplete="off" spellCheck
          className="w-full rounded-lg border bg-background p-3 text-sm" />
        {warning && <p className="text-xs text-destructive">{warning}</p>}
        <div className="flex items-center gap-3">
          <button className="btn-primary" disabled={!enabled || busy || !!warning || !notes.trim()} onClick={submit}>
            {busy ? "Organizing…" : "Organize into timeline"}
          </button>
          <span className="text-xs text-muted-foreground">{notes.length}/{MAX_NOTES_CHARS}</span>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
      {timeline && (
        <div className="panel mt-4 space-y-3">
          <h2 className="font-medium">Draft timeline <span className="tag-muted ml-1">AI-generated · review before relying on it</span></h2>
          <ul className="space-y-2 text-sm">{timeline.entries.map((e, i) => (
            <li key={i} className="border-t pt-2"><span className="font-mono text-xs text-muted-foreground">{e.when}</span> <span className={kindTag[e.kind]}>{e.kind}</span>
              <p>{e.summary}</p><p className="text-xs text-muted-foreground">Source: {e.source}</p></li>
          ))}</ul>
          {timeline.gaps.length > 0 && <div className="text-sm text-muted-foreground"><p className="text-foreground">Worth checking</p>{timeline.gaps.map((g) => <p key={g}>• {g}</p>)}</div>}
        </div>
      )}
    </VaultShell>
  );
}
