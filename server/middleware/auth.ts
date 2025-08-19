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
                    event.context.user.schoolId = "9689e690-36fd-49b3-a0dc-6f5285ff67e1";
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
