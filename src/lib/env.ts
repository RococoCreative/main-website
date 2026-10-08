/**
 * Environment access in one place. Every value is optional so the site builds
 * and runs before Supabase or email are configured (fallback content is used).
 * See .env.local.example for descriptions.
 */

function clean(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export const supabaseUrl = clean(process.env.NEXT_PUBLIC_SUPABASE_URL);

/** Accepts the legacy anon key or the newer publishable key. */
export const supabaseAnonKey =
  clean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) ??
  clean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/**
 * Canonical origin for metadata, sitemap, and Open Graph URLs.
 * Order: explicit NEXT_PUBLIC_SITE_URL, Vercel production domain, Vercel
 * deployment URL (previews), then localhost.
 */
export const siteUrl: string = (() => {
  const explicit = clean(process.env.NEXT_PUBLIC_SITE_URL);
  if (explicit) return explicit.replace(/\/+$/, "");
  const vercelProd = clean(process.env.VERCEL_PROJECT_PRODUCTION_URL);
  if (process.env.VERCEL_ENV === "production" && vercelProd) return `https://${vercelProd}`;
  const vercelUrl = clean(process.env.VERCEL_URL);
  if (vercelUrl) return `https://${vercelUrl}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
})();

/** Search engines should index production only. Preview deployments stay out. */
export const isIndexable =
  process.env.VERCEL_ENV === undefined
    ? process.env.NODE_ENV === "production"
    : process.env.VERCEL_ENV === "production";
