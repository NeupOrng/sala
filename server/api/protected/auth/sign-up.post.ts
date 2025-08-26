import { hash } from "bcrypt";
import { Users } from "~/server/schema/user";
import { created } from "~/server/utils/response/success-helper";
import { SALT } from "~/server/dto/constant/env";
import { SignUpRequestDto } from "~/server/dto/request/sign-up";
import { Teachers } from "~/server/schema";

export default defineEventHandler(async (event) => {
    const userContext = event.context.user;
    const requestDto = new SignUpRequestDto(await readBody(event));
    const hashedPassword = await hash(requestDto.password, Number(SALT));
    const response = {} as any;

    if (requestDto.role.toLowerCase() === "teacher") {
        const schoolId = userContext?.schoolId;
        const teacherProfile = await createTeacherProfile(
            hashedPassword,
            schoolId,
            requestDto
        );
        response.user = teacherProfile.user;
        response.user.teacherProfile = teacherProfile.teacher;
    } else {
        return badRequest("This role cannot be created via this endpoint");
    }
    return created(response);
});

const createTeacherProfile = async (
    hashedPassword: string,
    schoolId: string,
    requestDto: SignUpRequestDto
): Promise<{
    user: typeof Users.$inferSelect;
    teacher: typeof Teachers.$inferSelect;
}> => {
    const result = await db.transaction(async (txn) => {
        const [user] = await txn
            .insert(Users)
            .values({
                username: requestDto.username,
                passwordHash: hashedPassword,
                role: requestDto.role,
                isActive: true,
                isVerified: false,
            })
            .returning();

        const [teacher] = await txn
            .insert(Teachers)
            .values({
                userId: user.id,
                schoolId: schoolId,
                firstName: requestDto.firstName!,
                middleName: requestDto.middleName,
                lastName: requestDto.lastName!,
                email: requestDto.email,
                phone: requestDto.phone,
                status: "active",
            })
            .returning();

        return { user, teacher };
    });
    return result;
};
