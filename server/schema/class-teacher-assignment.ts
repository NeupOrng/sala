import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { Classes } from "./class";
import { Teachers } from "./teacher";
import { StatusEnum } from "./status";

export const ClassTeacherAssignments = pgTable("class_teacher_assignments", {
    id: uuid("id").primaryKey().defaultRandom(),
    teacherId: uuid("teacher_id").references(() => Teachers.id).notNull(),
    classId: uuid("class_id").references(() => Classes.id).notNull(),
    status: StatusEnum('status').notNull().default("active").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});