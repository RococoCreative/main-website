import type { Metadata, Viewport } from "next";

// Global base styles load first so component CSS Modules can override them.
import "./globals.css";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { JsonLd, organizationJsonLd } from "@/lib/seo";
import { brandFontsUrl, isIndexable, siteUrl } from "@/lib/env";
import { site } from "@/lib/site";

import { fontVariables } from "./fonts";

/**
 * Guardrail: every route must prerender to static HTML (content refreshes via
 * 'use cache' lifetimes and the /api/revalidate webhook). The build fails if a
 * page introduces request-time rendering.
 */
export const ensureStatic = "navigation";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.name} | Marketing for construction companies`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
    title: `${site.name} | Marketing for construction companies`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
  },
  robots: isIndexable ? { index: true, follow: true } : { index: false, follow: false },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#fdfdfd",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={fontVariables} data-scroll-behavior="smooth">
      <head>
        {/* Optional licensed Goldenbook + Halcom faces. See README > Brand fonts. */}
        {brandFontsUrl ? <link rel="stylesheet" href={brandFontsUrl} /> : null}
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
        <JsonLd data={organizationJsonLd()} />
      </body>
    </html>
  );
}
