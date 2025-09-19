export interface IUseClassApi {
    fetchQuizzes: () => Promise<QuizDto[]>;
    fetchQuizById: (quizId: string) => Promise<QuizDto | undefined>;
}

const useQuizApi = () => {
    const { addNotification } = useNotification();
    const { $apiFetch } = useNuxtApp();

    const fetchQuizzes = async (): Promise<QuizDto[]> => {
        try {
            const response = await $apiFetch("/api/protected/quiz", {
                credentials: "include",
            });
            if (response.statusCode !== 200) {
                throw new Error(
                    response.statusMessage || "Failed to fetch quiz"
                );
            }
            return (
                response.data?.quiz.map((cls: any) => new QuizDto(cls)) || []
            );
        } catch (err) {
            console.error("Unexpected error fetching quizzes:", err);
            addNotification({
                title: "Fetch Classes Error",
                description: (err as Error).message || "Unknown error",
                type: "destructive",
                duration: 4000,
            });
            return [];
        }
    };

    const fetchQuizById = async (
        quizId: string
    ): Promise<QuizDto | undefined> => {
        try {
            const rawResponse = await $apiFetch(
                `/api/protected/quiz/${quizId}`,
                {
                    credentials: "include",
                }
            );
            const response: {
                statusCode: number;
                statusMessage?: string;
                data?: { quiz: any };
            } = rawResponse as any;
            if (response.statusCode !== 200) {
                throw new Error(
                    response.statusMessage || "Failed to fetch quiz by id"
                );
            }
            return new QuizDto(response.data?.quiz);
        } catch (err) {
            console.error("Unexpected error fetching quizzes:", err);
            addNotification({
                title: "Fetch Classes Error",
                description: (err as Error).message || "Unknown error",
                type: "destructive",
                duration: 4000,
            });
        }
    };

    return {
        fetchQuizzes,
        fetchQuizById,
    };
};

export default useQuizApi;
