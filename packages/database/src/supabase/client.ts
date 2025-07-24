import { Supabase } from "@nexora/types";
import { createBrowserClient } from "@supabase/ssr";

export const createClient = async () => {
  const supabase = createBrowserClient<Supabase.Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

  return supabase;
};