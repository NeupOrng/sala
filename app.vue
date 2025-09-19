<script setup lang="ts">
import { NuxtLayout } from "#components";
import { useProfileStore } from "./store/profile";

const profileStore = useProfileStore();

onMounted(async () => {
    await profileStore.checkIsAuthorized();
});

</script>

<template>
    <LoadingScreen />
    <ClientOnly>
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </ClientOnly>
</template>
