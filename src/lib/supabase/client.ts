import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "@/lib/env";

import type { Database } from "./database.types";

export type TypedSupabaseClient = SupabaseClient<Database>;

let client: TypedSupabaseClient | null = null;

/**
 * Server-side Supabase client using the public anon/publishable key.
 * The site never signs users in, so sessions are disabled. Row Level Security
 * limits this key to published content reads and contact form inserts.
 * Returns null when Supabase is not configured.
 */
export function getSupabase(): TypedSupabaseClient | null {
  if (!isSupabaseConfigured || !supabaseUrl || !supabaseAnonKey) return null;
  if (!client) {
    client = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
      global: {
        headers: { "x-application-name": "rococo-website" },
      },
    });
  }
  return client;
}
