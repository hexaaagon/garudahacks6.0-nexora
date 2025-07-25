import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as account from "./schema/account";
import * as auth from "./schema/auth";
import * as classroom from "./schema/classroom";
import * as student from "./schema/student";
import * as teacher from "./schema/teacher";
import * as interests from "./schema/interests";
import * as personality from "./schema/personality";
import * as homework from "./schema/homework";

export const client = postgres(process.env.POSTGRES_URL!, { prepare: false });
export const db = drizzle(client, {
  schema: {
    ...account,
    ...auth,
    ...classroom,
    ...student,
    ...teacher,
    ...interests,
    ...personality,
    ...homework,
  },
});
