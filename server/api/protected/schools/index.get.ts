import { db } from '~/server/utils/db';
import { Schools } from '~/server/schema/schools';
import { and, eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
    const user = event.context.user;
    const schools = await db.select()
        .from(Schools)
        .where(
            and(
                eq(Schools.id, user.schoolId),
                eq(Schools.status, 'active')
            )
        ).limit(1);

    if (schools.length === 0) {
        return forbidden("School not found or inactive");
    } else if (schools.length > 1) {
        return badRequest("Multiple schools found");
    }
    return ok({ school: schools[0] });
});
