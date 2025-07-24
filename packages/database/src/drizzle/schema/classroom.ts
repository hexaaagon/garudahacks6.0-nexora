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

import { teacher } from "./teacher";

import { nanoid } from "../../utils";

export const classroom = pgTable("classrooms", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),

  teacherId: text("teacher_id")
    .notNull()
    .references(() => teacher.id, { onDelete: "cascade" }),
});
