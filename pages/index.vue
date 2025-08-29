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
    <div class="flex h-[400px] gap-4 p-4">
        <AppDashboardSchoolInfo
            :schoolName="schoolStore.schoolName"
            :totalStudents="schoolStore.totalStudents"
            :totalClasses="schoolStore.totalClasses"
            :totalTeachers="schoolStore.totalTeachers"
        />
        <AppDashboardStudentGender :gender="schoolStore.genderCount" />
    </div>
  </ClientOnly>
</template>
