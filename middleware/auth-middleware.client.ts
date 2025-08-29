import { useProfileStore } from "~/store/profile";

export default defineNuxtRouteMiddleware(async (to, from) => {
    const authStore = useProfileStore();
    const token = useCookie("token");
    console.log('token', token.value)
    if(to.meta.isRequireAuth ?? false) {
        const isAuthorized = await authStore.checkIsAuthorized();
        console.log('isAuthorized', isAuthorized)
        if(!isAuthorized) {
            return navigateTo('/login')
        }
    }
    console.log('middleware: ', to.fullPath, from.fullPath);
})