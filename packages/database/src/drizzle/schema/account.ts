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

export const userDetails = pgTable("user_details", {
  id: text("id")
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),

  role: text("role", { enum: ["teacher", "student"] }).notNull(),
});
