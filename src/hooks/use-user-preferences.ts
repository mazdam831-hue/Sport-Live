/**
 * Pont entre ThemeProvider (localStorage) et la table user_preferences (Supabase).
 * À placer sous <ThemeProvider> dans __root.tsx via <UserPreferenceSync />.
 *
 * Flux :
 *  1. Connexion → charge theme/bg depuis Supabase, applique via setTheme/setBg.
 *  2. Changement de thème → sauvegarde dans Supabase (si connecté).
 *  3. Première connexion → push les préférences locales vers Supabase.
 */
import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";
import { useTheme, type Theme, type Bg } from "@/components/site/theme-provider";

const VALID_THEMES: Theme[] = ["dark", "light", "stadium"];
const VALID_BGS: Bg[] = ["default", "stadium", "court", "clay"];

const isTheme = (v: string): v is Theme => VALID_THEMES.includes(v as Theme);
const isBg = (v: string): v is Bg => VALID_BGS.includes(v as Bg);

export function useUserPreferences() {
  const { user } = useAuth();
  const { theme, bg, setTheme, setBg } = useTheme();
  // Flags pour éviter une boucle save↔load au chargement initial
  const initialized = useRef(false);
  const skipNextSave = useRef(false);

  // ── Chargement depuis Supabase lors de la connexion ──
  useEffect(() => {
    if (!user) {
      initialized.current = false;
      return;
    }
    (async () => {
      const { data } = await supabase
        .from("user_preferences")
        .select("theme, bg")
        .eq("user_id", user.id)
        .single();

      if (data) {
        // Préférences existantes : applique sans déclencher un re-save
        skipNextSave.current = true;
        if (isTheme(data.theme)) setTheme(data.theme);
        if (isBg(data.bg)) setBg(data.bg);
        // Laisse les effects de theme/bg s'exécuter avant de réactiver le save
        setTimeout(() => {
          skipNextSave.current = false;
          initialized.current = true;
        }, 100);
      } else {
        // Première connexion : push les préférences locales actuelles
        await supabase.from("user_preferences").insert({
          user_id: user.id,
          theme,
          bg,
          favorite_sports: [],
        });
        initialized.current = true;
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // ── Sauvegarde vers Supabase à chaque changement de thème/fond ──
  useEffect(() => {
    if (!user || !initialized.current || skipNextSave.current) return;
    supabase.from("user_preferences").upsert(
      {
        user_id: user.id,
        theme,
        bg,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );
  }, [theme, bg, user?.id]);
}

/** Composant sans rendu — à placer à l'intérieur de <ThemeProvider> dans __root.tsx */
export function UserPreferenceSync() {
  useUserPreferences();
  return null;
}
