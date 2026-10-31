import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, UsersRound, Smartphone, Bell, Link2, Ban, FileDown, HeartHandshake, Settings2, Plus, LockKeyhole } from "lucide-react";
import { VaultShell, PageHead, meta } from "@/components/VaultShell";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { MechanicalHive } from "@/components/MechanicalHive";
import { ageSafeguards, createFamilyProfile, demoDisposition, demoLink, familyAliases, guardianAlerts, guardianNotification, sampleEvidence, type AgeBand, type FamilyProfile, type GuardianAlert } from "@/lib/family-guardian-demo";

export const Route = createFileRoute("/family-guardian")({ head: () => meta("Family Guardian", "Optional Honeycomb Family Guardian private family cybersecurity preview. Fictional samples only; real device, message and payment safeguards need reviewed integrations."), component: FamilyGuardian });

function FamilyGuardian() {
  const [enabled, setEnabled] = useState(false);
  const [profiles, setProfiles] = useState<FamilyProfile[]>([]);
  const [selected, setSelected] = useState("");
  const [alias, setAlias] = useState<string>(familyAliases[0]);
  const [age, setAge] = useState<AgeBand>("10–12");
  const [view, setView] = useState("family");
  const [notice, setNotice] = useState("Optional module off. No device or family data is connected.");
  const [reviewed, setReviewed] = useState<string[]>([]);
  const [blocked, setBlocked] = useState<string[]>([]);
  const [detail, setDetail] = useState<{ alert: GuardianAlert; kind: "warning" | "evidence" } | null>(null);
  const [notifications, setNotifications] = useState(true);
  const profile = profiles.find(p => p.id === selected);
  const active = enabled && profile?.device === "demo-linked" && profile.guardianConsent && profile.childInformed;
  function update(changes: Partial<FamilyProfile>) {
    if (!profile) return;
    setProfiles(list => list.map(p => p.id === profile.id ? { ...p, ...changes } : p));
    setReviewed([]); setBlocked([]);
  }
  function download(alert: GuardianAlert) {
    const url = URL.createObjectURL(new Blob([JSON.stringify(sampleEvidence(alert), null, 2)], { type: "application/json" }));
    const a = document.createElement("a"); a.href = url; a.download = "honeycomb-fictional-safety-summary.json"; a.click(); window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice("Fictional summary downloaded. No original messages, identities or real evidence collected; nothing sent.");
  }
  return <VaultShell>
    <PageHead title="Honeycomb Family Guardian" tag={<span className="tag-sim">Optional · private Demo</span>} sub="A safer digital hive, built around trust and shared decisions." />
    <div className="mb-6 flex items-start justify-between gap-4 border-y py-4">
      <div><h2 className="flex items-center gap-2 font-medium"><ShieldCheck className="h-5 w-5 text-primary" />Family Guardian preview</h2><p className="mt-2 text-sm text-muted-foreground">Fictional families only. No real child names, messages, device invitations or payments. Settings reset when you leave or refresh.</p></div>
      <Switch aria-label="Enable Family Guardian demo" checked={enabled} onCheckedChange={value => { setEnabled(value); if (!value) { setProfiles([]); setSelected(""); setReviewed([]); setBlocked([]); setDetail(null); } setNotice(value ? "Demo enabled. No protection or device access activated." : "Demo off. Fictional family settings cleared; no device permissions changed."); }} />
    </div>
    <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      <article className="panel"><UsersRound className="h-5 w-5 text-primary" /><h2 className="mt-3 font-medium">Family profiles</h2><p className="mt-1 text-2xl font-semibold">{profiles.length}</p><p className="mt-1 text-xs text-muted-foreground">Demo · fictional aliases</p></article>
      <article className="panel"><Smartphone className="h-5 w-5 text-primary" /><h2 className="mt-3 font-medium">Device protection</h2><p className="mt-2 text-warning">Not connected</p><p className="mt-2 text-xs text-muted-foreground">No real enrollment or threat blocking</p></article>
      <article className="panel"><LockKeyhole className="h-5 w-5 text-primary" /><h2 className="mt-3 font-medium">Private by design</h2><p className="mt-2 text-sm text-muted-foreground">No child data collected. Real isolated storage and reviewed encryption are not built.</p></article>
    </div>
    <Tabs value={view} onValueChange={setView}><TabsList className="h-auto flex-wrap" aria-label="Family Guardian views"><TabsTrigger value="family">Family</TabsTrigger><TabsTrigger value="alerts">Safety review</TabsTrigger><TabsTrigger value="settings">Settings & limits</TabsTrigger></TabsList></Tabs>
    <p role="status" className="my-4 text-sm text-warning">{notice}</p>
    {!enabled && <div className="border-y py-5"><MechanicalHive playing={false} /><p className="text-center text-sm text-muted-foreground">Off by default · transparent permissions · no covert monitoring</p></div>}
    {enabled && <>
      {profiles.length > 0 && <label className="mb-5 flex flex-wrap items-center gap-3 text-sm">Sample family profile<select aria-label="Sample family profile" className="rounded-md border bg-background p-2" value={selected} onChange={e => { setSelected(e.target.value); setReviewed([]); setBlocked([]); }} >{profiles.map(p => <option key={p.id} value={p.id}>{p.alias} · {p.age}</option>)}</select></label>}
      {view === "family" && <>
        <form className="mb-6 grid items-end gap-3 border-y py-5 sm:grid-cols-3" onSubmit={e => { e.preventDefault(); const id = crypto.randomUUID(); setProfiles(list => [...list, createFamilyProfile(id, alias, age)]); setSelected(id); setReviewed([]); setBlocked([]); setNotice("Fictional profile created on this page only. No real family account saved."); }}>
          <label className="space-y-2 text-sm"><span>Fictional alias</span><select aria-label="Fictional alias" className="block w-full rounded-md border bg-background p-2" value={alias} onChange={e => setAlias(e.target.value)}>{familyAliases.map(a => <option key={a}>{a}</option>)}</select></label>
          <label className="space-y-2 text-sm"><span>Sample age band</span><select aria-label="Sample age band" className="block w-full rounded-md border bg-background p-2" value={age} onChange={e => setAge(e.target.value as AgeBand)}><option>6–9</option><option>10–12</option><option>13–17</option></select></label>
          <Button type="submit"><Plus />Create Demo profile</Button>
        </form>
        {!profile ? <p className="py-4 text-sm text-muted-foreground">No family profiles. Only fictional aliases are available in this preview.</p> : <div className="grid gap-4 xl:grid-cols-2">
          <article className="panel space-y-4"><h2 className="flex items-center gap-2 font-medium"><HeartHandshake className="h-5 w-5 text-primary" />{profile.alias} · shared safeguards</h2><p className="text-sm text-muted-foreground">{ageSafeguards(profile.age)}. Suggested discussion defaults, not a validated age policy.</p>
            <label className="flex items-start gap-3 text-sm"><input type="checkbox" checked={profile.guardianConsent} onChange={e => update({ guardianConsent: e.target.checked, device: "unlinked" })} />Demo guardian permission acknowledged</label>
            <label className="flex items-start gap-3 text-sm"><input type="checkbox" checked={profile.childInformed} onChange={e => update({ childInformed: e.target.checked, device: "unlinked" })} />Demo child informed: what is checked, why, and how to stop</label>
            <p className="text-xs text-muted-foreground">These sample acknowledgments are not legal consent or verified guardianship. No location tracking, hidden monitoring or message history.</p>
          </article>
          <article className="panel space-y-4"><h2 className="flex items-center gap-2 font-medium"><Smartphone className="h-5 w-5 text-primary" />Device invitation</h2><p className="tag-sim">{profile.device === "demo-linked" ? "Demo linked · not connected" : profile.device}</p><div className="flex flex-wrap gap-2"><Button variant="outline" disabled={!profile.guardianConsent || !profile.childInformed || profile.device === "pending" || profile.device === "demo-linked"} onClick={() => { update({ device: "pending" }); setNotice("Sample invitation pending. No link generated, email sent or real device invited."); }}><Link2 />Simulate invitation</Button><Button variant="outline" disabled={profile.device !== "pending"} onClick={() => { update(demoLink(profile)); setNotice("Demo child acceptance simulated. No real device connected or permissions granted."); }}>Simulate child acceptance</Button><Button variant="outline" disabled={profile.device === "unlinked" || profile.device === "revoked"} onClick={() => { update({ device: "revoked" }); setNotice("Demo device link revoked. Sample safeguards stopped; no real device affected."); }}><Ban />Revoke Demo link</Button></div><p className="text-xs text-muted-foreground">Real linking needs verified guardian authority, secure expiring invitations, device-side permissions and revocation readback.</p></article>
        </div>}
      </>}
      {view === "alerts" && <>
        <div className="mb-5 border-y py-4 text-sm text-muted-foreground">Four fixed fictional scenarios · not an inbox or live scan. Contact-risk patterns need context and human review; they do not establish grooming, criminal intent or anyone’s identity.</div>
        <div className="grid gap-4 xl:grid-cols-2">{guardianAlerts.map(alert => {
          const disposition = profile ? demoDisposition(profile, alert, enabled) : "inactive";
          const key = `${selected}:${alert.id}`;
          return <article className="panel space-y-3" key={alert.id}><div className="flex flex-wrap gap-2"><span className="tag-muted">{alert.category}</span><span className="tag-sim">{blocked.includes(key) || disposition === "demo-block" ? "Demo blocked · no real action" : reviewed.includes(key) ? "Demo reviewed" : disposition === "inactive" ? "Inactive sample" : "Parent review"}</span></div><h2 className="font-medium">{alert.title}</h2><p className="text-sm text-muted-foreground">{alert.observation}</p><p className="text-xs text-muted-foreground">{alert.confidence === "high" ? "High-confidence fictional indicator" : "Uncertain sample signal"} · {alert.sampleSupported ? "Blocking simulated only" : "Blocking needs integration"}</p><div className="flex flex-wrap gap-2"><Button size="sm" variant="outline" disabled={!active || reviewed.includes(key)} onClick={() => { setReviewed(list => [...list, key]); setNotice("Demo reviewed. Nothing dismissed from a real inbox or reported."); }}>Mark Demo reviewed</Button><Button size="sm" variant="outline" disabled={!active || !alert.sampleSupported || blocked.includes(key) || disposition === "demo-block"} onClick={() => { setBlocked(list => [...list, key]); setNotice("Explicit Demo block recorded. No real message, contact or device blocked."); }}><Ban />Demo block</Button><Button size="sm" variant="ghost" onClick={() => setDetail({ alert, kind: "warning" })}>Child warning</Button><Button size="sm" variant="ghost" onClick={() => setDetail({ alert, kind: "evidence" })}>Evidence & reporting</Button></div></article>;
        })}</div>
      </>}
      {view === "settings" && <div className="space-y-6">
        <div className="border-y py-5"><h2 className="mb-3 flex items-center gap-2 font-medium"><Settings2 className="h-5 w-5 text-primary" />Safeguards</h2>{profile ? <fieldset className="space-y-3 text-sm"><legend className="mb-3">Sample blocking preference for {profile.alias}</legend><label className="flex gap-3"><input type="radio" name="blocking-mode" checked={profile.mode === "review"} onChange={() => update({ mode: "review" })} />Parent review before any Demo block</label><label className="flex gap-3"><input type="radio" name="blocking-mode" checked={profile.mode === "automatic"} onChange={() => update({ mode: "automatic" })} />Automatic Demo block: high-confidence supported sample threats only</label><p className="text-xs text-muted-foreground">Uncertain/contact-risk and unsupported purchase scenarios always require review. No real blocking exists.</p></fieldset> : <p className="text-sm text-muted-foreground">Create a fictional family profile to choose sample safeguards.</p>}</div>
        <div className="flex items-start justify-between gap-4 border-b pb-5"><div><h2 className="flex items-center gap-2 font-medium"><Bell className="h-5 w-5 text-primary" />Private notification preview</h2><p className="mt-2 text-sm text-muted-foreground">{notifications ? guardianNotification() : "Sample notifications paused."}</p><p className="mt-2 text-xs text-muted-foreground">No names, message bodies or sender details on notifications. Nothing delivered to a device.</p></div><Switch aria-label="Sample parental notifications" checked={notifications} onCheckedChange={setNotifications} /></div>
        <section className="space-y-3 text-sm"><h2 className="font-medium">Privacy & transparent permissions</h2><p className="text-muted-foreground">No sale or transfer of children’s personal messages or data to JAX or data brokers. No advertising profiles, model prompts, message uploads, analytics or child-data storage in this module. Sample settings stay in page memory only.</p><p className="text-muted-foreground">Real use remains blocked on verified guardian/child permissions, family-scoped access rules, independently reviewed encryption and key recovery, retention/deletion controls and child-safety review. A checkbox is not proof of authority.</p></section>
        <section className="space-y-3 text-sm"><h2 className="font-medium">Needs integration · no active protection</h2><p className="text-muted-foreground">iOS: Family Controls requires Apple entitlement approval and supported native permissions; it does not grant universal message inspection. SMS filtering is limited to supported unknown-sender SMS/MMS, not iMessage or third-party chats.</p><p className="text-muted-foreground">Android: supported native roles, permissions and store-policy review are required. No access to other apps’ private chats or universal device controls is assumed.</p><p className="text-muted-foreground">Email and browser threats need separately authorized provider or extension integrations. Purchase approvals remain with Apple, Google or the issuer; Vault cannot intercept or reverse payments.</p><p className="text-muted-foreground">No executor, monitoring, real evidence store or notifications connected. Every channel needs permission, freshness and action-readback checks before an active status is possible.</p></section>
      </div>}
    </>}
    <Dialog open={detail !== null} onOpenChange={open => { if (!open) setDetail(null); }}><DialogContent><DialogTitle>{detail?.kind === "warning" ? "A message for your young bee" : "Fictional evidence & reporting"}</DialogTitle><DialogDescription>{detail?.kind === "warning" ? detail.alert.warning : "Sample observation only. No real content collected or preserved, no verified identity or corroboration, and no report sent."}</DialogDescription>{detail?.kind === "evidence" && <><p className="text-sm text-muted-foreground">Review context with a trusted adult. Never forward sensitive images or private conversations automatically. Original evidence storage, encryption and tamper-evidence are not implemented. For immediate danger contact local emergency services; use official in-app reporting for platform concerns.</p><Button variant="outline" onClick={() => { if (detail) download(detail.alert); }}><FileDown />Download fictional summary</Button></>}<Button variant="outline" onClick={() => setDetail(null)}>Close</Button></DialogContent></Dialog>
  </VaultShell>;
}