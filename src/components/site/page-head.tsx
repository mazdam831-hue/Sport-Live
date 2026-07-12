import { Link } from "@tanstack/react-router";

export function PageHead({
  title,
  emphasis,
  subtitle,
  crumbs,
}: {
  title: string;
  emphasis?: string;
  subtitle?: string;
  crumbs?: { label: string; to?: string }[];
}) {
  return (
    <section className="relative overflow-hidden border-b border-border py-11 px-[5vw]">
      <span className="absolute top-0 left-0 w-[3px] h-full bg-live" />
      <div className="max-w-[1320px] mx-auto">
        {crumbs && (
          <div className="font-mono text-[11px] text-muted-foreground mb-3.5 flex items-center gap-1.5">
            {crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {c.to ? (
                  <Link to={c.to} className="text-muted-2 hover:text-foreground">
                    {c.label}
                  </Link>
                ) : (
                  <span>{c.label}</span>
                )}
                {i < crumbs.length - 1 && <span>/</span>}
              </span>
            ))}
          </div>
        )}
        <h1 className="font-display font-extrabold uppercase leading-[0.98] tracking-wide text-[clamp(34px,5vw,54px)]">
          {title} {emphasis && <em className="not-italic text-live">{emphasis}</em>}
        </h1>
        {subtitle && <p className="text-sm text-muted-2 mt-3 max-w-xl leading-[1.65]">{subtitle}</p>}
      </div>
    </section>
  );
}
