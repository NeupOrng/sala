import { useProfileStore } from "~/store/profile";

export default defineNuxtRouteMiddleware(async (to, from) => {
    const authStore = useProfileStore();
    const token = useCookie("token");
    if(to.meta.isRequireAuth ?? false) {
        const isAuthorized = await authStore.checkIsAuthorized();
        if(!isAuthorized) {
            return navigateTo('/login')
        }
    }
})