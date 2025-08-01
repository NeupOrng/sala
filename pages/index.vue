<script setup lang="ts">
import { useSchoolStore } from "~/store/school";
import { useStudentStore } from "~/store/student";
import type { ILoginModel } from "~/models/auth/login";

definePageMeta({
    isRequireAuth: true
})
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
