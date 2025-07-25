import {
  text,
  timestamp,
  boolean,
  integer,
  varchar,
  pgTable,
  pgPolicy,
  json,
  jsonb,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

import { teacher } from "./teacher";

import { nanoid } from "@/lib/utils";

export const classroom = pgTable("classrooms", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  grade: varchar("grade", { length: 20 }).notNull(), // e.g., "Grade 10", "Grade 11"
  subjects: text("subjects").array().notNull(), // Array of subjects like ["Math", "Science"]
  shareCode: varchar("share_code", { length: 20 })
    .unique()
    .notNull()
    .$defaultFn(() => nanoid(10)),
  adminIds: text("admin_ids")
    .array()
    .default(sql`'{}'::text[]`), // Additional admins (max 5)

  teacherId: text("teacher_id")
    .notNull()
    .references(() => teacher.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const classroomSubject = pgTable("classroom_subjects", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  classroomId: text("classroom_id")
    .notNull()
    .references(() => classroom.id, { onDelete: "cascade" }),

  subjectMatter: text("subject_matter").notNull(),
  question: jsonb("question").notNull().$type<
    Array<
      | {
          id: string;
          type: "essay";

          questionText: string;
          promptAnswer: string;
        }
      | {
          id: string;
          type: "multiple_choices";

          questionText: string;
          choices: string[];
          answer: number;
        }
    >
  >(),

  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  deadlineAt: timestamp("deadline_at"),
});
