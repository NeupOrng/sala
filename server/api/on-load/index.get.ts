import { and, count, eq } from "drizzle-orm";
import { Students } from "~/server/schema";
import { db } from "~/server/utils/db";

export default defineEventHandler(async (event) => {
    const schoolId = getHeader(event, "school_id") ?? "";
    const response = {} as any;
    response["genderCount"] = await getStudentCountGroupByGender(schoolId);
    return response;
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
