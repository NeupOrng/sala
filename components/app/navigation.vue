<template>
    <ClientOnly>
        <aside class="w-64 bg-white shadow-md flex flex-col p-4">
            <div class="flex flex-col w-full">
                <div class="text-2xl font-bold mb-6">MyApp</div>
                <nav class="flex flex-col space-y-2">
                    <NuxtLink
                        to="/school"
                        class="px-4 py-2 rounded hover:bg-gray-100"
                        :active-class="`bg-blue-200`"
                        >Dashboard</NuxtLink
                    >
                    <NuxtLink
                        to="/school/student"
                        class="px-4 py-2 rounded hover:bg-gray-100"
                        :active-class="`bg-blue-200`"
                        >Student</NuxtLink
                    >
                    <NuxtLink
                        to="/school/class"
                        class="px-4 py-2 rounded hover:bg-gray-100"
                        :active-class="`bg-blue-200`"
                    >
                        Class
                    </NuxtLink>
                    <NuxtLink
                        to="/school/quiz"
                        class="px-4 py-2 rounded hover:bg-gray-100"
                        :active-class="`bg-blue-200`"
                    >
                        Quiz
                    </NuxtLink>
                </nav>

            </div>
            <div class="mt-auto">
                <div class="flex items-center p-4 border-t border-gray-200">

                    <div class="ml-3">
                        <p class="text-sm font-medium text-gray-900">{{ profileStore.userProfile.username }}</p>
                        <p class="text-xs text-gray-500">{{ profileStore.userProfile.role }}</p>
                    </div>
                </div>
                <button
                    @click="onLogout"
                    class="w-full px-4 py-2 text-sm text-white bg-red-500 rounded hover:bg-red-600 transition-colors"
                >
                    Logout
                </button>
            </div>
        </aside>
    </ClientOnly>
</template>
<script setup lang="ts">
const profileStore = useProfileStore();

async function onLogout() {
    await profileStore.logout().then(() => {
        navigateTo('/')
    });
}
</script>
