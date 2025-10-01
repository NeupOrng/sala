import type { ResponseDto } from "~/model/general/response"

export interface IProfileApi {
    checkHeartbeat: () => Promise<ResponseDto<{ user: IUserProfile }>>,
    login: (request: ILoginModel) => Promise<ResponseDto<{ user: IUserProfile }>>,
    logout: () => Promise<void>;
}

const useProfileApi = () => {
    async function login(request: ILoginModel) {
        const response: ResponseDto<{ user: IUserProfile }> = await $fetch("/api/auth/sign-in", {
            method: "POST",
            body: request,
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        return response;
    }

    async function checkHeartbeat() {
        const response: ResponseDto<{ user: IUserProfile }> = await $fetch("/api/protected/heartbeat", {
            credentials: "include",
        });

        return response;
    }

    async function logout() {
        await $fetch("/api/auth/sign-off", {
            method: "POST",
            credentials: "include",
        });
    }

    return {
        checkHeartbeat,
        login,
        logout
    }
}

export default useProfileApi;