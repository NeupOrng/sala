import { db } from "~/server/utils/db";
import { Schools } from "~/server/schema/schools";
import { Students } from "~/server/schema/students";
import { and, eq } from "drizzle-orm";
import { getHeader } from "~/server/utils/common";
import { BadRequestException } from "~/server/dto/response/exception/bad-request";

export default defineEventHandler(async (event) => {
  const schoolId = getHeader(event, "school_id");
  console.log("event get", schoolId);
  if (schoolId === undefined) {
   throw new BadRequestException("Missing school_id header");
  }
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
    .where(
        and(
            eq(Students.status, "active"),
            eq(Students.schoolId, schoolId)
        )
    );
});
