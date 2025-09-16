import { CreateQuizRequest } from "~/server/dto/request/quiz";
import { Quizzes } from "~/server/schema";
import { db } from "~/server/utils/db";

export default defineEventHandler(async (event) => {
    const user = event.context.user;
    const payload = new CreateQuizRequest(await readBody(event));
    
    const result = await db.insert(Quizzes).values(payload.getInsertPayload(user.roleId)).returning();
    return created({result});
});
