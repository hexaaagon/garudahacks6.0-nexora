CREATE TABLE "homework" (
	"id" text PRIMARY KEY NOT NULL,
	"classroom_id" text NOT NULL,
	"teacher_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"subject" text NOT NULL,
	"difficulty" text NOT NULL,
	"questions" jsonb NOT NULL,
	"due_date" timestamp,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "homework_submissions" (
	"id" text PRIMARY KEY NOT NULL,
	"homework_id" text NOT NULL,
	"student_id" text NOT NULL,
	"answers" jsonb NOT NULL,
	"score" integer NOT NULL,
	"total_questions" integer NOT NULL,
	"time_spent_minutes" integer,
	"submitted_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "homework" ADD CONSTRAINT "homework_classroom_id_classrooms_id_fk" FOREIGN KEY ("classroom_id") REFERENCES "public"."classrooms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "homework" ADD CONSTRAINT "homework_teacher_id_teachers_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "homework_submissions" ADD CONSTRAINT "homework_submissions_homework_id_homework_id_fk" FOREIGN KEY ("homework_id") REFERENCES "public"."homework"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "homework_submissions" ADD CONSTRAINT "homework_submissions_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "homework_classroom_id_idx" ON "homework" USING btree ("classroom_id");--> statement-breakpoint
CREATE INDEX "homework_teacher_id_idx" ON "homework" USING btree ("teacher_id");--> statement-breakpoint
CREATE INDEX "homework_submissions_homework_id_idx" ON "homework_submissions" USING btree ("homework_id");--> statement-breakpoint
CREATE INDEX "homework_submissions_student_id_idx" ON "homework_submissions" USING btree ("student_id");