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
        questions: [] as any[],
    };

    rawResult.forEach((value) => {
        if (value.question !== null) {
            formattedQuiz.questions.push(value.question);
        }
    });
    return ok({
        quiz: formattedQuiz,
    });
});
