import { and, count, eq } from "drizzle-orm";
import { get } from "lodash";
import { Schools, Students } from "~/server/schema";
import { db } from "~/server/utils/db";

export default defineEventHandler(async (event) => {
    const user = event.context.user;
    console.log("[Students API] context user:", user);
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
    response.school = await getSchoolDetails(schoolId);
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

const getSchoolDetails = async (schoolId: string) => {
    return await db
        .select({
            id: Schools.id,
            name: Schools.name,
            shortName: Schools.shortName,
        }).from(Schools)
        .where(eq(Schools.id, schoolId))
        .limit(1)
        .then((result) => get(result, "[0]", {}));
}
