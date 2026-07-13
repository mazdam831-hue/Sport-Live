import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, LogIn, LogOut, Moon, Palette, Sun, Trophy, User as UserIcon } from "lucide-react";
import { useTheme, type Theme, type Bg } from "./theme-provider";
import { useAuth } from "@/hooks/use-auth";

function useClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const i = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(i);
  }, []);
  return now;
}

const THEME_LABEL: Record<Theme, string> = {
  dark: "Sombre",
  stadium: "Stade",
  light: "Clair",
};
const BG_LABEL: Record<Bg, string> = {
  default: "Neutre",
  stadium: "Stadium",
  court: "Parquet",
  clay: "Terre battue",
};

export function Topbar() {
  const now = useClock();
  const { theme, bg, cycleTheme, setBg } = useTheme();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [subs, setSubs] = useState(0);
  const [menu, setMenu] = useState<null | "bg" | "user">(null);

  useEffect(() => {
    const readSubs = () => {
      try {
        const s = JSON.parse(localStorage.getItem("sportlive_subs") || "[]");
        setSubs(Array.isArray(s) ? s.length : 0);
      } catch {
        setSubs(0);
      }
    };
    readSubs();
    window.addEventListener("sportlive:subs", readSubs);
    window.addEventListener("storage", readSubs);
    return () => {
      window.removeEventListener("sportlive:subs", readSubs);
      window.removeEventListener("storage", readSubs);
    };
  }, [user]);

  const dateStr = now
    ? now.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" }).toUpperCase()
    : "—";
  const timeStr = now ? now.toLocaleTimeString("fr-FR", { hour12: false }) : "--:--:--";

  const ThemeIcon = theme === "light" ? Sun : Moon;

  return (
    <div className="h-[38px] bg-mid border-b border-border flex items-center justify-between px-[5vw] text-xs relative z-[60]">
      <div className="flex items-center gap-4">
        <span className="font-mono text-[11px] text-muted-2 hidden sm:inline tabnum">{dateStr}</span>
        <span className="font-mono text-[13px] font-bold text-accent tracking-[2px] tabnum">{timeStr}</span>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="hidden md:inline-flex live-badge">Scores live</span>

        {/* Background switcher */}
        <div className="relative">
          <button
            onClick={() => setMenu(menu === "bg" ? null : "bg")}
            className="border border-border rounded-sm text-muted-2 px-2 py-1 hover:text-foreground hover:border-live-brd transition-colors inline-flex items-center gap-1.5"
            aria-label="Choisir un fond"
          >
            <Palette className="w-[14px] h-[14px]" />
            <span className="hidden sm:inline text-[11px] font-semibold">{BG_LABEL[bg]}</span>
          </button>
          {menu === "bg" && (
            <div className="absolute right-0 top-full mt-1.5 w-44 card-elevated rounded-sm p-1.5 animate-fade-in">
              {(Object.keys(BG_LABEL) as Bg[]).map((b) => (
                <button
                  key={b}
                  onClick={() => {
                    setBg(b);
                    setMenu(null);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 text-[11px] font-semibold rounded-sm transition-colors ${
                    bg === b ? "bg-live-dim text-accent" : "text-muted-2 hover:bg-white/5 hover:text-foreground"
                  }`}
                >
                  {BG_LABEL[b]}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={cycleTheme}
          className="border border-border rounded-sm text-muted-2 px-2 py-1 hover:text-foreground hover:border-live-brd transition-colors inline-flex items-center gap-1.5"
          aria-label="Changer le thème"
          title={`Thème : ${THEME_LABEL[theme]}`}
        >
          <ThemeIcon className="w-[14px] h-[14px]" />
        </button>

        <Link
          to="/alertes"
          className="relative border border-border rounded-sm text-muted-2 px-2 py-1 hover:text-foreground hover:border-live-brd transition-colors flex items-center gap-1.5 text-[11px] font-semibold"
        >
          <Bell className="w-[14px] h-[14px]" />
          <span className="hidden sm:inline">Alertes</span>
          {subs > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-accent text-accent-foreground w-[16px] h-[16px] rounded-full text-[9px] font-black flex items-center justify-center">
              {subs}
            </span>
          )}
        </Link>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setMenu(menu === "user" ? null : "user")}
            className="border border-border rounded-sm text-muted-2 px-2 py-1 hover:text-foreground hover:border-live-brd transition-colors inline-flex items-center gap-1.5 text-[11px] font-semibold"
            aria-label="Compte"
          >
            <UserIcon className="w-[14px] h-[14px]" />
            <span className="hidden md:inline max-w-[100px] truncate">
              {user?.email ? user.email.split("@")[0] : "Compte"}
            </span>
          </button>
          {menu === "user" && (
            <div className="absolute right-0 top-full mt-1.5 w-56 card-elevated rounded-sm p-2 animate-fade-in">
              {user ? (
                <>
                  <div className="px-2 py-1.5 text-[11px] text-muted-2 border-b border-border">
                    <div className="font-mono truncate flex items-center gap-1.5">
                      <Trophy className="w-3 h-3 text-accent" /> Connecté
                    </div>
                    <div className="truncate text-foreground text-[12px] font-semibold mt-0.5">
                      {user.email}
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      await signOut();
                      setMenu(null);
                    }}
                    className="mt-1 w-full text-left px-2.5 py-1.5 text-[11px] font-semibold text-muted-2 hover:bg-white/5 hover:text-foreground rounded-sm inline-flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <div className="px-2 py-1.5 text-[11px] text-muted-2">
                    Connectez-vous pour synchroniser vos alertes sur tous vos appareils.
                  </div>
                  <button
                    onClick={() => {
                      navigate({ to: "/auth" });
                      setMenu(null);
                    }}
                    className="mt-1 w-full px-2.5 py-2 text-[11px] font-bold bg-accent text-accent-foreground rounded-sm inline-flex items-center justify-center gap-2 hover:opacity-90"
                  >
                    <LogIn className="w-3.5 h-3.5" /> Se connecter
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
