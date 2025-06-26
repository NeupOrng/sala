import { db } from "~/server/utils/db";
import { Students } from "~/server/schema/students";
import { eq } from "drizzle-orm";
import { readBody } from "h3";
import { BadRequestException } from "~/server/dto/response/exception/bad-request";
import { NotFoundException } from "~/server/dto/response/exception/not-found";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { id, ...fields } = body;
  if (!id) {
    throw new BadRequestException("Missing student id");
  }

  // Check if student exists
  const existing = await db.select().from(Students).where(eq(Students.id, id)).limit(1);
  if (!existing.length) {
    throw new NotFoundException("Student not found");
  }

  // Only update fields that are present in the request
  const updatableFields = [
    "schoolId", "firstName", "middleName", "lastName", "gender", "email", "nationality", "dateOfBirth", "phoneNumber", "guardianName", "guardianPhone", "guardianEmail", "relationshipToStudent", "academicYear", "photoUrl", "status"
  ];
  const updateData: Record<string, any> = {};
  for (const key of updatableFields) {
    if (fields[key] !== undefined) updateData[key] = fields[key];
  }

  const [updated] = await db
    .update(Students)
    .set(updateData)
    .where(eq(Students.id, id))
    .returning();

  return {
    message: "Student updated successfully",
    student: updated,
  };
});
