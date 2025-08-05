import { defineStore } from "pinia";
import type { ILoginModel } from "~/models/auth/login";

export const useAuthStore = defineStore("authStore", {
    state: () => ({
        username: "",
        role: "",
        isAuthorized: false,
        lastChecked: 0,
    }),
    actions: {
        async checkIsAuthorized(): Promise<boolean> {
            const currentTime = Date.now();
            const timeSinceLastCheck = currentTime - this.lastChecked;
            if (timeSinceLastCheck < 60000) {
                return this.isAuthorized;
            }
            try {
                // Fetch the user profile to check authorization status
                const response = await $fetch("/api/users/profile", {
                    credentials: "include",
                });
                console.log("check authorized", response);
                // Check if the response body indicates an authorization failure
                if (
                    response.message &&
                    response.message.includes("Unauthorized")
                ) {
                    this.isAuthorized = false;
                    this.username = "";
                    this.role = "";
                } else {
                    // Assuming the response has the structure: { user: { isActive, isVerified } }
                    const user = response.user;
                    this.isAuthorized = user.isActive && user.isVerified;
                    this.username = user.username;
                    this.role = user.role;
                }

                // Update the timestamp of the last check
                this.lastChecked = currentTime;

                return this.isAuthorized;
            } catch (error) {
                // Handle any errors that occur during the API call
                console.error("Failed to fetch user profile:", error);
                this.isAuthorized = false;
                return false;
            }
        },

        async login(request: ILoginModel): Promise<boolean> {
            try {
                const response = await $fetch("/api/auth/sign-in", {
                    method: "POST",
                    body: request,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                });
                console.log('login', response)
                if (response.success) {
                    this.isAuthorized = true;
                    this.username = request.username;
                    this.role = "user";
                    return true;
                } else {
                    this.isAuthorized = false;
                    return false;
                }
            } catch (error) {
                console.error("Login failed:", error);
                this.isAuthorized = false;
                return false;
            }
        },
    },
});
