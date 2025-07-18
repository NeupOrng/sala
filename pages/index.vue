<script setup lang="ts">
import { useSchoolStore } from "~/store/school";
import { useStudentStore } from "~/store/student";

const studentStore = useStudentStore();
const schoolStore = useSchoolStore();
const showAlert = ref(false);

onMounted(async () => {
    await schoolStore.fetchOnLoad();
})
</script>
<template>
  <ClientOnly>
    <AppDashboardStudentGender :gender="schoolStore.genderCount" />
  </ClientOnly>
</template>
