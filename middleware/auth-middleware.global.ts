import { useAuthStore } from "~/store/auth";

export default defineNuxtRouteMiddleware(async (to, from) => {
    const authStore = useAuthStore();
    if(to.meta.isRequireAuth ?? false) {
        const isAuthorized = await authStore.checkIsAuthorized();
        console.log('isAuthorized', isAuthorized)
        if(!isAuthorized) {
            return navigateTo('/login')
        }
    }
    console.log('middleware: ', to, from, authStore);
})