import { CreateClassRequestDto } from "~/server/dto/request/create-class";
import {
    ClassAssignments,
    Classes,
    Schools,
    Students,
    Teachers,
} from "~/server/schema";
import { eq, inArray, and } from "drizzle-orm";
import { db } from "~/server/utils/db";
import { Enrollments } from "~/server/schema";

export default defineEventHandler(async (event) => {
    const user = event.context.user;
    const requestDto = new CreateClassRequestDto(await readBody(event));
    const school = await getSchool(user.schoolId);
    const newClass = await createClass(requestDto, school.id);
    return created({
        class: newClass,
    });
});

const getSchool = async (
    schoolId: string
): Promise<typeof Schools.$inferSelect> => {
    const [school] = await db
        .select()
        .from(Schools)
        .where(eq(Schools.id, schoolId))
        .limit(1);
    return school;
};
const createClass = async (
    request: CreateClassRequestDto,
    schoolId: string
) => {
    console.log("[Classes API] Creating class for school:", request, schoolId);
    const newClassDto: typeof Classes.$inferInsert = {
        schoolId: schoolId,
        name: request.name,
        description: request.description,
        status: "active",
    };
    const newClass = await db.transaction(async (txn) => {
        const [newClass] = await txn
            .insert(Classes)
            .values(newClassDto)
            .returning();
        const classObj: any = { ...newClass };
        if (request.hasTeacher) {
            const classAssignmentsValue: typeof ClassAssignments.$inferInsert =
                {
                    classId: newClass.id,
                    teacherId: request.safeTeacherId,
                    status: "active",
                };
            const teacher = await txn
                .select()
                .from(Teachers)
                .where(
                    and(
                        eq(Teachers.id, request.safeTeacherId),
                        eq(Teachers.schoolId, schoolId),
                        eq(Teachers.status, "active")
                    )
                ).limit(1);
            if (teacher.length === 0) {
                throw new Error("Teacher not found or invalid");
            } else if(teacher.length > 1) {
                throw new Error("Multiple teachers found with the same ID");
            }
            await txn
                .insert(ClassAssignments)
                .values(classAssignmentsValue);
            classObj["teacher"] = teacher;
        }
        if (request.hasStudents) {
            const students = await txn
                .select()
                .from(Students)
                .where(
                    and(
                        inArray(Students.id, request.safeStudents),
                        eq(Students.schoolId, schoolId),
                        eq(Students.status, "active")
                    )
                );
            if (students.length < request.safeStudents.length) {
                throw new Error("Some students not found or invalid");
            }
            const enrollments: (typeof Enrollments.$inferInsert)[] =
                request.safeStudents.map((studentId) => ({
                    classId: newClass.id,
                    studentId: studentId,
                    status: "active",
                }));
            await txn.insert(Enrollments).values(enrollments).returning();
            classObj["students"] = students;
        }
        return classObj;
    });
    return newClass;
};
