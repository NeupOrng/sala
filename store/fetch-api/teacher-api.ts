export interface IUseTeacherApi {
    fetchTeachers: () => Promise<TeacherDto[]>
}

const useTeacherApi = () => {
    const { $apiFetch } = useNuxtApp();
    const { addNotification } = useNotification();
    const fetchTeachers = async (): Promise<TeacherDto[]> => {
        try {
            const response = await $apiFetch("/api/protected/teachers", {
                credentials: "include",
            });
            if (response.statusCode !== 200) {
                throw new Error(
                    response.statusMessage || "Failed to fetch classes"
                );
            }
            return (
                response.data?.teachers.map(
                    (teacher: any) => new TeacherDto(teacher)
                ) || []
            );
        } catch (err) {
            console.error("Unexpected error fetching classes:", err);
            addNotification({
                title: "Fetch Teachers Error",
                description: (err as Error).message || "Unknown error",
                type: "destructive",
                duration: 4000,
            });
            return [];
        }
    };
    return {
        fetchTeachers,
    };
};

export default useTeacherApi;
