import { createClient } from "@supabase/supabase-js";
import type { Database } from "@nexora/types/database/supabase.ts";
import { config } from "dotenv";
import { join } from "path";
import { fileURLToPath } from "url";

// Get the directory path of the current file
const __dirname = fileURLToPath(new URL(".", import.meta.url));

// Load environment variables from root .env file
// This will work regardless of where the code is being run from
config({ path: join(__dirname, "..", "..", "..", "..", ".env") });

/**
 * WARNING: DON'T USE THIS ON CLIENT COMPONENTS
 *
 * Creates a Supabase client with service role privileges that bypasses RLS.
 * This client should NEVER be used on the client side or exposed to users.
 */
export const createServiceServer = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable");
  }

  if (!supabaseServiceKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable");
  }

  return createClient<Database>(
    supabaseUrl,
    supabaseServiceKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      // Ensure we're always using the service role key in Authorization header
      global: {
        headers: {
          Authorization: `Bearer ${supabaseServiceKey}`,
        },
      },
    }
  );
};

/**
 * WARNING: DON'T USE THIS ON CLIENT COMPONENTS
 *
 * Creates a Supabase client with service role privileges that bypasses RLS.
 * This client should NEVER be used on the client side or exposed to users.
 */
export const supabaseService = createServiceServer();
