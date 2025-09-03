import { db } from "~/server/utils/db";
import { and, eq } from "drizzle-orm";
import { Teachers } from "~/server/schema";

export default defineEventHandler(async (event) => {
    const user = event.context.user;
    const teachers = await db
        .select()
        .from(Teachers)
        .where(
            and(eq(Teachers.status, "active"), eq(Teachers.schoolId, user.schoolId))
        );

    return ok({
        teachers,
    });
});
