import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { drizzle as drizzleDatabase } from "@nexora/database";

export const auth = betterAuth({
  database: drizzleAdapter(drizzleAdapter, {
    provider: "pg",
    // schema,
  }),
  session: {
    cookieName: "better-auth.session_token",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 24 hours
  },
});
