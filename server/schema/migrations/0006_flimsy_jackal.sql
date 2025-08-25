ALTER TYPE "public"."status" ADD VALUE 'deleted';--> statement-breakpoint
ALTER TABLE "classes" ADD COLUMN "status" "status" DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE "enrollments" ADD COLUMN "status" "status" DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE "guardians" ADD COLUMN "status" "status" DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE "classes" DROP COLUMN "start_date";--> statement-breakpoint
ALTER TABLE "classes" DROP COLUMN "end_date";