import { relations } from 'drizzle-orm';
import { Students } from './students';
import { Enrollments } from './enrollment';
import { Scores } from './score';
import { Classes } from './class';
import { Schools } from './schools';
import { Assignments } from './assignment';

export { Schools } from './schools';
export { Students } from './students';
export { StatusEnum } from './status';
export { GenderEnum } from './gender';
export { Users } from './user'
export { Classes } from './class';
export { Enrollments } from './enrollment';
export { Assignments } from './assignment';
export { Scores } from './score';

export const studentsRelations = relations(Students, ({ many }) => ({
  enrollments: many(Enrollments),
  scores: many(Scores),
}));
export const classesRelations = relations(Classes, ({ one, many }) => ({
  school: one(Schools, {
    fields: [Classes.schoolId],
    references: [Schools.id],
  }),
  enrollments: many(Enrollments),
  assignments: many(Assignments),
}));

export const enrollmentsRelations = relations(Enrollments, ({ one }) => ({
  student: one(Students, {
    fields: [Enrollments.studentId],
    references: [Students.id],
  }),
  class: one(Classes, {
    fields: [Enrollments.classId],
    references: [Classes.id],
  }),
}));

export const assignmentsRelations = relations(Assignments, ({ one, many }) => ({
  class: one(Classes, {
    fields: [Assignments.classId],
    references: [Classes.id],
  }),
  scores: many(Scores),
}));

export const scoresRelations = relations(Scores, ({ one }) => ({
  student: one(Students, {
    fields: [Scores.studentId],
    references: [Students.id],
  }),
  assignment: one(Assignments, {
    fields: [Scores.assignmentId],
    references: [Assignments.id],
  }),
}));