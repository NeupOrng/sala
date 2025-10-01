import { and, eq, inArray, not } from "drizzle-orm";
import { PgColumn } from "drizzle-orm/pg-core";
import { UpdateQuizRequest } from "~/server/dto/request/quiz";
import { QuizStatusEnum, Quizzes } from "~/server/schema";
import { db } from "~/server/utils/db";

export default defineEventHandler(async (event) => {
    const user = event.context.user;
    const quizId = event.context.params?.id ?? "";
    const updateQuizRequest = new UpdateQuizRequest(await readBody(event));

    const result = await db.transaction(async (txn) => {
        await txn
            .update(Quizzes)
            .set({
                title: updateQuizRequest.title,
                description: updateQuizRequest.description,
                classId: updateQuizRequest.classId,
                startTime: updateQuizRequest.startTime,
                endTime: updateQuizRequest.endTime,
                status: updateQuizRequest.status as
                    | "draft"
                    | "published"
                    | "closed"
                    | "deleted",
            })
            .where(
                and(
                    eq(Quizzes.quizId, quizId),
                    not(inArray(Quizzes.status, ["deleted", "closed"]))
                )
            );
        return txn.select().from(Quizzes).where(eq(Quizzes.quizId, quizId)).limit(1);
    }).then((res) => res[0]);
    return ok({ quizId, result });
});