import { navigateTo } from "#app";

export default defineNuxtPlugin((nuxtApp) => {
    const customerFetch = $fetch.create({
        async onResponseError({ response }) {
            if (response.status === 403) {
                console.error("[Fetch Interceptor] Forbidden access, redirecting to login");
                // Redirect to login page if forbidden
                navigateTo("/login");
            } else if (response.status === 401) {
                console.error("[Fetch Interceptor] Unauthorized access, redirecting to login");
                // Redirect to login page if unauthorized
                navigateTo("/login");
            } else {
                console.error("[Fetch Interceptor] Error response:", response);
            }
        }
    });

    return {
        provide: {
            apiFetch: customerFetch
        }
    }
})