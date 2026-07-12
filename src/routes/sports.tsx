import { createFileRoute } from "@tanstack/react-router";
import { PageHead } from "@/components/site/page-head";
import { SportCard } from "@/components/site/cards";
import { SPORTS } from "@/data/mock";

export const Route = createFileRoute("/sports")({
  head: () => ({
    meta: [
      { title: "Tous les sports — SportLive" },
      { name: "description", content: "Football, tennis, basket, F1, cyclisme, rugby, handball, MMA, MotoGP, athlétisme… tous les sports couverts sur SportLive." },
      { property: "og:title", content: "Tous les sports — SportLive" },
      { property: "og:description", content: "Choisis ton sport et retrouve scores, actus, streaming et alertes dédiés." },
    ],
  }),
  component: SportsPage,
});

function SportsPage() {
  return (
    <>
      <PageHead
        title="Sports"
        emphasis="couverts"
        subtitle="Plus de 12 sports suivis en continu. Choisis un sport pour ses scores, actus et diffuseurs."
        crumbs={[{ label: "Accueil", to: "/" }, { label: "Sports" }]}
      />
      <section className="max-w-[1320px] mx-auto px-[5vw] py-8">
        <div className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(250px,1fr))]">
          {SPORTS.map((s) => (
            <SportCard key={s.slug} s={s} />
          ))}
        </div>
      </section>
    </>
  );
}
