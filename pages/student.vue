<script setup lang="ts">
import { useStudentStore } from "~/store/student";

const studentStore = useStudentStore();
const computedStudents = computed(() => studentStore.students)
</script>
<template>
  <ClientOnly>
    <AppStudentTable 
        :students="computedStudents" 
        :onSaveStudent="studentStore.editStudent"
        :onDeleteStudent="studentStore.deleteStudent"
        :onUploadImage="studentStore.uploadImage"
        />
  </ClientOnly>
</template>
