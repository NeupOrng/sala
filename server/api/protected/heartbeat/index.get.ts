import redis from "~/server/utils/redis";
import { RedisKey } from "~/server/dto/constant/redis-key";
import {
    forbidden,
    internalServerError,
} from "~/server/utils/response/error-helpers";
import { ok } from "~/server/utils/response/success-helper";

export default defineEventHandler(async (event) => {
    const token = getCookie(event, "token");

    if (!token) {
        console.error("[Auth 🔐] Missing auth token cookie");
        throw forbidden("Missing auth token cookie");
    }

    let userJson: string | null = null;
    try {
        userJson = await redis.get(`${RedisKey.authToken}:${token}`);
    } catch (err) {
        console.error("[Auth 🔐] Redis GET failed:", err);
        // Redis connection errors should bubble up as 500
        throw internalServerError("[Auth 🔐] Redis GET failed");
    }

    if (!userJson) {
        console.error(`[Auth 🔐] Token not found in Redis: ${token}`);
        throw forbidden("Invalid or expired token");
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
        throw internalServerError(
            "[Auth 🔐] Failed to JSON.parse Redis user for token"
        );
    }

    return ok({ user });
});
