import { password } from "bun";
import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const student = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    grade: integer().notNull().notNull(),
    classroom: varchar({ length: 255 }),
});

export const teacher = pgTable("teachers", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    password: varchar({length: 255}).notNull(),
    classrom: varchar({ length: 255 }),
});

export const question = pgTable("questions", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    question: varchar({ length: 255 }).notNull(),
    answer: varchar({ length: 255 }).notNull(),
    teacherId: integer().notNull(),
    studentId: integer().notNull(),
});
