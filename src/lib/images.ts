import { supabaseUrl } from "@/lib/env";

/**
 * True when next/image can optimize this source: local paths, or public files
 * in this project's Supabase Storage (the only remote pattern in next.config.ts).
 * Anything else must render with `unoptimized`, or the optimizer rejects it.
 */
export function isOptimizable(src: string): boolean {
  if (src.startsWith("/") && !src.startsWith("//")) return true;
  if (!supabaseUrl) return false;
  try {
    const url = new URL(src);
    return url.hostname === new URL(supabaseUrl).hostname && url.pathname.startsWith("/storage/v1/object/public/");
  } catch {
    return false;
  }
}
