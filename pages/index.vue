<script setup lang="ts">
import { useSchoolStore } from "~/store/school";

definePageMeta({
    isRequireAuth: true
})
const schoolStore = useSchoolStore();

onMounted(async () => {
    await schoolStore.fetchOnLoad();
})
</script>
<template>
  <ClientOnly>
    <AppDashboardStudentGender :gender="schoolStore.genderCount" />
  </ClientOnly>
</template>
