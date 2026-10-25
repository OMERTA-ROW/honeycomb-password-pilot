import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAccount } from "@/hooks/use-account";

// Owner preference for the optional one-way Terminal companion card.
// Defaults to shown; a signed-in owner can hide it in Account & security.
// Never shown in password/security/recovery flows regardless of this value.
export function useTerminalPromo() {
  const { user, sessionId } = useAccount();
  const [show, setShow] = useState(true);
  useEffect(() => {
    let active = true;
    if (!user || !sessionId) { setShow(true); return; }
    void (async () => {
      const { data, error } = await supabase.from("profiles").select("preferences").eq("id", user.id).single();
      if (!active) return;
      if (error || !data) { setShow(true); return; }
      const prefs = data.preferences as Record<string, unknown> | null;
      setShow(prefs?.show_terminal_promo !== false);
    })();
    return () => { active = false; };
  }, [user, sessionId]);
  return show;
}
