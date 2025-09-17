import {
    pgTable,
    pgEnum,
    uuid,
    varchar,
    text,
    integer,
    boolean,
    timestamp,
} from "drizzle-orm/pg-core";
import { Teachers } from "./teacher";
import { Classes } from "./class";
import { StatusEnum } from "./status";

// Enums
export const QuestionTypeEnum = pgEnum("question_type", [
    "multiple_choice",
    "true_false",
    "open_ended",
]);
export const QuizStatusEnum = pgEnum("quiz_status", ["draft", "published", "closed", "deleted"]);

export const Quizzes = pgTable("quizzes", {
    quizId: uuid("quiz_id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    classId: uuid("class_id")
        .references(() => Classes.id, { onDelete: "cascade" })
        .notNull(),
    teacherId: uuid("teacher_id")
        .references(() => Teachers.id, { onDelete: "cascade" })
        .notNull(), // References Teacher.teacherId (UUID)
    status: QuizStatusEnum("status").default("draft").notNull(),
    startTime: timestamp("start_time").notNull(),
    endTime: timestamp("end_time").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const QuizzQuestions = pgTable("quizz_questions", {
    id: uuid("id").defaultRandom().primaryKey(),
    content: text("content").notNull(),
    quizzId: uuid("quiz_id")
        .references(() => Quizzes.quizId, { onDelete: "cascade" })
        .notNull(),
    type: QuestionTypeEnum("type").notNull(),
    status: StatusEnum('status').default('active').notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
