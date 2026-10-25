import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

// Real account identity only; never unlocks any vault or wallet data.
export function useAccount() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    let generation = 0;
    const refresh = async () => {
      const current = ++generation;
      const { data, error: identityError } = await supabase.auth.getUser();
      if (!active || current !== generation) return;
      if (identityError || !data.user) { setUser(null); setSessionId(null); setReady(true); return; }
      const registration = await supabase.rpc("register_account_session");
      if (!active || current !== generation) return;
      if (registration.error) {
        setUser(null); setSessionId(null); setError("Your account session expired or was revoked. Sign in again."); setReady(true); return;
      }
      setUser(data.user); setSessionId(registration.data); setError(""); setReady(true);
    };
    const { data: listener } = supabase.auth.onAuthStateChange(() => { window.setTimeout(() => { void refresh(); }, 0); });
    void refresh();
    const interval = window.setInterval(() => { void refresh(); }, 30_000);
    return () => { active = false; generation++; listener.subscription.unsubscribe(); window.clearInterval(interval); };
  }, []);
  return { user, ready, error, sessionId };
}