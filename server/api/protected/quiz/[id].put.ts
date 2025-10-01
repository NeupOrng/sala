import { and, eq, inArray, not } from "drizzle-orm";
import { UpdateQuestionRequest, UpdateQuizRequest } from "~/server/dto/request/quiz";
import { Quizzes, QuizzQuestions } from "~/server/schema";
import { db } from "~/server/utils/db";

export default defineEventHandler(async (event) => {
    const user = event.context.user;
    const quizId = event.context.params?.id ?? "";
    const updateQuizRequest = new UpdateQuizRequest(await readBody(event));

    const result = await db.transaction(async (txn) => {
        const quiz = await txn
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
                eq(Quizzes.quizId, quizId)
            ).returning().then((res) => res[0]);

        const resultDto = { ...quiz, questions: [] as any }

        for (const questionDto of updateQuizRequest.questions) {
            console.log('Processing question:', questionDto, typeof questionDto);
            if (questionDto.isNew) {
                const question = await txn.insert(QuizzQuestions).values({
                    content: questionDto.content,
                    quizzId: quizId,
                    status: 'active',
                    type: questionDto.type as "multiple-choice" | "true-false" | "short-answer",
                }).returning().then((res) => res[0]);
                console.log('Inserted question:', question);
                resultDto.questions.push(question);
            } else {
                const dto = questionDto as UpdateQuestionRequest;
                const question = await txn.update(QuizzQuestions).set({
                    content: dto.content,
                    type: dto.type as "multiple-choice" | "true-false" | "short-answer",
                    status: dto.status as "active" | "suspended" | "deleted"
                }).where(
                    and(
                        eq(QuizzQuestions.id, dto.questionId),
                        eq(QuizzQuestions.quizzId, quizId),
                    )
                ).returning().then((res) => res[0]);
                console.log('Updated question:', question);
                resultDto.questions.push(question);
            }
        }
        return resultDto;
    });
    return ok({ quizId, result });
});