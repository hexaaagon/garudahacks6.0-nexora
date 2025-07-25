ALTER TABLE "teachers" DROP CONSTRAINT "teachers_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "students" DROP CONSTRAINT "students_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_id_user_id_fk" FOREIGN KEY ("id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_id_user_id_fk" FOREIGN KEY ("id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;