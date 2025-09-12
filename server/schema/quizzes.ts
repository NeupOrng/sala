import { pgTable, pgEnum, uuid, varchar, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';
import { Teachers } from './teacher';

// Enums
export const questionTypeEnum = pgEnum('question_type', ['multiple_choice', 'true_false', 'open_ended']);
export const quizStatusEnum = pgEnum('quiz_status', ['draft', 'published']);

export const Quizzes = pgTable('quizzes', {
  quizId: uuid('quiz_id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  teacherId: uuid('creator_id').references(() => Teachers.id, { onDelete: "cascade" }).notNull(), // References Teacher.teacherId (UUID)
  status: quizStatusEnum('status').default('draft').notNull(),
  timeLimit: integer('time_limit'), // Time limit in seconds (optional)
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
