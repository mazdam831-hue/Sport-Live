import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LogIn, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageHead } from "@/components/site/page-head";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Connexion — SportLive" },
      {
        name: "description",
        content:
          "Connectez-vous pour synchroniser vos alertes sur tous vos appareils. Google ou email.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) navigate({ to: "/alertes", replace: true });
  }, [user, navigate]);

  const google = async () => {
    setBusy(true);
    const { error, data } = await supabase.auth.signInWithOAuth("google", {
      redirectTo: window.location.origin + "/auth/callback",
    });
    if (error) {
      toast.error("Erreur Google", { description: error.message });
      setBusy(false);
      return;
    }
    navigate({ to: "/alertes" });
  };

  const submitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/alertes" },
        });
        if (error) throw error;
        toast.success("Compte créé", {
          description: "Vérifiez votre email pour confirmer si demandé.",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Connecté");
        navigate({ to: "/alertes" });
      }
    } catch (err) {
      toast.error("Erreur", {
        description: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHead
        title="Connexion"
        emphasis="SportLive"
        subtitle="Synchronisez vos alertes sur tous vos appareils. Aucune donnée personnelle vendue."
        crumbs={[{ label: "Accueil", to: "/" }, { label: "Connexion" }]}
      />
      <section className="max-w-md mx-auto px-[5vw] py-10">
        <div className="card-elevated rounded-md p-6">
          <div className="flex gap-2 mb-6 border-b border-border">
            {(["signin", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 pb-3 text-xs font-black uppercase tracking-wider transition-colors ${
                  mode === m
                    ? "text-accent border-b-2 border-accent -mb-px"
                    : "text-muted-2 hover:text-foreground"
                }`}
              >
                {m === "signin" ? "Connexion" : "Créer un compte"}
              </button>
            ))}
          </div>

          <button
            onClick={google}
            disabled={busy}
            className="w-full py-3 rounded-sm bg-white text-black font-bold text-sm inline-flex items-center justify-center gap-2.5 hover:brightness-95 transition-all disabled:opacity-50 mb-4"
          >
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
              <path
                fill="#FFC107"
                d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.2 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z"
              />
              <path
                fill="#FF3D00"
                d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.2 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
              />
              <path
                fill="#4CAF50"
                d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.5-4.5 2.4-7.2 2.4-5.2 0-9.6-3.3-11.2-8L6.2 32.8C9.6 39.4 16.3 44 24 44z"
              />
              <path
                fill="#1976D2"
                d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.1 5.6l6.2 5.2C41.5 35.7 44 30.3 44 24c0-1.2-.1-2.3-.4-3.5z"
              />
            </svg>
            Continuer avec Google
          </button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-card px-3 text-[10px] font-mono uppercase tracking-wider text-muted-fg">
                ou email
              </span>
            </div>
          </div>

          <form onSubmit={submitEmail} className="space-y-3">
            <input
              type="email"
              required
              autoComplete="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 bg-card-2 border border-border rounded-sm text-sm outline-none focus:border-live-brd"
            />
            <input
              type="password"
              required
              minLength={6}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 bg-card-2 border border-border rounded-sm text-sm outline-none focus:border-live-brd"
            />
            <button
              type="submit"
              disabled={busy}
              className="w-full py-3 rounded-sm bg-accent text-accent-foreground text-sm font-black uppercase tracking-wider inline-flex items-center justify-center gap-2 hover:brightness-110 transition-all disabled:opacity-50"
            >
              {mode === "signup" ? (
                <>
                  <Mail className="w-4 h-4" /> Créer mon compte
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" /> Se connecter
                </>
              )}
            </button>
          </form>
        </div>
        <p className="text-[10px] text-muted-fg font-mono text-center mt-4">
          Vos alertes locales seront automatiquement synchronisées après connexion.
        </p>
      </section>
    </>
  );
}
