import { hash } from "bcrypt";
import jwt from "jsonwebtoken";
import { Users } from "~/server/schema/user";
import { BadRequestException } from "~/server/dto/response/exception/bad-request";
import { RedisKey } from "~/server/dto/constant/redis-key";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret";
const SALT = process.env.SALT || 10;

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { username, password, role } = body;
    if (!username || !password) {
        throw new BadRequestException("Username and password are required");
    } else if (!role) {
        throw new BadRequestException("Role is required");
    }
    const hashedPassword = await hash(password, Number(SALT));

    const result = await db.insert(Users).values({
        username,
        passwordHash: hashedPassword,
        role,
        isActive: true,
        isVerified: false,
    }).returning();

    const newUserId = result[0]?.id;

    // Generate JWT token
    const token = jwt.sign(
        { id: newUserId, email: username, role },
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

    const { passwordHash, ...safeUser } = result[0];
    redis.set(`${RedisKey.authToken}:${token}`, JSON.stringify(safeUser), "EX", 60 * 60 *24 * 7)
    redis.set(`${RedisKey.authUser}:${newUserId}`, token, "EX", 60 * 60 *24 * 7)

    return { success: true };
});
