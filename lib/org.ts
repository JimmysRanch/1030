import { supabaseServer } from "./supabase/server";

export async function currentOrgId(): Promise<string | null> {
  const supabase = supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("org_id")
    .eq("user_id", user.id)
    .maybeSingle<{ org_id: string }>();

  if (error || !data) return null;
  return data.org_id;
}
