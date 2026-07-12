import { createFileRoute } from "@tanstack/react-router";
import { PageHead } from "@/components/site/page-head";
import { HoraireCard } from "@/components/site/cards";
import { HORAIRES } from "@/data/mock";

export const Route = createFileRoute("/horaires")({
  head: () => ({
    meta: [
      { title: "Programme TV sport — Horaires — SportLive" },
      { name: "description", content: "Programme TV sport : horaires habituels par sport et compétition. Football, tennis, F1, MotoGP, cyclisme, rugby, basket." },
      { property: "og:title", content: "Programme sport — SportLive" },
      { property: "og:description", content: "Les horaires de diffusion de vos sports préférés, en un coup d'œil." },
    ],
  }),
  component: HorairesPage,
});

function HorairesPage() {
  return (
    <>
      <PageHead
        title="Programme"
        emphasis="TV"
        subtitle="Horaires habituels par compétition. Vérifiez toujours la grille de la chaîne le jour même."
        crumbs={[{ label: "Accueil", to: "/" }, { label: "Programme" }]}
      />
      <section className="max-w-[1320px] mx-auto px-[5vw] py-8">
        <div className="grid gap-2.5 [grid-template-columns:repeat(auto-fill,minmax(210px,1fr))]">
          {HORAIRES.map((h) => (
            <HoraireCard key={h.title} h={h} />
          ))}
        </div>
      </section>
    </>
  );
}
