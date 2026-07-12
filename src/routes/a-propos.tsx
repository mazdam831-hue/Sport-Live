import { createFileRoute } from "@tanstack/react-router";
import { PageHead } from "@/components/site/page-head";

export const Route = createFileRoute("/a-propos")({
  head: () => ({
    meta: [
      { title: "À propos — SportLive" },
      { name: "description", content: "SportLive : portail sport gratuit — scores en direct, actualités, streaming vérifié, alertes personnalisées." },
      { property: "og:title", content: "À propos — SportLive" },
      { property: "og:description", content: "Notre mission : rendre le sport accessible à tous, en un seul portail gratuit." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <PageHead
        title="À propos"
        emphasis="SportLive"
        subtitle="Un portail unique pour suivre le sport : scores, actus, streaming légal et alertes — gratuit et sans compte."
        crumbs={[{ label: "Accueil", to: "/" }, { label: "À propos" }]}
      />
      <section className="max-w-[1320px] mx-auto px-[5vw] py-8 grid gap-8 lg:grid-cols-[1fr_330px]">
        <article className="text-[13px] text-muted-2 leading-[1.8] max-w-[740px]">
          <h3 className="text-foreground font-display text-[15px] font-bold uppercase tracking-wider mt-0 mb-2">
            Notre mission
          </h3>
          <p className="mb-3">
            SportLive rassemble en un seul endroit les scores en direct, les actualités et les plateformes de
            streaming vérifiées. Pas de pop-up, pas de compte à créer, pas de données revendues.
          </p>
          <h3 className="text-foreground font-display text-[15px] font-bold uppercase tracking-wider mt-6 mb-2">
            Sources
          </h3>
          <p className="mb-3">
            Les scores peuvent être branchés sur TheSportsDB ou API-Football. Les actualités agrègent des sources
            reconnues (L'Équipe, Eurosport, FranceInfo Sport, LNR, NBA.com, F1 TV). Le streaming ne renvoie que vers
            des diffuseurs légaux.
          </p>
          <h3 className="text-foreground font-display text-[15px] font-bold uppercase tracking-wider mt-6 mb-2">
            Vie privée
          </h3>
          <p className="mb-3">
            Vos alertes sont stockées localement dans votre navigateur (localStorage). Aucun serveur n'a connaissance
            de vos préférences.
          </p>
          <h3 className="text-foreground font-display text-[15px] font-bold uppercase tracking-wider mt-6 mb-2">
            Contact
          </h3>
          <p>Pour toute question : contact@sportlive.example</p>
        </article>
        <aside className="bg-card border border-border rounded-md p-5 border-t-2 border-t-turf h-fit">
          <h3 className="text-sm font-extrabold uppercase mb-2">Contact rapide</h3>
          <p className="text-xs text-muted-2 leading-[1.6] mb-2">
            Une suggestion, une correction, un partenariat ? Écrivez-nous, on lit tout.
          </p>
          <a
            href="mailto:contact@sportlive.example"
            className="text-xs font-bold text-live font-mono uppercase tracking-wider"
          >
            contact@sportlive.example →
          </a>
        </aside>
      </section>
    </>
  );
}
