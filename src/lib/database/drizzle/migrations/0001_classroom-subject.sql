CREATE TABLE "classroom_subjects" (
	"id" text PRIMARY KEY NOT NULL,
	"classroom_id" text NOT NULL,
	"subject_matter" text NOT NULL,
	"question" jsonb NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"deadline_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "classroom_subjects" ADD CONSTRAINT "classroom_subjects_classroom_id_classrooms_id_fk" FOREIGN KEY ("classroom_id") REFERENCES "public"."classrooms"("id") ON DELETE cascade ON UPDATE no action;