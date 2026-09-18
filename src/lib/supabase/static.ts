import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

/**
 * Cookie-free client for build-time work such as generateStaticParams.
 * Public RLS policies still apply because this uses the publishable key.
 */
export function createStaticClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    },
  );
}
