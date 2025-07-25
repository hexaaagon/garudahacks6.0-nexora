// Drizzle exports (mostly server-side)
export * as drizzle from "./drizzle";

// Supabase client exports (safe for client-side)
export { createClient } from "./supabase/client";

// Supabase server exports (server-side only)
export { getAuth } from "./supabase/server";
export {
  createServiceServer,
  supabaseService,
} from "./supabase/service-server";
export { createMiddlewareClient } from "./supabase/middleware";
