/**
 * Modal d'authentification — même logique que /auth mais sans navigation.
 * Utilisé depuis la topbar pour une auth sans quitter la page.
 */
import { useEffect, useState, type ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, LogIn, Mail } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

interface AuthModalProps {
  /** Trigger button / element */
  children: ReactNode;
}

export function AuthModal({ children }: AuthModalProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  // Ferme automatiquement après connexion réussie
  useEffect(() => {
    if (user && open) setOpen(false);
  }, [user, open]);

  const google = async () => {
    setBusy(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) {
      toast.error("Erreur Google", { description: error.message });
      setBusy(false);
    }
    // Supabase redirige le navigateur — pas besoin de fermer la modal
  };

  const submitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast.success("Compte créé", {
          description: "Vérifiez votre email si une confirmation est demandée.",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Connecté");
        setOpen(false);
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
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>

      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm animate-fade-in" />

        {/* Contenu */}
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-[91] -translate-x-1/2 -translate-y-1/2 w-full max-w-sm px-4 animate-fade-up"
          aria-describedby={undefined}
        >
          <div className="card-elevated rounded-md p-6 border border-border">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="text-sm font-black uppercase tracking-wider">
                {mode === "signin" ? "Connexion" : "Créer un compte"}
              </Dialog.Title>
              <Dialog.Close className="text-muted-2 hover:text-foreground transition-colors p-1 rounded-sm">
                <X className="w-4 h-4" />
              </Dialog.Close>
            </div>

            {/* Tabs signin / signup */}
            <div className="flex gap-2 mb-5 border-b border-border">
              {(["signin", "signup"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`flex-1 pb-2.5 text-xs font-black uppercase tracking-wider transition-colors ${
                    mode === m
                      ? "text-accent border-b-2 border-accent -mb-px"
                      : "text-muted-2 hover:text-foreground"
                  }`}
                >
                  {m === "signin" ? "Connexion" : "Créer un compte"}
                </button>
              ))}
            </div>

            {/* Google OAuth */}
            <button
              type="button"
              onClick={google}
              disabled={busy}
              className="w-full py-2.5 rounded-sm bg-white text-black font-bold text-sm inline-flex items-center justify-center gap-2.5 hover:brightness-95 transition-all disabled:opacity-50 mb-4"
            >
              <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden>
                <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.4-7.7 19.4-20 0-1.3-.1-2.7-.4-4z" />
                <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.5 15.1 18.9 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
                <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.3 35.4 26.8 36 24 36c-5.2 0-9.6-3-11.3-7.3l-6.5 5C9.6 39.6 16.3 44 24 44z" />
                <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.8 2.2-2.3 4-4.2 5.2l6.2 5.2C41.1 35.1 44 30 44 24c0-1.3-.1-2.7-.4-4z" />
              </svg>
              Continuer avec Google
            </button>

            <div className="flex items-center gap-3 mb-4">
              <hr className="flex-1 border-border" />
              <span className="text-[10px] text-muted-fg font-mono">ou</span>
              <hr className="flex-1 border-border" />
            </div>

            {/* Email / mot de passe */}
            <form onSubmit={submitEmail} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-2 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="vous@example.com"
                  className="w-full bg-input border border-border rounded-sm px-3 py-2 text-sm text-foreground placeholder:text-muted-fg focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-2 mb-1">
                  Mot de passe
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="6 caractères minimum"
                  className="w-full bg-input border border-border rounded-sm px-3 py-2 text-sm text-foreground placeholder:text-muted-fg focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={busy}
                className="w-full py-2.5 bg-accent text-accent-foreground rounded-sm text-sm font-black uppercase tracking-wider inline-flex items-center justify-center gap-2 hover:brightness-110 transition-all disabled:opacity-50 mt-1"
              >
                <LogIn className="w-4 h-4" />
                {mode === "signin" ? "Se connecter" : "Créer mon compte"}
              </button>
            </form>

            <p className="text-[9px] text-muted-fg font-mono text-center mt-4 leading-relaxed">
              Vos alertes locales seront synchronisées automatiquement.
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
