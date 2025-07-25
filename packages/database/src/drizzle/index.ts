import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as account from "./schema/account";
import * as auth from "./schema/auth";
import * as classroom from "./schema/classroom";
import * as student from "./schema/student";
import * as teacher from "./schema/teacher";

export const client = postgres(process.env.POSTGRES_URL!, { prepare: false });
export const db = drizzle(client);
