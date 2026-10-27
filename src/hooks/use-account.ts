import { createContext, createElement, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
type Membership = { role: string; active: boolean; can_invite: boolean };
type Account = { user: User | null; ready: boolean; error: string; sessionId: string | null; membership: Membership | null; refresh: () => Promise<void> };
const AccountContext = createContext<Account>({ user: null, ready: false, error: "", sessionId: null, membership: null, refresh: async () => {} });
export function AccountProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [state, setState] = useState<Omit<Account, "refresh">>({ user: null, ready: false, error: "", sessionId: null, membership: null });
  const [refresh, setRefresh] = useState<() => Promise<void>>(() => async () => {});
  useEffect(() => {
    let active = true; let generation = 0;
    const reload = async () => {
      const current = ++generation;
      let identity;
      try { identity = await supabase.auth.getUser(); }
      catch { if (active && generation === current) setState({ user: null, ready: true, error: "Account verification unavailable. Try again.", sessionId: null, membership: null }); return; }
      if (!active || generation !== current) return;
      if (!identity.data.user || identity.error) { await queryClient.cancelQueries(); queryClient.clear(); setState({ user: null, ready: true, error: "", sessionId: null, membership: null }); return; }
      const role = await supabase.from("user_roles").select("role,active,can_invite").eq("user_id", identity.data.user.id).maybeSingle();
      const registration = role.data?.active ? await supabase.rpc("register_account_session") : null;
      if (!active || generation !== current) return;
      const sessionId = registration?.error ? null : registration?.data ?? null;
      if (!sessionId) { await queryClient.cancelQueries(); queryClient.clear(); }
      setState({ user: identity.data.user, ready: true, sessionId, membership: role.data ?? null, error: !role.data?.active ? "Private membership required. Accept an invitation or verify configured owner." : !sessionId ? "Your account session expired or was revoked. Sign out and sign in again." : "" });
    };
    setRefresh(() => reload);
    const listener = supabase.auth.onAuthStateChange(event => {
      if (!["INITIAL_SESSION", "SIGNED_IN", "SIGNED_OUT", "USER_UPDATED", "PASSWORD_RECOVERY"].includes(event)) return;
      if (event === "SIGNED_OUT") { generation++; void queryClient.cancelQueries(); queryClient.clear(); setState({ user: null, ready: true, sessionId: null, membership: null, error: "" }); }
      else window.setTimeout(() => { void reload(); }, 0);
    });
    void reload(); const timer = window.setInterval(() => { void reload(); }, 30_000);
    return () => { active = false; generation++; listener.data.subscription.unsubscribe(); window.clearInterval(timer); };
  }, [queryClient]);
  return createElement(AccountContext.Provider, { value: { ...state, refresh } }, children);
}
export function useAccount() { return useContext(AccountContext); }
