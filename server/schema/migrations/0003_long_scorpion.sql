CREATE TYPE "public"."gender" AS ENUM('male', 'female', 'other');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"role" varchar(50) NOT NULL,
	"is_active" boolean DEFAULT true,
	"is_verified" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "students" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "students" ALTER COLUMN "status" SET DEFAULT 'active'::text;--> statement-breakpoint
DROP TYPE "public"."status";--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('active', 'suspended');--> statement-breakpoint
ALTER TABLE "students" ALTER COLUMN "status" SET DEFAULT 'active'::"public"."status";--> statement-breakpoint
ALTER TABLE "students" ALTER COLUMN "status" SET DATA TYPE "public"."status" USING "status"::"public"."status";--> statement-breakpoint
ALTER TABLE "schools" ADD COLUMN "short_name" varchar(5);--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "gender" "gender" NOT NULL;--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "date_of_birth" date NOT NULL;--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "email" varchar(255);--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "phone_number" varchar(20);--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "guardian_name" varchar(255);--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "guardian_phone" varchar(20);--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "guardian_email" varchar(255);--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "relationship_to_student" varchar(50);--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "academic_year" varchar(24);--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "is_deleted" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "photo_url" varchar(1024);--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_school_id_student_id_number_unique" UNIQUE("school_id","student_id_number");