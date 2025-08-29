import { pgTable, primaryKey, timestamp, uuid } from "drizzle-orm/pg-core";
import { Students } from "./students";
import { Classes } from "./class";
import { StatusEnum } from "./status";

export const Enrollments = pgTable(
    "enrollments",
    {
        studentId: uuid("student_id")
            .references(() => Students.id)
            .notNull(),
        classId: uuid("class_id")
            .references(() => Classes.id)
            .notNull(),
        status: StatusEnum("status").notNull().default("active"),
        createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
        updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
    },
    (t) => ({
        pk: primaryKey(t.studentId, t.classId),
    })
);
