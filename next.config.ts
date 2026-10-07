import type { NextConfig } from "next";

/**
 * Supabase Storage serves public images from
 * https://<project>.supabase.co/storage/v1/object/public/<bucket>/<path>.
 * Allow that host for next/image when the project URL is configured.
 */
function supabaseImagePatterns(): NonNullable<NonNullable<NextConfig["images"]>["remotePatterns"]> {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!raw) return [];
  try {
    const { hostname, protocol } = new URL(raw);
    return [
      {
        protocol: protocol.replace(":", "") as "http" | "https",
        hostname,
        pathname: "/storage/v1/object/public/**",
      },
    ];
  } catch {
    return [];
  }
}

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  // Next.js 16 rendering model: pages prerender to static HTML and content
  // functions opt into caching with 'use cache' (see src/lib/content.ts).
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  // Open Graph image routes read fonts and logos from disk at runtime.
  outputFileTracingIncludes: {
    "/**/opengraph-image*": ["./src/assets/og/**/*", "./public/brand/*.png"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 90],
    remotePatterns: supabaseImagePatterns(),
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
