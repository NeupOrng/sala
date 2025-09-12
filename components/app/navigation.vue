<template>
    <ClientOnly>
        <aside class="w-64 bg-white shadow-md flex flex-col p-4">
            <div class="text-2xl font-bold mb-6">MyApp</div>
            <nav class="flex flex-col space-y-2">
                <NuxtLink
                    to="/"
                    class="px-4 py-2 rounded hover:bg-gray-100"
                    :active-class="`bg-blue-200`"
                    >Dashboard</NuxtLink
                >
                <NuxtLink
                    to="/student"
                    class="px-4 py-2 rounded hover:bg-gray-100"
                    :active-class="`bg-blue-200`"
                    >Student</NuxtLink
                >
                <NuxtLink
                    to="/class"
                    class="px-4 py-2 rounded hover:bg-gray-100"
                    :active-class="`bg-blue-200`"
                >
                    Class
                </NuxtLink>
                <NuxtLink
                    to="/quiz"
                    class="px-4 py-2 rounded hover:bg-gray-100"
                    :active-class="`bg-blue-200`"
                >
                    Quiz
                </NuxtLink>
                <!-- <a href="#" class="px-4 py-2 rounded hover:bg-gray-100">Profile</a>
        <a href="#" class="px-4 py-2 rounded hover:bg-gray-100">Settings</a>
        <a href="#" class="px-4 py-2 rounded hover:bg-gray-100">Logout</a> -->
            </nav>
        </aside>
    </ClientOnly>
</template>
<script setup lang="ts"></script>
