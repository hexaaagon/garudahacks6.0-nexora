CREATE TABLE "interests" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(15) NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "student_interests" (
	"id" text PRIMARY KEY NOT NULL,
	"student_id" text NOT NULL,
	"interest_id" text NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "personality_assessments" (
	"id" text PRIMARY KEY NOT NULL,
	"student_id" text NOT NULL,
	"personality_type" text NOT NULL,
	"strength_description" text NOT NULL,
	"learning_style" text NOT NULL,
	"math_score" integer DEFAULT 0 NOT NULL,
	"logical_score" integer DEFAULT 0 NOT NULL,
	"creativity_score" integer DEFAULT 0 NOT NULL,
	"comprehension_score" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "classrooms" ADD COLUMN "grade" varchar(20) NOT NULL;--> statement-breakpoint
ALTER TABLE "classrooms" ADD COLUMN "subjects" text[] NOT NULL;--> statement-breakpoint
ALTER TABLE "classrooms" ADD COLUMN "share_code" varchar(20) NOT NULL;--> statement-breakpoint
ALTER TABLE "classrooms" ADD COLUMN "admin_ids" text[] DEFAULT '{}'::text[];--> statement-breakpoint
ALTER TABLE "classrooms" ADD COLUMN "created_at" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "classrooms" ADD COLUMN "updated_at" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "student_interests" ADD CONSTRAINT "student_interests_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_interests" ADD CONSTRAINT "student_interests_interest_id_interests_id_fk" FOREIGN KEY ("interest_id") REFERENCES "public"."interests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personality_assessments" ADD CONSTRAINT "personality_assessments_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classrooms" ADD CONSTRAINT "classrooms_share_code_unique" UNIQUE("share_code");