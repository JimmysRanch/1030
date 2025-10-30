export type Env = {
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
};

let cached: Env | null = null;

function validateUrl(value: string | undefined) {
  if (!value) {
    return "NEXT_PUBLIC_SUPABASE_URL is required";
  }
  try {
    // eslint-disable-next-line no-new
    new URL(value);
  } catch {
    return "NEXT_PUBLIC_SUPABASE_URL must be a valid URL";
  }
  return null;
}

function validateKey(value: string | undefined) {
  if (!value) {
    return "NEXT_PUBLIC_SUPABASE_ANON_KEY is required";
  }
  if (value.trim().length === 0) {
    return "NEXT_PUBLIC_SUPABASE_ANON_KEY cannot be blank";
  }
  return null;
}

export function getEnv(): Env {
  if (cached) {
    return cached;
  }

  const { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY } = process.env;

  const issues = [validateUrl(NEXT_PUBLIC_SUPABASE_URL), validateKey(NEXT_PUBLIC_SUPABASE_ANON_KEY)]
    .filter((message): message is string => Boolean(message));

  if (issues.length > 0) {
    const formatted = issues.map(item => `- ${item}`).join("\n");
    throw new Error(`Missing/invalid environment variables:\n${formatted}\nPopulate .env using .env.example`);
  }

  cached = {
    NEXT_PUBLIC_SUPABASE_URL: NEXT_PUBLIC_SUPABASE_URL!,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  };

  return cached;
}
