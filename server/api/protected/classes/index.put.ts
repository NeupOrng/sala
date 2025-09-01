import { and, eq, inArray, type InferSelectModel } from "drizzle-orm";
import { EditClassRequestDto } from "~/server/dto/request/class";
import { getSchoolById, getClassById } from "~/server/repository/school";
import { db } from "~/server/utils/db";
import {
    ClassAssignments,
    Classes,
    Enrollments,
    Schools,
    Students,
    Teachers,
} from "~/server/schema";

export default defineEventHandler(async (event) => {
    const user = event.context.user;
    const requestDto = new EditClassRequestDto(await readBody(event));
    const school = await getSchoolById(user.schoolId);

    const classObj = await validateClass(school, requestDto.classId);

    const existingStudents = await getExistingStudents(requestDto.classId);
    const removalStudentIds = findRemovalStudent(
        existingStudents,
        requestDto.students ?? []
    );
    const studentIdsToAdd = findStudentsToAdd(
        existingStudents,
        requestDto.students ?? []
    );

    const result: any = await db.transaction(async (txn) => {
        const [cls]: any = await txn
            .update(Classes)
            .set({
                name: requestDto.name,
                description: requestDto.description,
                updatedAt: new Date(),
            })
            .where(
                and(
                    eq(Classes.id, requestDto.classId),
                    eq(Classes.status, "active"),
                    eq(Classes.schoolId, school.id)
                )
            )
            .returning();

        if (requestDto.hasTeacher) {
            const [teacher] = await txn
                .select()
                .from(Teachers)
                .where(
                    and(
                        eq(Teachers.id, requestDto.teacherId ?? ""),
                        eq(Teachers.status, "active"),
                        eq(Teachers.schoolId, school.id)
                    )
                );

            if (!teacher) {
                throw badRequest("Invalid teacher");
            }

            const [classAssign] = await txn
                .select()
                .from(ClassAssignments)
                .where(
                    and(
                        eq(ClassAssignments.classId, requestDto.classId),
                        eq(ClassAssignments.status, "active")
                    )
                )
                .limit(1);

            if (!classAssign) {
                await txn.insert(ClassAssignments).values({
                    classId: requestDto.classId,
                    teacherId: teacher.id,
                });
            } else if (classAssign.teacherId !== teacher.id) {
                await txn
                    .update(ClassAssignments)
                    .set({
                        status: "deleted",
                        updatedAt: new Date(),
                    })
                    .where(
                        and(
                            eq(ClassAssignments.classId, classObj.id),
                            eq(ClassAssignments.status, "active")
                        )
                    );
                await txn.insert(ClassAssignments).values({
                    classId: requestDto.classId,
                    teacherId: teacher.id,
                });
            }
            cls['teacher'] = teacher;
        }
        if (removalStudentIds.length > 0) {
            await txn
                .update(Enrollments)
                .set({
                    status: "deleted",
                    updatedAt: new Date(),
                })
                .where(
                    and(
                        eq(Enrollments.classId, requestDto.classId),
                        inArray(Enrollments.studentId, removalStudentIds)
                    )
                );
        }
        if (studentIdsToAdd.length > 0) {
            await txn.insert(Enrollments).values(
                studentIdsToAdd.map((stdId) => ({
                    studentId: stdId,
                    classId: requestDto.classId,
                }))
            );
        }

        cls['students'] = (
            await txn
                .select()
                .from(Students)
                .innerJoin(
                    Enrollments,
                    and(
                        eq(Enrollments.studentId, Students.id),
                        eq(Enrollments.classId, requestDto.classId),
                        eq(Enrollments.status, "active")
                    )
                )
        ).map((res) => res.students);
        return cls;
    });

    return ok({
        ...result
    });
});

const validateClass = async (
    school: InferSelectModel<typeof Schools>,
    classId: string
) => {
    const cls = await getClassById(classId);
    if (school.id !== cls.schoolId) {
        throw badRequest("class doesn't belong to your school");
    }
    return cls;
};

const findRemovalStudent = (
    existingStudents: InferSelectModel<typeof Students>[],
    studentsIdFromReq: string[]
): string[] => {
    const existingStudentIds = existingStudents.map((student) => student.id);

    const removalStudentIds = existingStudentIds.filter(
        (id) => !studentsIdFromReq.includes(id)
    );

    return removalStudentIds;
};

const findStudentsToAdd = (
    existingStudents: InferSelectModel<typeof Students>[],
    studentsIdFromReq: string[]
): string[] => {
    if (!studentsIdFromReq?.length) return [];
    if (!existingStudents?.length) return studentsIdFromReq;

    const existingStudentIds = existingStudents.map((student) => student.id);

    const studentsToAdd = studentsIdFromReq.filter(
        (id) => !existingStudentIds.includes(id)
    );

    return studentsToAdd;
};

const getExistingStudents = async (
    classId: string
): Promise<InferSelectModel<typeof Students>[]> => {
    const students = await db
        .select()
        .from(Students)
        .innerJoin(
            Enrollments,
            and(
                eq(Enrollments.studentId, Students.id),
                eq(Enrollments.classId, classId),
                eq(Enrollments.status, "active")
            )
        )
        .where(eq(Students.status, "active"));
    return students.map((row) => row.students);
};
