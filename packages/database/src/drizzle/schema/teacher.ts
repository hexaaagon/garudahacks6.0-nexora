import {
  text,
  timestamp,
  boolean,
  integer,
  varchar,
  pgTable,
  pgPolicy,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

import { user } from "./auth";

export const teacher = pgTable("teachers", {
  id: text("id")
    .primaryKey()
    .references(() => user.id),

  classroomIds: text("classroom_ids")
    .array()
    .default(sql`'{}'::text[]`),

  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});
