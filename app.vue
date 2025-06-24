<script setup lang="ts">
import { NuxtLayout } from "#components";
import { useSchoolStore } from "~/store/school";
import { useStudentStore } from "./store/student";

const schoolStore = useSchoolStore();
const studentStore = useStudentStore();

onMounted(async () => {
    await schoolStore.initialize();
    await studentStore.initialize(schoolStore.school.id);
})

</script>

<template>
  <ClientOnly>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </ClientOnly>
</template>
