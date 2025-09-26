import { and, eq, not, inArray } from "drizzle-orm";
import { Quizzes, QuizzQuestions } from "~/server/schema";
import { db } from "~/server/utils/db";
export default defineEventHandler(async (event) => {
    const user = event.context.user;
    const quizId = event.context.params?.id ?? "";

    const rawResult = await db
        .select({
            quiz: Quizzes,
            question: QuizzQuestions,
        })
        .from(Quizzes)
        .leftJoin(
            QuizzQuestions,
            and(
                eq(QuizzQuestions.quizzId, Quizzes.quizId),
                eq(QuizzQuestions.status, "active")
            )
        )
        .where(
            and(
                eq(Quizzes.quizId, quizId),
                not(inArray(Quizzes.status, ["deleted", "closed"]))
            )
        );
    
    if (rawResult.length === 0) {
        return notFound("Quiz Not Found");
    }
    const formattedQuiz = {
        quizId: rawResult[0].quiz.quizId,
        title: rawResult[0].quiz.title,
        description: rawResult[0].quiz.description,
        startTime: rawResult[0].quiz.startTime,
        endTime: rawResult[0].quiz.endTime,
        status: rawResult[0].quiz.status,
        questions: [] as {
            questionId: string,
            content: string,
            quizId: string,
            type: string
        }[],
    };

    rawResult.forEach((value) => {
        if (value.question !== null) {
            const question = {
                questionId: value.question.id,
                content: value.question.content.replaceAll("\\", ""),
                quizId: value.quiz.quizId,
                type: value.question.type
            }
            formattedQuiz.questions.push(question);
        }
    });
    return ok({
        quiz: formattedQuiz,
    });
});
