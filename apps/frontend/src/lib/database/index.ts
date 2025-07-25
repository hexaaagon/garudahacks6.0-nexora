// Re-export only client-safe exports from database package
// Avoid exporting server-side utilities that require environment variables

export { createClient } from "@nexora/database/supabase/client";
// Export other client-safe utilities as needed
