<script setup lang="ts">
import { useLoadingStore } from "~/store/loading";
import { useSchoolStore } from "~/store/school";

definePageMeta({
    isRequireAuth: true
})
const schoolStore = useSchoolStore();
const loadingStore = useLoadingStore()

onMounted(async () => {
    loadingStore.showLoading();
    await schoolStore.initialize().finally(() => {
        loadingStore.hideLoading();
    });
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
