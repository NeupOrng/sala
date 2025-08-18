import { and, count, eq } from "drizzle-orm";
import { Students } from "~/server/schema";
import { db } from "~/server/utils/db";

export default defineEventHandler(async (event) => {
    const user = event.context.user;
    if(user === undefined) {
        // If user is authenticated, we can use their school ID
        const schoolId = user.schoolId;
        if (!schoolId) {
            throw badRequest("User does not belong to any school");
        }
    }

    const schoolId = user.schoolId;
    const response = {} as any;
    response.genderCount = await getStudentCountGroupByGender(schoolId);
    return ok(response);
});

const getStudentCountGroupByGender = async (schoolId: string) => {
    return await db
        .select({
            gender: Students.gender,
            count: count(),
        })
        .from(Students)
        .groupBy(Students.gender)
        .where(
            and(eq(Students.schoolId, schoolId), eq(Students.status, "active"))
        );
};
