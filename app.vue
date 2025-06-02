<script setup lang="ts">
import { NuxtLayout } from "#components";
import { useSchoolStore } from "~/store/school";

const schoolStore = useSchoolStore();
await schoolStore.fetchSchools();
const schools = schoolStore.schools;
</script>

<template>
  <ClientOnly>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </ClientOnly>
</template>
