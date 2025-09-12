import {
    Classes,
    Enrollments,
    Students,
    ClassTeacherAssignments,
    Teachers,
} from "~/server/schema";
import { and, eq, desc } from "drizzle-orm";

export default defineEventHandler(async (event) => {
    const user = event.context.user;
    if (user === undefined) {
        throw badRequest("User is not authenticated");
    }

    const schoolId = user.schoolId;
    if (!schoolId) {
        throw badRequest("User does not belong to any school");
    }

    const classes = await db
        .select({
            classId: Classes.id,
            studentId: Students.id,
            class: Classes,
            teacher: Teachers,
            student: Students,
        })
        .from(Classes)
        .leftJoin(
            Enrollments,
            and(
                eq(Classes.id, Enrollments.classId),
                eq(Enrollments.status, "active")
            )
        )
        .leftJoin(Students, eq(Enrollments.studentId, Students.id))
        .leftJoin(
            ClassTeacherAssignments,
            and(
                eq(ClassTeacherAssignments.classId, Classes.id),
                eq(ClassTeacherAssignments.status, "active")
            )
        )
        .leftJoin(Teachers, eq(ClassTeacherAssignments.teacherId, Teachers.id))
        .where(eq(Classes.schoolId, schoolId))
        .orderBy(desc(Classes.createdAt));

    const formattedClasses: Record<string, any> = classes.reduce(
        (acc, curr) => {
            const classId = curr.classId;
            if (!acc[classId]) {
                acc[classId] = {
                    ...curr.class,
                    teacher: curr.teacher,
                    students: [],
                };
            }
            // Only push non-null students to the array
            if (curr.student) {
                acc[classId].students.push(curr.student);
            }
            return acc;
        },
        {} as Record<string, any>
    );

    return ok({
        classes: Object.values(formattedClasses),
        formattedClasses,
    });
});
