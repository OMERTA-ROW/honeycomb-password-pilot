import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shield, Mail, MessageSquare, Ban, Undo2, UserCheck, BellOff, Play, RotateCcw } from "lucide-react";
import { VaultShell, PageHead, meta } from "@/components/VaultShell";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { MechanicalHive } from "@/components/MechanicalHive";
import { disposition, demoNotification, initialSpamDemo, protectedMessage, sampleMessages, senderKey, setSenderRule, unsubscribeDemo, type Channel, type SampleMessage } from "@/lib/spam-demo";

export const Route = createFileRoute("/spam-shield")({
  head: () => meta("Spam Shield", "Review fictional SMS and email quarantine, trusted senders and Quiet Mode. Demo only; no SMS or inbox integration is connected."),
  component: SpamShield,
});

function SpamShield() {
  const [state, setState] = useState(initialSpamDemo);
  const [view, setView] = useState("quarantine");
  const [channel, setChannel] = useState("all");
  const [notice, setNotice] = useState("Demo ready. No real messages are accessed, filtered or sent.");
  const [unsubscribe, setUnsubscribe] = useState<SampleMessage | null>(null);
  const [motion, setMotion] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => { setReduced(query.matches); if (query.matches) setPlaying(false); };
    update(); query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  useEffect(() => { if (!playing) return; const timer = window.setTimeout(() => setPlaying(false), 3200); return () => window.clearTimeout(timer); }, [playing]);
  const counts = sampleMessages.filter(m => disposition(m, state).quarantine);
  const visible = sampleMessages.filter(m => (channel === "all" || m.channel === channel) && (view === "senders" ? state.allowed.includes(senderKey(m)) || state.blocked.includes(senderKey(m)) : disposition(m, state).quarantine === (view === "quarantine")));
  const senderItems = visible.filter((m, i, list) => list.findIndex(n => senderKey(n) === senderKey(m)) === i);
  function rule(m: SampleMessage, action: "block" | "allow" | "clear") {
    setState(s => setSenderRule(s, m, action));
    setNotice(`Demo: ${action === "block" ? "sender blocked; verification and important messages remain protected" : action === "allow" ? "sender trusted and unblocked" : "sender rule removed; sample classification resumes"}.`);
  }
  return <VaultShell>
    <PageHead title="Spam Shield" tag={<span className="tag-sim">Demo · not connected</span>} sub="Review unwanted promotions without losing important messages." />
    <div className="mb-5 border-y py-4 text-sm text-muted-foreground">Fictional samples only. This browser preview cannot read or filter device SMS or your real inbox. Changes last only on this page; no cross-device sync.</div>
    <div className="mb-6 grid gap-4 xl:grid-cols-2">
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">{(["sms", "email"] as Channel[]).map(c => <article key={c} className="panel text-sm">
          <div className="flex items-center justify-between gap-3">{c === "sms" ? <MessageSquare className="text-primary" /> : <Mail className="text-primary" />}<Switch aria-label={`${c === "sms" ? "SMS" : "Email"} demo filtering`} checked={state.channels[c]} onCheckedChange={checked => { setState(s => ({ ...s, channels: { ...s.channels, [c]: checked } })); setNotice(`Demo: ${c.toUpperCase()} filtering ${checked ? "on" : "off"}. No integration connected.`); }} /></div>
          <h2 className="mt-3 font-medium">{c === "sms" ? "SMS" : "Email"}</h2><p className="mt-1 text-muted-foreground">Not connected · {counts.filter(m => m.channel === c).length} sample quarantined</p>
        </article>)}</div>
        <div className="flex items-center justify-between gap-4 border-y py-4"><div><h2 className="flex items-center gap-2 font-medium"><BellOff className="h-4 w-4 text-primary" />Quiet Mode</h2><p className="mt-1 text-xs text-muted-foreground">Demo routine notices muted; important notices remain. No system notifications or settings changed.</p></div><Switch aria-label="Quiet Mode" checked={state.quiet} onCheckedChange={quiet => { setState(s => ({ ...s, quiet })); setNotice(`Demo: Quiet Mode ${quiet ? "on" : "off"}. No permissions or system visibility changed.`); }} /></div>
      </div>
      <div className="min-w-0 border-y py-3">
        <div className="flex items-center justify-between gap-3"><h2 className="font-medium text-primary">Mechanical hive</h2><span className="tag-muted">Demo status</span></div>
        <MechanicalHive playing={playing && motion && !reduced} />
        <div className="flex flex-wrap items-center justify-between gap-3"><label className="flex items-center gap-2 text-xs"><Switch aria-label="Enable hive animation" checked={motion} disabled={reduced} onCheckedChange={value => { setMotion(value); setPlaying(value && !reduced); }} />Optional animation</label><Button size="sm" variant="outline" disabled={!motion || reduced || playing} onClick={() => setPlaying(true)}><Play />Replay</Button></div>
        <p className="mt-2 text-xs text-muted-foreground">{reduced ? "Reduced motion · static hive" : "Optional 3-second preview · off by default"} · No protection activated.</p>
      </div>
    </div>
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <Tabs value={view} onValueChange={setView}><TabsList aria-label="Message views"><TabsTrigger value="quarantine">Quarantine ({counts.length})</TabsTrigger><TabsTrigger value="inbox">Inbox</TabsTrigger><TabsTrigger value="senders">Senders</TabsTrigger></TabsList></Tabs>
      <label className="flex items-center gap-2 text-xs">Channel<select aria-label="Message channel" className="rounded-md border bg-background px-3 py-2" value={channel} onChange={e => setChannel(e.target.value)}><option value="all">All</option><option value="sms">SMS</option><option value="email">Email</option></select></label>
    </div>
    <p role="status" className="mb-4 text-sm text-warning">{notice}</p>
    <div className="grid gap-3 xl:grid-cols-2" aria-label={view === "senders" ? "Sender rules" : "Sample messages"}>
      {(view === "senders" ? senderItems : visible).map(m => {
        const key = senderKey(m), blocked = state.blocked.includes(key), allowed = state.allowed.includes(key), quarantine = disposition(m, state).quarantine;
        return <article key={m.id} className="panel text-sm" aria-label={`${m.channel.toUpperCase()}: ${m.subject}`}>
          <div className="flex flex-wrap items-center gap-2"><span className="tag-muted">{m.channel}</span><h3 className="min-w-0 flex-1 font-medium">{m.sender}</h3><time className="text-xs text-muted-foreground">{m.time}</time></div>
          {view !== "senders" && <><p className="mt-3 font-medium">{m.subject}</p><p className="mt-2 text-muted-foreground">{m.body}</p><p className={`mt-3 text-xs ${protectedMessage(m) ? "text-success" : "text-warning"}`}>{disposition(m, state).reason}</p><p className="mt-1 text-xs text-muted-foreground">Demo notification: {demoNotification(state, m) === "none" ? "quiet" : demoNotification(state, m) === "important" ? "important retained" : "routine summary only"}</p></>}
          {view === "senders" && <p className="mt-3 text-primary">{allowed ? "Trusted allowlist" : "Blocked · important messages protected"}</p>}
          <div className="mt-4 flex flex-wrap gap-2">
            {quarantine && view !== "senders" && <Button size="sm" variant="outline" onClick={() => { setState(s => ({ ...s, restored: [...new Set([...s.restored, m.id])] })); setNotice("Demo: sample restored to Inbox. Sender was not automatically trusted."); }}><Undo2 />Restore</Button>}
            <Button size="sm" variant="outline" onClick={() => rule(m, blocked ? "clear" : "block")}><Ban />{blocked ? "Unblock" : "Block sender"}</Button>
            <Button size="sm" variant="outline" onClick={() => rule(m, allowed ? "clear" : "allow")}><UserCheck />{allowed ? "Remove trust" : "Allowlist"}</Button>
            {view !== "senders" && m.category === "marketing" && <Button size="sm" variant="outline" disabled={!m.trustedUnsubscribe || state.unsubscribed.includes(key)} onClick={() => setUnsubscribe(m)}>{state.unsubscribed.includes(key) ? "Demo unsubscribed" : "Review unsubscribe"}</Button>}
          </div>
          {m.category === "suspicious" && <p className="mt-3 text-xs text-muted-foreground">Unsubscribe unavailable: untrusted sender. No suspicious links followed.</p>}
        </article>;
      })}
    </div>
    {!visible.length && <p className="border-y py-8 text-center text-sm text-muted-foreground">{view === "senders" ? "No sender rules for this channel." : "No sample messages in this view."}</p>}
    <div className="mt-5 flex justify-end"><Button variant="ghost" size="sm" onClick={() => { setState(initialSpamDemo); setNotice("Demo reset. Sample messages restored; no real messages changed."); }}><RotateCcw />Reset sample rules</Button></div>
    <section className="mt-6 border-t pt-5 text-sm"><h2 className="mb-3 flex items-center gap-2 font-medium"><Shield className="h-4 w-4 text-primary" />Integration & device scope</h2><div className="grid gap-3 sm:grid-cols-2"><p className="text-muted-foreground">Android: native SMS role and user-granted permissions required. Boot and background work are OS-restricted, not guaranteed always-on.</p><p className="text-muted-foreground">iOS: enabled native filtering extension for unknown-sender SMS/MMS only; not iMessage. iPadOS availability needs device testing. Animation on app open, never a boot overlay.</p><p className="text-muted-foreground">Email: separate authorized provider integration or supported macOS Mail extension. No mailbox is connected. Web preview has no inbox access.</p><p className="text-muted-foreground">Desktop companion: future opt-in startup after user login. Quiet Mode stays visible in app/system settings; no stealth or permission bypass. Active status requires verified integration health.</p></div></section>
    <Dialog open={unsubscribe !== null} onOpenChange={open => { if (!open) setUnsubscribe(null); }}><DialogContent><DialogTitle>Review sample unsubscribe</DialogTitle><DialogDescription>Sender: {unsubscribe?.sender}. Trusted fictional unsubscribe metadata only. Confirming records a Demo preference; no link opens, message sends or subscription changes. Real unsubscribe needs authenticated provider metadata and your explicit approval.</DialogDescription><div className="flex flex-wrap justify-end gap-2"><Button variant="outline" onClick={() => setUnsubscribe(null)}>Cancel</Button><Button onClick={() => { if (!unsubscribe) return; setState(s => unsubscribeDemo(s, unsubscribe, true)); setNotice("Demo: unsubscribe confirmed for sample sender only. Nothing was sent or opened."); setUnsubscribe(null); }}>Confirm Demo unsubscribe</Button></div></DialogContent></Dialog>
  </VaultShell>;
}