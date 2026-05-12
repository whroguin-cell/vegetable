import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !anonKey) {
  // Don't throw at module load — that breaks Next.js static page generation
  // in production builds where env vars haven't been configured yet. All
  // actual Supabase calls will fail with a clear error; surface one warning
  // so the misconfiguration is visible in the build log and browser console.
  const message =
    "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) " +
    "in your hosting provider (Vercel → Project → Settings → Environment Variables) " +
    "and in .env.local for local dev.";
  if (typeof window !== "undefined") {
    console.warn(message);
  } else {
    // eslint-disable-next-line no-console
    console.warn(`[supabase] ${message}`);
  }
}

// Fall back to stub values when unset. Queries will fail at runtime (with a
// normal network error) rather than blocking the build.
export const supabase = createClient<Database>(
  url ?? "https://placeholder.supabase.co",
  anonKey ?? "placeholder-anon-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

export const isSupabaseConfigured = Boolean(url && anonKey);
