import { db } from "~/server/utils/db";
import { and, eq } from "drizzle-orm";
import { badRequest } from "~/server/utils/response/error-helpers";
import { ok } from "~/server/utils/response/success-helper";
import { Schools, Guardians, Students } from "~/server/schema";

export default defineEventHandler(async (event) => {
    const schoolId = event.context.user?.schoolId;
    if (!schoolId) {
        throw badRequest("Missing school_id header");
    }

    const students = await db
        .select({
            id: Students.id,
            firstName: Students.firstName,
            middleName: Students.middleName,
            lastName: Students.lastName,
            studentIdNumber: Students.studentIdNumber,
            status: Students.status,
            email: Students.email,
            nationality: Students.nationality,
            gender: Students.gender,
            dateOfBirth: Students.dateOfBirth,
            phoneNumber: Students.phoneNumber,
            academicYear: Students.academicYear,
            photoUrl: Students.photoUrl,
            guardians: {
                id: Guardians.id,
                firstaName: Guardians.firstName,
                middleName: Guardians.middleName,
                lastName: Guardians.lastName,
                phone: Guardians.phone,
                email: Guardians.email,
                relationship: Guardians.relationship,
            },
            school: {
                id: Schools.id,
                name: Schools.name, 
            }
        })
        .from(Students)
        .leftJoin(Schools, eq(Students.schoolId, Schools.id))
        .leftJoin(Guardians, eq(Guardians.studentId, Students.id))
        .where(
            and(eq(Students.status, "active"), eq(Students.schoolId, schoolId))
        );

    return ok({
        students: students
    });
});
