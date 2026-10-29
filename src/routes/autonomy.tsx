import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { VaultShell, PageHead, meta } from "@/components/VaultShell";
import { Button } from "@/components/ui/button";
import { useAccount } from "@/hooks/use-account";
import { supabase } from "@/integrations/supabase/client";
import { allowedCapabilities, autonomyCapabilities, executorReadiness, type AutonomyCapability } from "@/lib/autonomy-policy";

export const Route = createFileRoute("/autonomy")({ head: () => meta("Autonomous tasks", "Owner-authorized autonomous task settings with allowlisted capabilities, pause/stop/revoke and redacted audit."), component: Autonomy });

function Autonomy() {
  const { user, sessionId, ready, membership } = useAccount();
  const [title, setTitle] = useState(""); const [caps, setCaps] = useState<AutonomyCapability[]>([]); const [msg, setMsg] = useState("");
  const q = useQuery({ queryKey: ["autonomy", user?.id, sessionId], enabled: Boolean(sessionId), queryFn: async () => {
    const [auth, tasks, events, roles, grants] = await Promise.all([
      supabase.rpc("autonomy_authorized"),
      supabase.from("autonomy_tasks").select("id,title,capabilities,status,updated_at").order("created_at", { ascending: false }),
      supabase.from("autonomy_events").select("id,event,detail,occurred_at").order("occurred_at", { ascending: false }).limit(30),
      supabase.from("user_roles").select("user_id,role,active"),
      supabase.from("autonomy_grants").select("user_id,revoked_at"),
    ]);
    return { authorized: auth.data === true, tasks: tasks.data ?? [], events: events.data ?? [], roles: roles.data ?? [], grants: grants.data ?? [] };
  } });
  const owner = membership?.role === "owner";
  const act = async (p: PromiseLike<{ error: unknown }>) => { const r = await p; setMsg(r.error ? "Rejected by server permissions." : "Saved. Server enforced."); await q.refetch(); };
  return <VaultShell accountMode>
    <PageHead title="Autonomous tasks" sub="Settings for future Omni autonomy. Tasks can only be paused, stopped or revoked — nothing runs yet." tag={<span className="tag-bad">{executorReadiness.label}</span>} />
    {!ready ? <p>Checking access…</p> : !sessionId ? <Button asChild><Link to="/auth" search={{ returnTo: "/dashboard", recovery: false }}>Sign in</Link></Button> : q.isPending ? <p>Loading…</p> : <>
      <p className="mb-4 text-sm text-muted-foreground">Vault secrets are never shared with tasks, pages, logs or AI prompts. Password changes always need your explicit approval and MFA and cannot be automated.</p>
      {!q.data?.authorized ? <p role="status">Your account is not authorized for autonomous tasks. The owner must grant access.</p> :
        <form className="panel mb-6 max-w-xl space-y-3" onSubmit={e => { e.preventDefault(); void act(supabase.rpc("create_autonomy_task", { task_title: title, task_capabilities: allowedCapabilities(caps) })); setTitle(""); setCaps([]); }}>
          <input required maxLength={120} value={title} onChange={e => setTitle(e.target.value)} placeholder="Task name (no passwords or codes)" aria-label="Task name" className="w-full rounded border bg-background px-2 py-1" />
          {(Object.keys(autonomyCapabilities) as AutonomyCapability[]).map(c => <label key={c} className="flex gap-2 text-sm"><input type="checkbox" checked={caps.includes(c)} onChange={() => setCaps(s => s.includes(c) ? s.filter(x => x !== c) : [...s, c])} />{autonomyCapabilities[c]}</label>)}
          <Button disabled={!caps.length || !title.trim()}>Save task (paused)</Button>
        </form>}
      <h2 className="mb-2 font-medium">Your tasks</h2>
      {!q.data?.tasks.length ? <p className="text-muted-foreground">No tasks yet.</p> : q.data.tasks.map(t => <div key={t.id} className="panel mb-2 flex flex-wrap items-center gap-2 text-sm"><span className="font-medium">{t.title}</span><span className="tag-muted">{t.status} · not executed</span><span className="text-xs text-muted-foreground">{t.capabilities.join(", ")}</span>
        {t.status === "paused" && <Button size="sm" variant="outline" onClick={() => act(supabase.rpc("set_autonomy_task_status", { target_task: t.id, new_status: "stopped" }))}>Stop</Button>}
        {t.status !== "revoked" && <Button size="sm" variant="outline" onClick={() => act(supabase.rpc("set_autonomy_task_status", { target_task: t.id, new_status: "revoked" }))}>Revoke</Button>}</div>)}
      {owner && <section className="mt-6"><h2 className="mb-2 font-medium">Authorize invited accounts</h2>{q.data?.roles.filter(r => r.role !== "owner" && r.active).map(r => { const on = q.data.grants.some(g => g.user_id === r.user_id && !g.revoked_at); return <div key={r.user_id} className="mb-2 flex flex-wrap items-center gap-2 text-xs"><span className="break-all">{r.user_id}</span><Button size="sm" variant="outline" onClick={() => act(supabase.rpc("set_autonomy_grant", { target_user: r.user_id, allowed: !on }))}>{on ? "Revoke autonomy" : "Allow autonomy"}</Button></div>; })}</section>}
      <h2 className="mb-2 mt-6 font-medium">Audit log (redacted)</h2>
      {q.data?.events.map(e => <p key={e.id} className="border-b py-2 text-xs">{new Date(e.occurred_at).toLocaleString()} · {e.event} {e.detail}</p>)}
    </>}
    {msg && <p role="status" className="mt-4">{msg}</p>}
  </VaultShell>;
}
