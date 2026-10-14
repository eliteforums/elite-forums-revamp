import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  useRouterState,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Toaster } from "@/components/ui/sonner";
import { CookieConsent } from "@/components/site/CookieConsent";
import { SiteContentProvider } from "@/lib/content-context";
import { Analytics } from "@/components/site/Analytics";
import { getSiteContent } from "@/lib/content.functions";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow text-electric">404 · Lost in the ecosystem</p>
        <h1 className="display-xl mt-5 text-6xl text-foreground">Page not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
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
      { title: "Startup Community in India for Aspiring Founders — Elite Forums" },
      {
        name: "description",
        content:
          "Join Elite Forums, an India-focused startup community for aspiring founders and student entrepreneurs. Explore founder programmes, events, college partnerships and practical resources.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://eliteforums.in/" },
      { property: "og:site_name", content: "Elite Forums" },
      { property: "og:locale", content: "en_IN" },
      {
        property: "og:title",
        content: "Startup Community in India for Aspiring Founders — Elite Forums",
      },
      {
        property: "og:description",
        content:
          "Join Elite Forums, an India-focused startup community for aspiring founders and student entrepreneurs. Explore founder programmes, events, college partnerships and practical resources.",
      },
      { property: "og:image", content: "https://eliteforums.in/og-image.png" },
      { property: "og:image:secure_url", content: "https://eliteforums.in/og-image.png" },
      { property: "og:image:alt", content: "Elite Forums founder and startup ecosystem" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "Startup Community in India for Aspiring Founders — Elite Forums",
      },
      {
        name: "twitter:description",
        content:
          "Join an India-focused community for aspiring founders, student entrepreneurs, colleges and E-Cells.",
      },
      { name: "twitter:image", content: "https://eliteforums.in/og-image.png" },
      { name: "twitter:image:alt", content: "Elite Forums founder and startup ecosystem" },
      { name: "theme-color", content: "#0a0a0a" },
      ...(import.meta.env.VITE_GOOGLE_SITE_VERIFICATION
        ? [
            {
              name: "google-site-verification",
              content: import.meta.env.VITE_GOOGLE_SITE_VERIFICATION,
            },
          ]
        : []),
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/site.webmanifest" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap",
      },
    ],
  }),
  // Administrator edits to the site copy; pages fall back to defaults without it.
  loader: () => getSiteContent(),
  staleTime: 60_000,
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              window.gtag = function() { window.dataLayer.push(arguments); };
              window.gtag("consent", "default", {
                ad_storage: "denied",
                ad_user_data: "denied",
                ad_personalization: "denied",
                analytics_storage: "denied"
              });
              window.gtag("js", new Date());
            `,
          }}
        />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-RZY47VR9T3"></script>
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://eliteforums.in/#organization",
                  name: "Elite Forums",
                  url: "https://eliteforums.in/",
                  logo: "https://eliteforums.in/favicon.png",
                  description:
                    "A community for aspiring founders, students, colleges, E-Cells and mentors across India.",
                  areaServed: "IN",
                  knowsAbout: [
                    "Student entrepreneurship",
                    "Startup incubation",
                    "College entrepreneurship cells",
                    "Founder education",
                  ],
                },
                {
                  "@type": "WebSite",
                  "@id": "https://eliteforums.in/#website",
                  name: "Elite Forums",
                  url: "https://eliteforums.in/",
                  publisher: { "@id": "https://eliteforums.in/#organization" },
                  inLanguage: "en-IN",
                },
              ],
            }),
          }}
        />
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const overrides = Route.useLoaderData();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const isAdminRoute = pathname === "/admin";

  return (
    <QueryClientProvider client={queryClient}>
      <SiteContentProvider overrides={overrides}>
        <a
          href="#main-content"
          className="sr-only fixed left-4 top-4 z-[100] rounded-md bg-electric px-4 py-2 text-sm font-semibold text-ink focus:not-sr-only"
        >
          Skip to main content
        </a>
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        {!isAdminRoute && <Header />}
        <main id="main-content" tabIndex={-1}>
          <Outlet />
        </main>
        {!isAdminRoute && <Footer />}
        {!isAdminRoute && <Toaster />}
        {!isAdminRoute && <CookieConsent />}
        {!isAdminRoute && <Analytics />}
      </SiteContentProvider>
    </QueryClientProvider>
  );
}
