ALTER TABLE "students" ALTER COLUMN "academic_year" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "classes" ADD COLUMN "teacher_id" uuid NOT NULL;