import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bell, BellRing, CloudCheck, HardDrive, LogIn, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHead } from "@/components/site/page-head";
import { useAlertes } from "@/hooks/use-alertes";
import { sportMeta } from "@/lib/sport-images";

export const Route = createFileRoute("/alertes")({
  head: () => ({
    meta: [
      { title: "Alertes de score — SportLive" },
      {
        name: "description",
        content:
          "Créez des alertes personnalisées pour vos équipes, joueurs et compétitions. Synchronisées sur tous vos appareils via un compte gratuit.",
      },
      { property: "og:title", content: "Alertes de score — SportLive" },
      {
        property: "og:description",
        content:
          "Ne ratez plus aucun but, panier ou finish. Alertes gratuites, synchronisées sur vos appareils.",
      },
    ],
  }),
  component: AlertesPage,
});

const QUICK: [string, string][] = [
  ["PSG", "⚽"],
  ["OM", "⚽"],
  ["Real Madrid", "⚽"],
  ["Lakers", "🏀"],
  ["Djokovic", "🎾"],
  ["Toulouse", "🏉"],
  ["Tour de France", "🚴"],
  ["F1", "🏎️"],
];

function AlertesPage() {
  const { alertes, add, remove, loading, isSignedIn } = useAlertes();
  const [input, setInput] = useState("");
  const [notifStatus, setNotifStatus] = useState<
    "default" | "granted" | "denied" | "unsupported"
  >("default");

  useEffect(() => {
    if (typeof Notification === "undefined") setNotifStatus("unsupported");
    else setNotifStatus(Notification.permission as "default" | "granted" | "denied");
  }, []);

  const handleAdd = async (name: string, icon = "🏆") => {
    const ok = await add(name, icon);
    if (ok) toast.success(`Alerte créée : ${name}`);
  };
  const handleRemove = async (name: string) => {
    await remove(name);
  };

  const enable = () => {
    if (typeof Notification === "undefined") return;
    Notification.requestPermission().then((p) => {
      setNotifStatus(p as "default" | "granted" | "denied");
      if (p === "granted") {
        toast.success("Notifications activées");
        setTimeout(() => {
          new Notification("SportLive ⚽", { body: "PSG 2–1 OM · 72' — exemple d'alerte" });
        }, 1200);
      }
    });
  };

  return (
    <>
      <PageHead
        title="Alertes"
        emphasis="de score"
        subtitle="Ajoutez équipes, joueurs et compétitions. Notifications navigateur, alertes synchronisées si vous êtes connecté."
        crumbs={[{ label: "Accueil", to: "/" }, { label: "Alertes" }]}
      />
      <section className="max-w-[1320px] mx-auto px-[5vw] py-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="card-elevated rounded-md overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-mid/60">
            <div className="text-xs font-black uppercase tracking-wider flex items-center gap-2">
              <Bell className="w-4 h-4 text-accent" /> Mes alertes de score
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-mono font-bold inline-flex items-center gap-1.5 ${
                  isSignedIn ? "text-accent" : "text-muted-fg"
                }`}
              >
                {isSignedIn ? (
                  <>
                    <CloudCheck className="w-3.5 h-3.5" /> Synchro
                  </>
                ) : (
                  <>
                    <HardDrive className="w-3.5 h-3.5" /> Local
                  </>
                )}
              </span>
              <span
                className={`text-[10px] font-mono ${
                  notifStatus === "granted"
                    ? "text-turf-2"
                    : notifStatus === "denied"
                      ? "text-[color:var(--copper)]"
                      : "text-muted-foreground"
                }`}
              >
                {notifStatus === "granted"
                  ? "✅ Actif"
                  : notifStatus === "denied"
                    ? "❌ Refusé"
                    : notifStatus === "unsupported"
                      ? "Non supporté"
                      : "Inactif"}
              </span>
            </div>
          </div>

          {!isSignedIn && (
            <div className="px-4 py-3 border-b border-border bg-live-dim/40 flex flex-wrap items-center justify-between gap-2">
              <div className="text-[12px] text-muted-2">
                🔐 <strong className="text-foreground">Synchronisez</strong> vos alertes
                sur tous vos appareils avec un compte gratuit.
              </div>
              <Link
                to="/auth"
                className="inline-flex items-center gap-1.5 bg-accent text-accent-foreground px-3 py-1.5 text-[11px] font-black uppercase tracking-wider rounded-sm hover:brightness-110 transition-all"
              >
                <LogIn className="w-3.5 h-3.5" /> Se connecter
              </Link>
            </div>
          )}

          <div className="p-4 border-b border-border">
            <div className="text-[11px] text-muted-2 mb-2.5">
              Suivre une équipe, un joueur ou un sport :
            </div>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAdd(input);
                  setInput("");
                }
              }}
              placeholder="Ex : PSG, Lakers, Nadal..."
              className="w-full px-3 py-2.5 bg-card-2 border border-border rounded-sm text-sm outline-none focus:border-live-brd"
            />
            <div className="flex flex-wrap gap-1.5 mt-3">
              {QUICK.map(([name, icon]) => {
                const selected = alertes.some((a) => a.name === name);
                return (
                  <button
                    key={name}
                    onClick={() =>
                      selected ? handleRemove(name) : handleAdd(name, icon)
                    }
                    className={`px-2.5 py-1.5 rounded-sm text-[10px] font-bold border transition-all ${
                      selected
                        ? "bg-live-dim border-live-brd text-accent"
                        : "border-border text-muted-2 hover:border-accent hover:text-foreground"
                    }`}
                  >
                    {icon} {name}
                  </button>
                );
              })}
            </div>
            <button
              onClick={enable}
              disabled={notifStatus === "unsupported" || notifStatus === "granted"}
              className="w-full mt-4 py-2.5 rounded-sm bg-live-dim border border-live-brd text-accent text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[color:var(--accent)]/20 transition-colors disabled:opacity-50"
            >
              <BellRing className="w-4 h-4" />
              {notifStatus === "granted"
                ? "Notifications activées"
                : "Activer les notifications navigateur"}
            </button>
          </div>

          <div className="p-4">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-mono mb-2 flex items-center justify-between">
              <span>Alertes actives ({alertes.length})</span>
              {loading && <span className="text-muted-fg">Chargement…</span>}
            </div>
            {alertes.length === 0 ? (
              <div className="text-[12px] text-muted-foreground text-center py-8">
                Aucune alerte configurée
              </div>
            ) : (
              alertes.map((s) => {
                const meta = sportMeta(`${s.name} ${s.icon}`);
                return (
                  <div
                    key={s.name}
                    className="flex items-center justify-between py-2.5 border-b border-border last:border-b-0 text-sm"
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="relative w-8 h-8 rounded-sm overflow-hidden border border-border shrink-0">
                        <img
                          src={meta.img}
                          alt={meta.label}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                        <span
                          className="absolute inset-0 mix-blend-overlay opacity-60"
                          style={{ background: `linear-gradient(135deg, ${meta.color}, transparent 65%)` }}
                        />
                      </span>
                      <span className="font-semibold">{s.name}</span>
                    </span>
                    <button
                      onClick={() => handleRemove(s.name)}
                      className="text-muted-foreground hover:text-[color:var(--copper)] p-1 transition-colors"
                      aria-label={`Supprimer ${s.name}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <aside className="card-elevated rounded-md p-5 border-t-2 border-t-accent">
          <h3 className="text-sm font-black uppercase mb-3 flex items-center gap-2 tracking-wider">
            <Bell className="w-4 h-4 text-accent" /> Comment ça marche
          </h3>
          <ol className="text-xs text-muted-2 leading-[1.7] space-y-2 list-decimal list-inside marker:text-accent marker:font-mono">
            <li>Ajoutez une équipe, un joueur ou un sport.</li>
            <li>Activez les notifications navigateur (une seule fois).</li>
            <li>Recevez les scores dès qu'ils tombent, même onglet fermé.</li>
            <li>
              <strong className="text-foreground">Connectez-vous</strong> pour
              synchroniser sur tous vos appareils.
            </li>
          </ol>
          <p className="mt-4 text-[10px] text-muted-foreground font-mono leading-[1.6]">
            Sans compte : vos alertes restent sur cet appareil. Avec compte : elles sont
            sauvegardées et disponibles partout.
          </p>
        </aside>
      </section>
    </>
  );
}
