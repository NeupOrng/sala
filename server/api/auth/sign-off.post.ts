import { RedisKey } from "~/server/dto/constant/redis-key";
import redis from "~/server/utils/redis";
import { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  try {
    const token = getCookie(event, "token");

    // Validate token existence
    if (!token) {
      return forbidden("Unauthorized: No token provided");
    }

    // Delete the token from Redis
    const profile = await redis.getdel(`${RedisKey.authToken}:${token}`);

    if (!profile) {
      console.warn(`No profile found for token: ${token}`);
    }

    // Clear the token cookie
    setCookie(event, "token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0), // Expire immediately
    });

    // Return success response
    return ok({})
  } catch (error) {
    // Handle errors
    console.error("Logout error:", error);
    return internalServerError("Internal Server Error");
  }
});