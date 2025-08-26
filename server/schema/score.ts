import { integer, pgTable, primaryKey, timestamp, uuid } from "drizzle-orm/pg-core";
import { Students } from "./students";
import { Assignments } from "./assignment";

export const Scores = pgTable(
    "scores",
    {
        studentId: uuid("student_id")
            .references(() => Students.id)
            .notNull(),
        assignmentId: uuid("assignment_id")
            .references(() => Assignments.id)
            .notNull(),
        score: integer("score").notNull(),
        createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
        updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
    },
    (t) => ({
        pk: primaryKey(t.studentId, t.assignmentId),
    })
);
