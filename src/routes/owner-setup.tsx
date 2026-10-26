import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { bootstrapOwner, ownerSetupStatus } from "@/lib/testing.functions";
import { useAccount } from "@/hooks/use-account";
import { VaultShell, PageHead, meta } from "@/components/VaultShell";
import { Button } from "@/components/ui/button";
export const Route = createFileRoute("/owner-setup")({ head: () => meta("Verified owner setup", "Trusted owner bootstrap for private Honeycomb Vault testing; no first-visitor ownership."), component: OwnerSetup });
function OwnerSetup() {
  const { user, refresh } = useAccount(); const setup = useServerFn(bootstrapOwner); const statusFn = useServerFn(ownerSetupStatus); const navigate = useNavigate(); const [message,setMessage] = useState(""); const [busy,setBusy] = useState(false);
  const status = useQuery({ queryKey: ["owner-configuration"], queryFn: () => statusFn() });
  return <VaultShell accountMode><PageHead title="Verified owner setup" sub="Ownership is assigned only to a confirmed identity matching trusted owner configuration. Never to the first visitor." /><div className="max-w-lg space-y-4"><p role="status">{status.isPending ? "Checking owner configuration…" : status.data?.configured ? "Trusted owner email configured. Sign in with that verified identity." : "Owner assignment blocked: trusted owner email has not been configured."}</p><p className="text-sm text-muted-foreground">The project owner must configure their verified email privately in Project Settings → Secrets as VAULT_OWNER_EMAIL. An authorized administrator must provision that matching confirmed account through trusted account setup; public signup stays disabled. No password is requested in chat.</p><Button disabled={busy || !user || !status.data?.configured} onClick={async () => { setBusy(true); try { const r = await setup(); setMessage(r.message); if (r.ok) { await refresh(); await navigate({ to: "/dashboard", replace: true }); } } catch { setMessage("Verified owner identity required. No assignment made."); } finally { setBusy(false); } }}>Verify configured owner</Button><Button asChild variant="outline"><Link to="/auth" search={{ returnTo: "/owner-setup", recovery: false }}>Sign in</Link></Button>{message && <p role="status">{message}</p>}</div></VaultShell>;
}
