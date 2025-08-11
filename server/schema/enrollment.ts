import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { Students } from "./students";
import { Classes } from "./class";

export const Enrollments = pgTable("enrollments", {
  studentId: uuid("student_id").references(() => Students.id).notNull(),
  classId: uuid("class_id").references(() => Classes.id).notNull(),
}, (t) => ({
  pk: primaryKey(t.studentId, t.classId),
}));