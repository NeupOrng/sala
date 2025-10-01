import { compare, hash } from "bcrypt";
import jwt from "jsonwebtoken";
import { eq, and } from "drizzle-orm";
import { Users } from "~/server/schema/user";
import { db } from "~/server/utils/db";
import redis from "~/server/utils/redis";
import { RedisKey } from "~/server/dto/constant/redis-key";
import { forbidden } from "~/server/utils/response/error-helpers";
import { ok } from "~/server/utils/response/success-helper";
import { JWT_SECRET } from "~/server/dto/constant/env";
import { Teachers } from "~/server/schema";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { username, password } = body;

    const [user] = await db
        .select()
        .from(Users)
        .where(eq(Users.username, username))
        .limit(1);

    if (!user || !(await compare(password, user.passwordHash))) {
        throw forbidden("Invalid username or password");
    }
    const token = jwt.sign(
        { id: user.id, email: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: "7d" }
    );

    // Set as HTTP-only cookie
    setCookie(event, "token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 7 days
    });

    let roleId = "N/A";
    if (user.role === "teacher") {
        const [role] = await db
            .select({
                id: Teachers.id,
                status: Teachers.status,
                firstName: Teachers.firstName,
                middleName: Teachers.middleName,
                lastName: Teachers.lastName,
            })
            .from(Teachers)
            .where(
                and(eq(Teachers.userId, user.id), eq(Teachers.status, "active"))
            )
            .limit(1);
        roleId = role.id;
    }

    const { passwordHash, ...safeUser } = user;
    const cacheData = {
        ...safeUser,
        roleId
    }
    redis.set(
        `${RedisKey.authToken}:${token}`,
        JSON.stringify(cacheData),
        "EX",
        60 * 60 * 24 * 7
    );
    redis.set(`${RedisKey.authUser}:${user.id}`, token, "EX", 60 * 60 * 24 * 7);

    return ok({
        user: safeUser,
    });
});
