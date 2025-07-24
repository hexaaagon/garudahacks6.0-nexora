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
