import { ClassDto, CreateClassModelDto } from "../../model/class";

export interface IUseClassApi {
    fetchClasses: () => Promise<ClassDto[]>;
    editClass: (updatedClass: ClassDto) => Promise<ClassDto[]>;
    createClass: (payload: CreateClassModelDto) => Promise<ClassDto[]>
}

const useClassApi = (): IUseClassApi => {
    const { addNotification } = useNotification();
    const { $apiFetch } = useNuxtApp();
    const fetchClasses = async (): Promise<ClassDto[]> => {
        try {
            const response = await $apiFetch("/api/protected/classes", {
                credentials: "include",
            });
            if (response.statusCode !== 200) {
                throw new Error(
                    response.statusMessage || "Failed to fetch classes"
                );
            }
            return (
                response.data?.classes.map((cls: any) => new ClassDto(cls)) ||
                []
            );
        } catch (err) {
            console.error("Unexpected error fetching classes:", err);
            addNotification({
                title: "Fetch Classes Error",
                description: (err as Error).message || "Unknown error",
                type: "destructive",
                duration: 4000,
            });
            return [];
        }
    };

    const editClass = async (updatedClass: ClassDto): Promise<ClassDto[]> => {
        try {
            console.log("API editclass: ", updatedClass)
            const res = await $apiFetch("/api/protected/classes", {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: updatedClass.toEditClassRequestString,
            });
            if (res.statusCode !== 200) {
                throw new Error(
                    res.statusMessage || "Failed to create student"
                );
            }
            addNotification({
                title: "Success",
                description: "Class Updated Successfully",
                type: "default",
                duration: 4000,
            });
        } catch (err: any) {
            addNotification({
                title: "Update Error",
                description: err.message || "Unknown error",
                type: "destructive",
                duration: 4000,
            });
        }
        return await fetchClasses();
    };

    const createClass = async (payload: CreateClassModelDto): Promise<ClassDto[]> => {
        try {
            console.log("API editclass: ", payload)
            const res = await $apiFetch("/api/protected/classes", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: payload.toCreateClassRequestString,
            });
            if (res.statusCode !== 201) {
                throw new Error(
                    res.statusMessage || "Failed to create student"
                );
            }
            addNotification({
                title: "Success",
                description: "Class Created Successfully",
                type: "default",
                duration: 4000,
            });
        } catch (err: any) {
            addNotification({
                title: "Error",
                description: err.message || "Unknown error",
                type: "destructive",
                duration: 4000,
            });
        }
        return await fetchClasses();
    }

    return {
        fetchClasses,
        editClass,
        createClass,
    };
};

export default useClassApi;
