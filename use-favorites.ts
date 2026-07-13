import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";

const LS_KEY = "sportlive_favorites";

function readLocal(): string[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}
function writeLocal(slugs: string[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(slugs));
  window.dispatchEvent(new Event("sportlive:favorites"));
}

export function useFavorites() {
  const { user, loading: authLoading } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      if (user) {
        const { data, error } = await supabase
          .from("favorites")
          .select("sport_slug")
          .eq("user_id", user.id);
        if (!cancelled) {
          if (error) {
            setFavorites(readLocal());
          } else {
            const slugs = (data ?? []).map((r) => r.sport_slug);
            setFavorites(slugs);
            // Migrate localStorage → Supabase on first sign-in
            const local = readLocal();
            if (local.length && !slugs.length) {
              await supabase.from("favorites").insert(
                local.map((s) => ({ user_id: user.id, sport_slug: s })),
              );
              const { data: after } = await supabase
                .from("favorites")
                .select("sport_slug")
                .eq("user_id", user.id);
              setFavorites((after ?? []).map((r) => r.sport_slug));
              localStorage.removeItem(LS_KEY);
            }
          }
          setLoading(false);
        }
      } else {
        if (!cancelled) {
          setFavorites(readLocal());
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  const toggle = useCallback(
    async (sportSlug: string) => {
      const isFav = favorites.includes(sportSlug);
      const next = isFav
        ? favorites.filter((s) => s !== sportSlug)
        : [...favorites, sportSlug];
      // Optimiste : UI mise à jour immédiatement
      setFavorites(next);
      if (!user) {
        writeLocal(next);
        return;
      }
      // Rollback si l'opération Supabase échoue
      if (isFav) {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("sport_slug", sportSlug);
        if (error) {
          console.error("favorites delete", error);
          setFavorites(favorites); // rollback
        }
      } else {
        const { error } = await supabase
          .from("favorites")
          .insert({ user_id: user.id, sport_slug: sportSlug });
        if (error) {
          console.error("favorites insert", error);
          setFavorites(favorites); // rollback
        }
      }
    },
    [favorites, user],
  );

  const isFavorite = useCallback(
    (sportSlug: string) => favorites.includes(sportSlug),
    [favorites],
  );

  return { favorites, toggle, isFavorite, loading };
}
