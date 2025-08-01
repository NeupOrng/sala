import { useAuthStore } from "~/store/auth";

export default defineNuxtRouteMiddleware((to, from) => {
    const authStore = useAuthStore();
    if(to.meta.isRequireAuth ?? false) {
        if(!authStore.isAuthorized) {
            return navigateTo('/login')
        }
    }
    console.log('middleware: ', to, from, authStore);
})