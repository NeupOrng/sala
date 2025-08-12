import { RedisKey } from "../dto/constant/redis-key";

export default defineEventHandler(async (event) => {
    try {
        const token = getCookie(event, "token");
        if (token) {
            const userJson = await redis.get(`${RedisKey.authToken}:${token}`);
            if (userJson) {
                event.context.user = JSON.parse(userJson);
            } else {
                event.context.user = undefined;
            }
        } else {
            event.context.user = undefined;
        }
    } catch (error) {
        event.context.user = null;
        console.error("[Auth Middleware] Error during user lookup:", error);
    }
});
