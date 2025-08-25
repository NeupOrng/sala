import { pgTable, uuid } from "drizzle-orm/pg-core";
import { Classes } from "./class";
import { Teachers } from "./teacher";

export const ClassAssignments = pgTable("class_assignments", {
    id: uuid("id").primaryKey().defaultRandom(),
    teacherId: uuid("teacher_id").references(() => Teachers.id).notNull(),
    classId: uuid("class_id").references(() => Classes.id).notNull()
});