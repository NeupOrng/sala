ALTER TABLE "assignments" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "scores" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "assignments" CASCADE;--> statement-breakpoint
DROP TABLE "scores" CASCADE;--> statement-breakpoint
ALTER TABLE "enrollments" DROP CONSTRAINT "enrollments_id_pk";