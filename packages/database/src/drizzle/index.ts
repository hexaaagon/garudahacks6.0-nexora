import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// import * as auth from "./schema/auth";

export const client = postgres(process.env.POSTGRES_URL, { prepare: false });
export const db = drizzle(client);
