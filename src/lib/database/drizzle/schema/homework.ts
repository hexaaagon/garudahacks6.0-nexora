import {
  text,
  timestamp,
  boolean,
  integer,
  pgTable,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { nanoid } from "@/lib/utils";
import { classroom } from "./classroom";
import { teacher } from "./teacher";
import { student } from "./student";

export const homework = pgTable(
  "homework",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),

    classroomId: text("classroom_id")
      .notNull()
      .references(() => classroom.id, { onDelete: "cascade" }),

    teacherId: text("teacher_id")
      .notNull()
      .references(() => teacher.id, { onDelete: "cascade" }),

    title: text("title").notNull(),
    description: text("description"),
    subject: text("subject").notNull(),
    difficulty: text("difficulty").notNull(),

    questions: jsonb("questions").notNull().$type<
      Array<{
        id: string;
        type: "essay" | "multiple_choices";
        questionText: string;
        choices?: string[];
        answer?: number;
        promptAnswer?: string;
      }>
    >(),

    dueDate: timestamp("due_date"),
    isActive: boolean("is_active").default(true).notNull(),

    createdAt: timestamp("created_at")
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: timestamp("updated_at")
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (table) => ({
    classroomIdIdx: index("homework_classroom_id_idx").on(table.classroomId),
    teacherIdIdx: index("homework_teacher_id_idx").on(table.teacherId),
  })
);

export const homeworkSubmission = pgTable(
  "homework_submissions",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),

    homeworkId: text("homework_id")
      .notNull()
      .references(() => homework.id, { onDelete: "cascade" }),

    studentId: text("student_id")
      .notNull()
      .references(() => student.id, { onDelete: "cascade" }),

    answers: jsonb("answers")
      .notNull()
      .$type<Record<string, string | number>>(),
    score: integer("score").notNull(),
    totalQuestions: integer("total_questions").notNull(),
    timeSpentMinutes: integer("time_spent_minutes"),

    submittedAt: timestamp("submitted_at")
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (table) => ({
    homeworkIdIdx: index("homework_submissions_homework_id_idx").on(
      table.homeworkId
    ),
    studentIdIdx: index("homework_submissions_student_id_idx").on(
      table.studentId
    ),
  })
);
