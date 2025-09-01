import { eq, and, InferSelectModel } from "drizzle-orm";
import { db } from "~/server/utils/db";
import { Schools, Teachers } from "../schema";
import { Classes } from "../schema";

export const getSchoolById = async (
    schoolId: string
): Promise<InferSelectModel<typeof Schools>> => {
    const [school] = await db
        .select()
        .from(Schools)
        .where(and(eq(Schools.id, schoolId), eq(Schools.status, "active")))
        .limit(1);

    if (!school) {
        throw badRequest("Invalid School");
    }
    return school;
};

export const getTeacherByIdAndSchoolId = async (
    teacherId: string,
    schoolId: string
): Promise<InferSelectModel<typeof Teachers>> => {
    const [teacher] = await db
        .select()
        .from(Teachers)
        .where(
            and(
                eq(Teachers.id, teacherId),
                eq(Teachers.status, "active"),
                eq(Teachers.schoolId, schoolId)
            )
        );
    if (!teacher) {
        throw badRequest("Invalid teacher");
    }
    return teacher;
};

export const getClassById = async (
    classId: string
): Promise<InferSelectModel<typeof Classes>> => {
    const [cls] = await db
        .select()
        .from(Classes)
        .where(and(eq(Classes.id, classId), eq(Classes.status, "active")))
        .limit(1);
    if (!cls) {
        throw badRequest("invalid class");
    }
    return cls;
};
