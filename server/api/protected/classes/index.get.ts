import {
    Classes,
    Enrollments,
    Students,
    ClassAssignments,
    Teachers,
} from "~/server/schema";
import { and, eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
    const user = event.context.user;
    if (user === undefined) {
        throw badRequest("User is not authenticated");
    }

    const schoolId = user.schoolId;
    if (!schoolId) {
        throw badRequest("User does not belong to any school");
    }

    // Fetch classes with student base on enrollment table
    console.log("[Classes API] Fetching classes for school:", schoolId);

    const classes = await db
        .select({
            classId: Classes.id,
            studentId: Students.id,
            class: Classes,
            teacher: Teachers,
            student: Students,
        })
        .from(Classes)
        .leftJoin(Enrollments, eq(Classes.id, Enrollments.classId))
        .leftJoin(Students, eq(Enrollments.studentId, Students.id))
        .leftJoin(ClassAssignments, eq(ClassAssignments.classId, Classes.id))
        .leftJoin(Teachers, eq(ClassAssignments.teacherId, Teachers.id))
        .where(eq(Classes.schoolId, schoolId))
        .orderBy(Classes.name);

    const formattedClasses: Record<string, any> = classes.reduce(
        (acc, curr) => {
            const classId = curr.classId;
            console.log(acc);
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
