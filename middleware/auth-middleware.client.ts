import { useProfileStore } from "~/store/profile";

export default defineNuxtRouteMiddleware(async (to, from) => {
    const authStore = useProfileStore();
    if(to.meta.isRequireAuth ?? false) {
        const isAuthorized = await authStore.checkIsAuthorized();
        if(!isAuthorized) {
            return navigateTo('/login')
        }
    }
})