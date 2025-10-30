import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/database";
import { getEnv } from "../env";

export function supabaseServer() {
  const { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY } = getEnv();

  return createClient<Database>(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        "X-Client-Info": "scruffy-butts-21/server",
      },
    },
  });
}
