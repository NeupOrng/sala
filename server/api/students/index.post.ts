import { db } from "~/server/utils/db";
import { Schools } from "~/server/schema/schools";
import { Students } from "~/server/schema/students";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  console.log("event post", event);
  return event.req;
});
