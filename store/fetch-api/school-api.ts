import type { ISchool } from "../model/school";

export interface IUseSchoolApi {
    fetchSchool: () => Promise<ISchool>
}

const useSchoolApi = () => {
    const { $apiFetch } = useNuxtApp();
    const { addNotification } = useNotification();

    async function fetchSchool(): Promise<ISchool> {
        const school = await $apiFetch("/api/protected/schools", {
            credentials: "include",
        });
        return school.data?.school || ({} as ISchool);
    };
    return {
        fetchSchool,
    };
};

export default useSchoolApi;
