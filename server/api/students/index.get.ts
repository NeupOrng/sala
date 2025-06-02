import { db } from "~/server/utils/db";
import { Schools } from "~/server/schema/schools";
import { Students } from "~/server/schema/students";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  console.log("event get", event);
  return await db
    .select({
      id: Students.id,
      firstName: Students.firstName,
      middleName: Students.middleName,
      lastName: Students.lastName,
      studentIdNumber: Students.studentIdNumber,
      school: Schools,
    })
    .from(Students)
    .innerJoin(Schools, eq(Students.schoolId, Schools.id))
    .where(eq(Students.status, "active"));
});
