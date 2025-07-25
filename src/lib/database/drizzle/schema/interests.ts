import {
  text,
  timestamp,
  varchar,
  pgTable,
  boolean,
} from "drizzle-orm/pg-core";
import { nanoid } from "@/lib/utils";
import { student } from "./student";

export const interest = pgTable("interests", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: varchar("name", { length: 15 }).notNull(),
  isDefault: boolean("is_default").default(false).notNull(),

  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const studentInterest = pgTable("student_interests", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  studentId: text("student_id")
    .notNull()
    .references(() => student.id, { onDelete: "cascade" }),
  interestId: text("interest_id")
    .notNull()
    .references(() => interest.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
});
