import useQuizApi from "./fetch-api/quiz-api";

export const useQuizStore = defineStore("quiz", () => {
    const quizzes = ref<QuizDto[]>([]);
    const quizApi = useQuizApi();
    const { addNotification } = useNotification();

    async function fetchQuizzes() {
        quizzes.value = await quizApi.fetchQuizzes();
    }

    async function fetchQuizById(quizId: string) {
        return quizApi.fetchQuizById(quizId);
    }

    async function updateQuiz(quizModel: UpdateQuizRequestDto) {
        await quizApi.updateQuiz(quizModel);
    }

    return {
        quizzes,

        fetchQuizzes,
        fetchQuizById,
        updateQuiz,
    }
})