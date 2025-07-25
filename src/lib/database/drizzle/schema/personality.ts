import { text, timestamp, integer, pgTable } from "drizzle-orm/pg-core";
import { nanoid } from "@/lib/utils";
import { student } from "./student";

export const personalityAssessment = pgTable("personality_assessments", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  studentId: text("student_id")
    .notNull()
    .references(() => student.id, { onDelete: "cascade" }),

  // AI-generated insights
  personalityType: text("personality_type").notNull(), // e.g., "Mathematical Thinker", "Logical Analyzer"
  strengthDescription: text("strength_description").notNull(), // Detailed description of strengths
  learningStyle: text("learning_style").notNull(), // How they learn best

  // Performance metrics
  mathScore: integer("math_score").default(0).notNull(),
  logicalScore: integer("logical_score").default(0).notNull(),
  creativityScore: integer("creativity_score").default(0).notNull(),
  comprehensionScore: integer("comprehension_score").default(0).notNull(),

  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});
