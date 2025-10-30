import { supabaseServer } from "@/lib/supabase/server";

type ProfileOrgRow = { org_id: string | null };

export async function getCurrentOrgId(): Promise<string | null> {
  const supabase = supabaseServer();

  // Typed select + maybeSingle prevents data from being inferred as never.
  const { data, error } = await supabase
    .from("profiles")
    .select("org_id")
    .maybeSingle<ProfileOrgRow>();

  if (error || !data) return null;
  return data.org_id;
}
