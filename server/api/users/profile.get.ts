import redis from "~/server/utils/redis";
import { RedisKey } from "~/server/dto/constant/redis-key";
import { ForbiddenException } from "~/server/dto/response/exception/forbidden";
import { InternalServerError } from "~/server/dto/response/exception/internal-server-error";

export default defineEventHandler(async (event) => {
    const token = getCookie(event, "token");

    if (!token) {
        console.error("[Auth 🔐] Missing auth token cookie");
        throw new ForbiddenException("[Auth 🔐] Missing auth token cookie");
    }

    let userJson: string | null = null;
    try {
        userJson = await redis.get(`${RedisKey.authToken}:${token}`);
    } catch (err) {
        console.error("[Auth 🔐] Redis GET failed:", err);
        // Redis connection errors should bubble up as 500
        throw new InternalServerError("[Auth 🔐] Redis GET failed");
    }

    if (!userJson) {
        console.error(`[Auth 🔐] Token not found in Redis: ${token}`);
        throw new ForbiddenException("Invalid or expired token");
    }

    let user: Record<string, any>;
    try {
        user = JSON.parse(userJson);
    } catch (err) {
        console.error(
            "[Auth 🔐] Failed to JSON.parse Redis user for token:",
            token,
            err
        );
        throw new InternalServerError(
            "[Auth 🔐] Failed to JSON.parse Redis user for token"
        );
    }

    return { user };
});
