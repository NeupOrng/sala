import { db } from "~/server/utils/db";

export default defineEventHandler(async (event) => {
    const user = event.context.user;
    const quizId = event.context.params?.id ?? "";
    


});