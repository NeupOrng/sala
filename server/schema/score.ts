import { integer, pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
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
    },
    (t) => ({
        pk: primaryKey(t.studentId, t.assignmentId),
    })
);
