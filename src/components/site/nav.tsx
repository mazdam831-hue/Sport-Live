import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Bell, Menu, Radio, X } from "lucide-react";
import { NAV_LINKS } from "@/data/mock";

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 border-b transition-[background,backdrop-filter,border-color,height] duration-300 ${
        scrolled
          ? "bg-background/85 backdrop-blur-2xl border-border shadow-[0_1px_0_0_var(--live-brd)]"
          : "bg-background/60 backdrop-blur-md border-transparent"
      }`}
    >
      <div
        className={`max-w-[1320px] mx-auto px-[5vw] flex items-center justify-between gap-4 transition-[height] duration-300 ${
          scrolled ? "h-[52px]" : "h-[66px]"
        }`}
      >
        <Link
          to="/"
          className="group flex items-center gap-2.5 font-display font-black tracking-[0.02em] uppercase"
        >
          <span className="relative w-9 h-9 grid place-items-center rounded-sm bg-gradient-to-br from-turf to-[color:var(--sport-foot)] text-accent-foreground border border-live-brd overflow-hidden">
            <Radio className="w-[16px] h-[16px]" />
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-transparent to-white/20" />
          </span>
          <span
            className={`leading-none tracking-tight transition-[font-size] ${scrolled ? "text-lg" : "text-xl"}`}
          >
            Sport<span className="text-gradient-live italic font-black">Live</span>
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-0.5">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="relative px-3 py-1.5 rounded-sm text-[13px] font-semibold text-muted-2 hover:text-foreground transition-colors group"
              activeProps={{
                className:
                  "relative px-3 py-1.5 rounded-sm text-[13px] font-bold text-accent bg-live-dim",
              }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
              <span className="absolute left-3 right-3 -bottom-0.5 h-[2px] bg-accent scale-x-0 origin-left transition-transform duration-200 group-hover:scale-x-100" />
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/alertes"
            className="hidden md:inline-flex items-center gap-1.5 bg-accent text-accent-foreground px-4 py-2 text-xs font-black uppercase tracking-wider rounded-sm hover:brightness-110 transition-all shadow-[0_4px_20px_-4px_var(--live-brd)]"
          >
            <Bell className="w-[14px] h-[14px]" /> Mes alertes
          </Link>
          <button
            className="lg:hidden p-1.5 rounded-sm hover:bg-white/5"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden bg-mid border-t border-border flex flex-col animate-fade-in">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="px-[5vw] py-3.5 text-sm text-muted-2 border-b border-border"
              activeProps={{
                className: "px-[5vw] py-3.5 text-sm text-accent border-b border-border font-bold bg-live-dim",
              }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
