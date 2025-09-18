<script setup lang="ts">
import { NuxtLayout } from "#components";
</script>

<template>
    <LoadingScreen />
    <ClientOnly>
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </ClientOnly>
</template>
