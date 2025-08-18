import { RedisKey } from "../dto/constant/redis-key";

export default defineEventHandler(async (event) => {
    try {
        const path = event.path;
        console.log("[Auth Middleware] url :", event.path);
        const token = getCookie(event, "token");
        if (path.startsWith("/api/protected") && token) {
            if (token) {
                const userJson = await redis.get(
                    `${RedisKey.authToken}:${token}`
                );
                if (userJson) {
                    event.context.user = JSON.parse(userJson);
                } else {
                    console.error("[Auth Middleware] Token not found in Redis");
                    throw forbidden("Invalid or expired token");
                }
            } else {
                console.error("[Auth Middleware] Missing auth token cookie");
                throw forbidden("Missing auth token cookie");
            }
        }
    } catch (error) {
        console.error("[Auth Middleware] Error during user lookup:", error);
        throw error;
    }
});
