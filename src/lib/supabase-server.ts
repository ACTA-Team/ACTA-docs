import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/**
 * Lazily creates the server-side Supabase client on first use.
 *
 * Reading the env vars at request time (instead of module scope) keeps
 * `next build` from requiring runtime secrets: CI can build the site
 * without Supabase credentials, and misconfiguration surfaces as a
 * clear runtime error on the routes that actually need the client.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (client) return client;

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseAnonKey = process.env.SUPABASE_PUBLISHABLE_DEFAULT_KEY;

  if (!supabaseUrl) {
    throw new Error("SUPABASE_URL is not set in environment variables");
  }

  // Prefer the service role key when available (e.g. in production),
  // but fall back to the public anon key so the app can run locally
  // without requiring the highly privileged service key.
  const supabaseKey = supabaseServiceKey ?? supabaseAnonKey;

  if (!supabaseKey) {
    throw new Error(
      "Neither SUPABASE_SERVICE_ROLE_KEY nor SUPABASE_PUBLISHABLE_DEFAULT_KEY is set in environment variables"
    );
  }

  client = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    },
  });
  return client;
}
