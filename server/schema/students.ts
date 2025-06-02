import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  date,
  boolean,
  unique
} from "drizzle-orm/pg-core";
import { Schools } from "./schools";
import { StatusEnum } from "./status";
import { GenderEnum } from "./gender";

export const Students = pgTable("students", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").references(() => Schools.id),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  middleName: varchar("middle_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  status: StatusEnum('status').notNull().default("active"),
  gender: GenderEnum('gender').notNull(),
  studentIdNumber: varchar("student_id_number", { length: 24 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  nationality: varchar("nationality", { length: 56 }),
  dateOfBirth: date("date_of_birth").notNull(),
  email: varchar("email", { length: 255 }),
  phoneNumber: varchar("phone_number", { length: 20 }),
  guardianName: varchar("guardian_name", { length: 255 }),
  guardianPhone: varchar("guardian_phone", { length: 20 }),
  guardianEmail: varchar("guardian_email", { length: 255 }),
  relationshipToStudent: varchar("relationship_to_student", { length: 50 }),
  academicYear: varchar("academic_year", { length: 24 }),
  isDeleted: boolean("is_deleted").notNull().default(false),
}, (student) => ({
    uniqueStudentIdPerSchool: unique().on(student.schoolId, student.studentIdNumber),
}));
