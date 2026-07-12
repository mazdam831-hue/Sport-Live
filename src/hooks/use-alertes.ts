import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";

export type Alerte = { name: string; icon: string };

const LS_KEY = "sportlive_subs";

function readLocal(): Alerte[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}
function writeLocal(a: Alerte[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(a));
  window.dispatchEvent(new Event("sportlive:subs"));
}

export function useAlertes() {
  const { user, loading: authLoading } = useAuth();
  const [alertes, setAlertes] = useState<Alerte[]>([]);
  const [loading, setLoading] = useState(true);

  // Load: from DB if signed in, else from localStorage
  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      if (user) {
        const { data, error } = await supabase
          .from("alertes")
          .select("name, icon")
          .order("created_at", { ascending: true });
        if (!cancelled) {
          if (error) {
            console.error("alertes fetch", error);
            setAlertes(readLocal());
          } else {
            setAlertes((data ?? []) as Alerte[]);
            // Migrate localStorage -> DB on first login
            const local = readLocal();
            if (local.length && !(data ?? []).length) {
              await supabase.from("alertes").insert(
                local.map((a) => ({ user_id: user.id, name: a.name, icon: a.icon })),
              );
              const { data: after } = await supabase
                .from("alertes")
                .select("name, icon")
                .order("created_at", { ascending: true });
              setAlertes((after ?? []) as Alerte[]);
              localStorage.removeItem(LS_KEY);
            }
          }
          setLoading(false);
        }
      } else {
        if (!cancelled) {
          setAlertes(readLocal());
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  const notify = useCallback((next: Alerte[]) => {
    setAlertes(next);
    if (!user) writeLocal(next);
    window.dispatchEvent(new Event("sportlive:subs"));
  }, [user]);

  const add = useCallback(
    async (name: string, icon = "🏆") => {
      const n = name.trim();
      if (!n) return false;
      if (alertes.some((a) => a.name.toLowerCase() === n.toLowerCase())) return false;
      const next = [...alertes, { name: n, icon }];
      notify(next);
      if (user) {
        const { error } = await supabase
          .from("alertes")
          .insert({ user_id: user.id, name: n, icon });
        if (error) {
          console.error("alertes insert", error);
          notify(alertes); // rollback
          return false;
        }
      }
      return true;
    },
    [alertes, user, notify],
  );

  const remove = useCallback(
    async (name: string) => {
      const next = alertes.filter((a) => a.name !== name);
      notify(next);
      if (user) {
        await supabase.from("alertes").delete().eq("user_id", user.id).eq("name", name);
      }
    },
    [alertes, user, notify],
  );

  return { alertes, add, remove, loading, isSignedIn: !!user };
}
