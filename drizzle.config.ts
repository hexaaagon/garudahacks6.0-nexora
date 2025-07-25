import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/lib/database/drizzle/schema/*",
  out: "./src/lib/database/drizzle/migrations",
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
});
