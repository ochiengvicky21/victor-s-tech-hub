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
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";

const FAVICON = "/favicon-voo-v3.png";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="max-w-md rounded-2xl border border-rule bg-white p-10 text-center shadow-sm">
        <p className="eyebrow">404 · signal lost</p>
        <h1 className="mt-3 serif-display text-6xl">Off the grid</h1>
        <p className="mt-3 text-sm ink-soft">That route isn&apos;t here. Let&apos;s get you back.</p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper hover:opacity-90">
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="max-w-md rounded-2xl border border-rule bg-white p-10 text-center shadow-sm">
        <p className="eyebrow">system · interrupted</p>
        <h1 className="mt-3 serif-display text-4xl">Something shorted out</h1>
        <p className="mt-3 text-sm ink-soft">Refresh to reroute, or head home.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper hover:opacity-90"
          >
            Try again
          </button>
          <a href="/" className="rounded-full border border-rule px-5 py-2.5 text-sm font-medium hover:bg-surface">
            Go home
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
      { title: "Victor Otieno Ochieng — Full Stack Engineer & SaaS Architect" },
      { name: "description", content: "Victor Otieno Ochieng — full stack engineer, AI systems builder and SaaS architect. Designing scalable digital systems for ambitious businesses across Africa and beyond." },
      { name: "author", content: "Victor Otieno Ochieng" },
      { name: "theme-color", content: "#fafbfc" },
      { property: "og:title", content: "Victor Otieno Ochieng — Full Stack Engineer & SaaS Architect" },
      { property: "og:description", content: "Designing scalable digital systems for ambitious businesses." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Victor Otieno Ochieng" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: FAVICON },
      { rel: "shortcut icon", type: "image/png", href: FAVICON },
      { rel: "apple-touch-icon", href: FAVICON },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Work+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
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
      <div className="relative min-h-screen pt-5">
        <Navbar />
        <main className="relative z-10">
          <Outlet />
        </main>
        <Footer />
      </div>
    </QueryClientProvider>
  );
}
