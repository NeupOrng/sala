import { db } from "~/server/utils/db";
import { Schools } from "~/server/schema/schools";
import { Students } from "~/server/schema/students";
import { eq } from "drizzle-orm";
import { CreateStudentRequest } from "~/server/dto/request/create-student";
import { readBody } from "h3";
import studentUtil from "~/server/utils/student";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const user = event.context.user;

    // 2. Map to DTO
    const request = new CreateStudentRequest(body);

    // Optional: Validate school exists
    const [school] = await db
        .select({
            id: Schools.id,
            name: Schools.name,
            shortName: Schools.shortName,
        })
        .from(Schools)
        .where(eq(Schools.id, user.schoolId))
        .limit(1);
    if (!school) {
        return badRequest("Invalid schoolId")
    }

    const newStudentId = await generatedStudentId(school.shortName ?? "SALA");

    const newStudentDto: typeof Students.$inferInsert = {
        schoolId: user.schoolId,
        firstName: request.firstName,
        middleName: request.middleName,
        lastName: request.lastName,
        gender: request.gender as "male" | "female" | "other",
        email: request.email,
        nationality: request.nationality,
        studentIdNumber: newStudentId,
        dateOfBirth:
            request.dateOfBirth instanceof Date
                ? request.dateOfBirth.toISOString()
                : request.dateOfBirth,
        phoneNumber: request.phoneNumber,
        academicYear: request.academicYear,
        status: "active",
        photoUrl: request.photoUrl,
    };
    const [newStudent] = await db
        .insert(Students)
        .values(newStudentDto)
        .returning();

    // 4. Return created student
    return created({
        student: newStudent,
    });
});

const generatedStudentId = async (schoolShortName: string) => {
    const newGeneratedStudentId = `${schoolShortName}${studentUtil().generateStudentId()}`;
    const student = await db
        .select()
        .from(Students)
        .where(eq(Students.studentIdNumber, newGeneratedStudentId));
    if (student.length > 0) {
        return generatedStudentId(schoolShortName); // Recursively generate a new ID if it already exists
    }
    return newGeneratedStudentId; // Return the unique student ID
};
