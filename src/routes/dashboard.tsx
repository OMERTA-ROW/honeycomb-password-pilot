import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAccount } from "@/hooks/use-account";
import { VaultShell, PageHead, meta } from "@/components/VaultShell";
import { Button } from "@/components/ui/button";
export const Route = createFileRoute("/dashboard")({ head: () => meta("Private dashboard", "Your real isolated Honeycomb Vault test records and private account settings."), component: Dashboard });
function Dashboard() {
 const { user,ready,sessionId,error,membership } = useAccount();
 const records = useQuery({ queryKey: ["dashboard-records", user?.id,sessionId], enabled: Boolean(sessionId), queryFn: async () => { const r = await supabase.from("test_records").select("id,label,created_at").order("created_at",{ascending:false}); if(r.error) throw new Error("Access unavailable"); return r.data; } });
 return <VaultShell accountMode><PageHead title="Private dashboard" sub="Real non-secret account records only. Encrypted password storage and key management are not validated; real vault secret entry remains blocked." />{!ready ? <p>Checking access…</p> : !sessionId ? <div className="space-y-3"><p>{error || "Private sign-in required."}</p><Button asChild><Link to="/auth" search={{ returnTo:"/dashboard", recovery:false }}>Sign in</Link></Button><Button asChild variant="outline"><Link to="/join">Accept invitation</Link></Button></div> : <><div className="flex flex-wrap gap-3"><Button asChild><Link to="/account">Account & settings</Link></Button><Button asChild variant="outline"><Link to="/testing">{membership?.role === "owner" ? "Members & Invitations" : "Private test records"}</Link></Button></div><h2 className="mt-6 mb-3 font-medium">Your test records</h2>{records.isPending ? <p>Loading…</p> : records.isError ? <p role="alert">Private records unavailable.</p> : !records.data?.length ? <p className="text-muted-foreground">No test records yet. Your account contains no sample passwords or device records.</p> : records.data.map(r => <p key={r.id} className="border-b py-3 text-sm">{r.label} · {new Date(r.created_at).toLocaleString()}</p>)}</>}</VaultShell>;
}
