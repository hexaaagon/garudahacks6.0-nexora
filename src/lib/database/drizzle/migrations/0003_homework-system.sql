CREATE TABLE "homework" (
  "id" text PRIMARY KEY,
  "classroom_id" text NOT NULL REFERENCES "classrooms"("id"),
  "teacher_id" text NOT NULL REFERENCES "teachers"("id"),
  "title" text NOT NULL,
  "description" text,
  "subject" text NOT NULL,
  "difficulty" text NOT NULL,
  "questions" json NOT NULL,
  "due_date" timestamp,
  "is_active" boolean DEFAULT true,
  "created_at" timestamp NOT NULL,
  "updated_at" timestamp NOT NULL
);

CREATE TABLE "homework_submissions" (
  "id" text PRIMARY KEY,
  "homework_id" text NOT NULL REFERENCES "homework"("id"),
  "student_id" text NOT NULL,
  "answers" json NOT NULL,
  "score" integer NOT NULL,
  "total_questions" integer NOT NULL,
  "time_spent_minutes" integer,
  "submitted_at" timestamp NOT NULL
);

-- Add indexes for better query performance
CREATE INDEX "homework_classroom_id_idx" ON "homework"("classroom_id");
CREATE INDEX "homework_teacher_id_idx" ON "homework"("teacher_id");
CREATE INDEX "homework_submissions_homework_id_idx" ON "homework_submissions"("homework_id");
CREATE INDEX "homework_submissions_student_id_idx" ON "homework_submissions"("student_id");
