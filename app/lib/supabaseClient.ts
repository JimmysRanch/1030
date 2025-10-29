// lib/supabaseClient.ts
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cachedClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (cachedClient) {
    return cachedClient;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "Supabase environment variables are not defined. Pages depending on Supabase data will render empty states."
      );
    }
    return null;
  }

  cachedClient = createClient(url, anonKey, {
    auth: { persistSession: true, autoRefreshToken: true },
  });

  return cachedClient;
}
