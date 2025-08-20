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
    return {
      statusCode: 400,
      statusMessage: "Invalid schoolId",
    };
  }

  const newStudentId = await generatedStudentId();

  const [newStudent] = await db
    .insert(Students)
    .values({
    // @ts-ignore
      schoolId: request.schoolId,
      firstName: request.firstName,
      middleName: request.middleName,
      lastName: request.lastName,
      gender: request.gender,
      email: request.email,
      nationality: request.nationality,
      studentIdNumber: generatedStudentId,
      dateOfBirth: request.dateOfBirth,
      phoneNumber: request.phoneNumber,
      relationshipToStudent: request.relationshipToStudent,
      academicYear: request.academicYear,
      status: "active",
      photoUrl: request.photoUrl,
    })
    .returning();

    console.log("New student created:", newStudent);

  // 4. Return created student
  return ok({
    student: newStudent,
  });
});


const generatedStudentId = async () => {
    const newGeneratedStudentId = studentUtil().generateStudentId();
    const student = await db
        .select()
        .from(Students)
        .where(eq(Students.studentIdNumber, newGeneratedStudentId));
    if (student.length > 0) {
        return generatedStudentId(); // Recursively generate a new ID if it already exists
    }
    return newGeneratedStudentId; // Return the unique student ID
}
