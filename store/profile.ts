import { defineStore } from "pinia";
import ProfileRole from "~/model/enums/profile-role.enum";
import type { ResponseDto } from "~/model/general/response";
import useProfileApi from "./fetch-api/profile-api";

export const useProfileStore = defineStore("profiileStore", () => {
    const userProfile = reactive<IUserProfile>({
        id: "",
        username: "",
        role: ProfileRole.GUEST,
        isActive: true,
        isVerified: false,
    });
    const isAuthorized = ref(false);
    const lastChecked = ref(0);

    const profileApi = useProfileApi();

    async function login(request: ILoginModel): Promise<{ isSuccess: boolean, message: string }> {
        try {
            const response = await profileApi.login(request);
            if (response.statusCode === 200) {
                await checkIsAuthorized();
                return {
                    isSuccess: true,
                    message: "Login Succes",
                };
            } else {
                isAuthorized.value = false;
                return {
                    isSuccess: false,
                    message: response.statusMessage,
                };
            }
        } catch (error) {
            isAuthorized.value = false;
            if (error instanceof Error) {
                console.error("Login failed:", error.toString());
                return {
                    isSuccess: false,
                    message: error.toString(),
                };
            } else {
                console.error("Login failed:", String(error));
                return {
                    isSuccess: false,
                    message: String(error),
                };
            }
        }
    }

    async function checkIsAuthorized(): Promise<boolean> {
        const currentTime = Date.now();
        const timeSinceLastCheck = currentTime - lastChecked.value;
        if (timeSinceLastCheck < 60000) {
            return isAuthorized.value;
        }
        try {
            // Fetch the user profile to check authorization status
            const response = await profileApi.checkHeartbeat();
            // Check if the response body indicates an authorization failure
            if (
                response.statusMessage &&
                response.statusMessage.includes("Unauthorized")
            ) {
                isAuthorized.value = false;
                userProfile.username = "";
                userProfile.role = ProfileRole.GUEST;
                userProfile.id = "";
                userProfile.isActive = false;
                userProfile.isVerified = false;
            } else {
                // Assuming the response has the structure: { user: { isActive, isVerified } }
                const user = response.data?.user as IUserProfile;
                isAuthorized.value = user ? true : false;
                Object.assign(userProfile, user);
                userProfile.role = ProfileRole.fromStringIgnoreCase(user.role) ?? ProfileRole.GUEST;
            }

            // Update the timestamp of the last check
            lastChecked.value = currentTime;

            return isAuthorized.value;
        } catch (error) {
            // Handle any errors that occur during the API call
            console.error("Failed to fetch user profile:", error);
            isAuthorized.value = false;
            return false;
        }
    }

    async function logout() {
        await profileApi.logout().then(() => {
            isAuthorized.value = false;
            userProfile.username = "";
            userProfile.role = ProfileRole.GUEST;
            userProfile.id = "";
            userProfile.isActive = false;
            userProfile.isVerified = false;
        });
    }
    return {
        userProfile,
        isAuthorized,
        lastChecked,

        checkIsAuthorized,
        login,
        logout
    };
});
