import { compare, hash } from "bcrypt";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { ForbiddenException } from "~/server/dto/response/exception/forbidden";
import { Users } from "~/server/schema/user";
import { db } from "~/server/utils/db";
import redis from "~/server/utils/redis";
import { RedisKey } from "~/server/dto/constant/redis-key";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret";
const SALT = process.env.SALT || 10;

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { username, password } = body;

    const [user] = await db
        .select()
        .from(Users)
        .where(eq(Users.username, username))
        .limit(1);

    if (!user || !(await compare(password, user.passwordHash))) {
        throw new ForbiddenException("Invalid username or password");
    }
    const token = jwt.sign(
        { id: user.id, email: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: "7d" }
    );

    // Set as HTTP-only cookie
    setCookie(event, "auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    redis.set(`${RedisKey.authToken}:${token}`, JSON.stringify(user), "EX", 60 * 60 *24 * 7)
    redis.set(`${RedisKey.authUser}:${user.id}`, token, "EX", 60 * 60 *24 * 7)

    return { success: true };
});
