import { db } from "~/server/utils/db";
import { Schools } from "~/server/schema/schools";
import { Students } from "~/server/schema/students";
import { eq } from "drizzle-orm";
import { CreateStudentRequest } from "~/server/dto/request/create-student";
import { readBody } from "h3";
import studentUtil from "~/server/utils/student";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // 2. Map to DTO
  const request = new CreateStudentRequest(body);

  // Optional: Validate school exists
  const school = await db
    .select({
      id: Schools.id,
      name: Schools.name,
      shortName: Schools.shortName,
    })
    .from(Schools)
    .where(eq(Schools.id, request.schoolId))
    .limit(1);
  if (!school) {
    return {
      statusCode: 400,
      statusMessage: "Invalid schoolId",
    };
  }

  const generatedStudentId = `${
    school[0].shortName
  }${studentUtil().generateStudentId()}`;

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
      guardianName: request.guardianName,
      guardianPhone: request.guardianPhone,
      guardianEmail: request.guardianEmail,
      relationshipToStudent: request.relationshipToStudent,
      academicYear: request.academicYear,
      status: "active",
      photoUrl: request.photoUrl,
    })
    .returning();

  // 4. Return created student
  return {
    message: "Student created successfully",
    student: newStudent,
  };
});
