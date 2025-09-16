import { relations } from 'drizzle-orm';
import { Students } from './students';
import { Enrollments } from './enrollment';
import { Classes } from './class';
import { Schools } from './schools';
import { Guardians } from './guardians';
import { Users } from './user';
import { Teachers } from './teacher';
import { ClassTeacherAssignments } from './class-teacher-assignment';
import { Quizzes, QuizzQuestions } from './quizzes';

export { Schools } from './schools';
export { Students } from './students';
export { Guardians } from './guardians';
export { StatusEnum } from './status';
export { GenderEnum } from './gender';
export { Users } from './user'
export { Classes } from './class';
export { Enrollments } from './enrollment';
export { Teachers } from './teacher';
export { ClassTeacherAssignments } from './class-teacher-assignment';
export { Quizzes, QuizStatusEnum, QuestionTypeEnum, QuizzQuestions } from './quizzes';

export const studentsRelations = relations(Students, ({ many }) => ({
  enrollments: many(Enrollments),
}));
export const classesRelations = relations(Classes, ({ one, many }) => ({
  school: one(Schools, {
    fields: [Classes.schoolId],
    references: [Schools.id],
  }),
  enrollments: many(Enrollments)
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

export const StudentsRelations = relations(Students, ({ many }) => ({
  guardians: many(Guardians),
}));

export const GuardiansRelations = relations(Guardians, ({ one }) => ({
  student: one(Students, {
    fields: [Guardians.studentId],
    references: [Students.id],
  }),
}));

export const teacherUserRelations = relations(Teachers, ({ one }) => ({
    user: one(Users, {
        fields: [Teachers.userId],
        references: [Users.id],
    }),
})); 

export const teacherClassAssignmentsRelations = relations(Teachers, ({ many }) => ({
    classTeacherAssignments: many(ClassTeacherAssignments),
}));

export const quizzQuestionRelations = relations(Quizzes, ({ many }) => ({
    question: many(QuizzQuestions)
}))

export const classQuizRelations = relations(Classes, ({ many }) => ({
    quizzes: many(Quizzes)
}))

export const teacherQuizRelations = relations(Teachers, ({ many }) => ({
    quizzes: many(Quizzes)
}))