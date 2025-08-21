import { Classes, Enrollments, Students } from "~/server/schema";
import { and, eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
    const user = event.context.user;
    console.log("[Classes API] context user:", user);
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
            class: Classes,
            enrollment: Enrollments,
            student: Students,
        })
        .from(Classes)
        .innerJoin(Enrollments, eq(Enrollments.classId, Classes.id))
        .where(eq(Classes.schoolId, schoolId))
        .innerJoin(Students, eq(Enrollments.studentId, Students.id))
        .orderBy(Classes.name);
    
    const formattedClasses = classes.reduce((acc, item) => {
        const classId = item.class.id;
        if (!acc[classId]) {
            acc[classId] = {
                ...item.class,
                students: [],
            };
        }
        acc[classId].students.push(item.student);
        return acc;
    }, {} as any);
    return ok(
        {
            classes: Object.values(formattedClasses)
        }
    );
});
