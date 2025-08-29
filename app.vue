<script setup lang="ts">
import { NuxtLayout } from "#components";
import { useSchoolStore } from "~/store/school";

const schoolStore = useSchoolStore();

onMounted(async () => {
    await schoolStore.initialize();
})

</script>

<template>
  <ClientOnly>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </ClientOnly>
</template>
