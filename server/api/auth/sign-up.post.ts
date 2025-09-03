import { hash } from "bcrypt";
import jwt from "jsonwebtoken";
import { Users } from "~/server/schema/user";
import { RedisKey } from "~/server/dto/constant/redis-key";
import { created } from "~/server/utils/response/success-helper";
import { SALT, JWT_SECRET } from "~/server/dto/constant/env";
import { SignUpRequestDto } from "~/server/dto/request/sign-up";

export default defineEventHandler(async (event) => {
    const requestDto = new SignUpRequestDto(await readBody(event));

    const hashedPassword = await hash(requestDto.password ?? '', Number(SALT));

    const result = await createUserProfile(requestDto, hashedPassword);
    const newUserId = result.newUserId;
    const response = {} as any;
    response.user = result.user;

    // Generate JWT token
    const token = jwt.sign(
        { id: newUserId, username: requestDto.username, role: requestDto.role },
        JWT_SECRET,
        { expiresIn: "7d" }
    );

    // Set as HTTP-only cookie
    setCookie(event, "token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    const { passwordHash, ...safeUser } = result.user;
    redis.set(
        `${RedisKey.authToken}:${token}`,
        JSON.stringify(safeUser),
        "EX",
        60 * 60 * 24 * 7
    );
    redis.set(
        `${RedisKey.authUser}:${newUserId}`,
        token,
        "EX",
        60 * 60 * 24 * 7
    );

    return created(response);
});

const createUserProfile = async (
    requestDto: SignUpRequestDto,
    hashedPassword: string
): Promise<{ newUserId: string; user: typeof Users.$inferSelect }> => {
    const result = await db
        .insert(Users)
        .values({
            username: requestDto.username ?? '',
            passwordHash: hashedPassword,
            role: requestDto.role,
            isActive: true,
            isVerified: false,
        })
        .returning();
    const newUserId = result[0]?.id;
    return { newUserId, user: result[0] };
};
