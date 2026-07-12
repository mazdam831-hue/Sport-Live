import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { Topbar } from "@/components/site/topbar";
import { SiteNav } from "@/components/site/nav";
import { Ticker } from "@/components/site/ticker";
import { SiteFooter } from "@/components/site/footer";
import { ThemeProvider } from "@/components/site/theme-provider";
import { Toaster } from "sonner";
import { UserPreferenceSync } from "@/hooks/use-user-preferences";
import { FallbackBanner } from "@/components/site/fallback-banner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-display font-black text-gradient-live">404</h1>
        <h2 className="mt-4 text-xl font-bold uppercase tracking-wider">Page introuvable</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Cette page n'existe pas ou a été déplacée.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-sm bg-accent text-accent-foreground px-5 py-2.5 text-sm font-black uppercase tracking-wider hover:opacity-90"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-bold uppercase tracking-wider">Erreur de chargement</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Un problème est survenu. Réessayez ou revenez à l'accueil.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-sm bg-accent text-accent-foreground px-4 py-2 text-sm font-bold"
          >
            Réessayer
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-sm border border-border px-4 py-2 text-sm font-semibold"
          >
            Accueil
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "SportLive — Scores en direct, actus & streaming sport gratuit" },
      {
        name: "description",
        content:
          "Scores en temps réel, actualités sportives, alertes personnalisées et streaming vérifié. Football, tennis, basket, F1, rugby et plus.",
      },
      { name: "author", content: "SportLive" },
      { property: "og:title", content: "SportLive — Scores en direct" },
      {
        property: "og:description",
        content:
          "Portail sport gratuit : scores live, actus, streaming vérifié et alertes personnalisées.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "/backgrounds/stadium.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "/backgrounds/stadium.jpg" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:ital,wght@0,600;0,700;0,800;0,900;1,700;1,900&family=Inter:wght@400;500;600;700;800;900&family=Space+Mono:wght@400;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body data-bg="default">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <UserPreferenceSync />
        <div className="flex min-h-screen flex-col">
          <Topbar />
          <SiteNav />
          <Ticker />
          <main className="flex-1">
            <Outlet />
          </main>
          <SiteFooter />
        </div>
        <Toaster theme="dark" position="top-right" />
        <FallbackBanner />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
