import clsx from "clsx";
import { and, eq, or } from "drizzle-orm";
import { Classes, Quizzes, Teachers } from "~/server/schema";
import { db } from "~/server/utils/db";

export default defineEventHandler(async (event) => {
    const user = event.context.user;

    const result = await db
        .select({
            quiz: Quizzes,
            class: Classes,
            teacher: Teachers,
        })
        .from(Quizzes)
        .innerJoin(
            Classes,
            and(eq(Quizzes.classId, Classes.id), eq(Classes.status, "active"))
        )
        .innerJoin(
            Teachers,
            and(
                eq(Teachers.id, Quizzes.teacherId),
                eq(Teachers.status, "active")
            )
        )
        .where(
            or(
                eq(Quizzes.status, "draft"),
                eq(Quizzes.status, "published"),
                eq(Quizzes.status, "closed")
            )
        );
    
    const formattedResult: Record<string, any> = result.reduce((previousValue, currentValue): any => {
            if(!previousValue[currentValue.quiz.quizId]) {
                previousValue[currentValue.quiz.quizId] = 
                    {
                        ...currentValue.quiz,
                        class: currentValue.class,
                        teacher: currentValue.teacher
                    }
                
            }
            return previousValue;
        }, {})
    return ok({
        quiz: Object.values(formattedResult)
    })
});
