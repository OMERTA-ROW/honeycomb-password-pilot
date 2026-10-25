import { createClient } from "@supabase/supabase-js";
import { describe, expect, it } from "vitest";

// Explicitly enabled against disposable application test users; never logs credentials.
const enabled = process.env['RUN_ACCOUNT_INTEGRATION'] === "1";
describe.skipIf(!enabled)("Real account isolation and revocation", () => {
  it("denies anon/cross-user access, revoked/expired sessions and logs server-owned activity", async () => {
    const url = process.env['SUPABASE_URL'];
    const secret = process.env['SUPABASE_SERVICE_ROLE_KEY'];
    const key = process.env['SUPABASE_PUBLISHABLE_KEY'];
    if (!url || !secret || !key) throw new Error("Integration configuration missing");
    const admin = createClient(url, secret, { auth: { storageKey: "test-admin", persistSession: false, autoRefreshToken: false } });
    const anon = createClient(url, key, { auth: { storageKey: "test-anon", persistSession: false, autoRefreshToken: false } });
    const ids: string[] = [];
    const clients = [0, 1].map(i => createClient(url, key, { auth: { storageKey: `test-owner-${i}`, persistSession: false, autoRefreshToken: false } })) as [ReturnType<typeof createClient>, ReturnType<typeof createClient>];
    const sessions: string[] = [];
    try {
      for (let i = 0; i < 2; i++) {
        const client = clients[i];
        if (!client) throw new Error("Test client missing");
        const email = `vault-isolation-${crypto.randomUUID()}@example.com`;
        const password = `Test-${crypto.randomUUID()}-9!`;
        const created = await admin.auth.admin.createUser({ email, password, email_confirm: true });
        if (created.error || !created.data.user) throw new Error("Test user creation failed");
        ids.push(created.data.user.id);
        const signed = await client.auth.signInWithPassword({ email, password });
        expect(signed.error).toBeNull();
        const registered = await client.rpc("register_account_session");
        expect(registered.error).toBeNull();
        sessions.push(registered.data);
      }
      const anonymous = await anon.from("profiles").select("id");
      expect(anonymous.data?.length ?? 0).toBe(0);
      expect((await anon.rpc("register_account_session")).error).not.toBeNull();
      const own = await clients[0].from("profiles").select("id");
      expect(own.data?.map(row => row.id)).toEqual([ids[0]]);
      expect((await clients[0].from("profiles").select("id").eq("id", ids[1])).data).toEqual([]);
      expect((await clients[0].from("profiles").update({ display_name: "Intrusion" }).eq("id", ids[1]).select()).data).toEqual([]);
      await clients[0].rpc("revoke_account_session", { target_id: sessions[1] });
      expect((await clients[1].from("profiles").select("id")).data?.length).toBe(1);
      const updated = await clients[0].from("profiles").update({ display_name: "Isolation test" }).eq("id", ids[0]);
      expect(updated.error).toBeNull();
      const history = await clients[0].from("account_activity").select("user_id,event,occurred_at");
      expect(history.data?.every(row => row.user_id === ids[0] && Boolean(row.occurred_at))).toBe(true);
      expect(history.data?.some(row => row.event === "profile_updated")).toBe(true);
      expect((await clients[0].from("account_activity").insert({ user_id: ids[0], event: "session_registered" })).error).not.toBeNull();
      await clients[0].rpc("revoke_account_session", { target_id: sessions[0] });
      expect((await clients[0].from("profiles").select("id")).data).toEqual([]);
      expect((await clients[0].rpc("register_account_session")).error).not.toBeNull();
      expect((await clients[0].from("profiles").update({ display_name: "Revoked" }).eq("id", ids[0]).select()).data).toEqual([]);
      const expiration = await admin.from("account_sessions").update({ expires_at: new Date(Date.now() - 1000).toISOString() }).eq("id", sessions[1]);
      expect(expiration.error).toBeNull();
      expect((await clients[1].from("profiles").select("id")).data).toEqual([]);
      expect((await clients[1].rpc("register_account_session")).error).not.toBeNull();
      await clients[0].auth.signOut({ scope: "local" });
      expect((await clients[0].from("profiles").select("id")).data?.length ?? 0).toBe(0);
    } finally {
      for (const id of ids) {
        await admin.from("account_activity").delete().eq("user_id", id);
        await admin.from("account_sessions").delete().eq("user_id", id);
        await admin.auth.admin.deleteUser(id);
      }
    }
  }, 60_000);
});