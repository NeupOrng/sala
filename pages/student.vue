<script setup lang="ts">
import { useStudentStore } from "~/store/student";

const studentStore = useStudentStore();
const computedStudents = computed(() => studentStore.students);
</script>
<template>
    <ClientOnly>
        <div class="py-2 px-4 flex justify-between items-center">
            <p class="font-bold text-xl">Students</p>
            <AppCreateStudentButtonDialog 
                :onCreateStudent="studentStore.createStudent"
                :onUploadImage="studentStore.uploadImage"
            />
        </div>
        <AppStudentTable
            :students="computedStudents"
            :onSaveStudent="studentStore.editStudent"
            :onDeleteStudent="studentStore.deleteStudent"
            :onUploadImage="studentStore.uploadImage"
        />
    </ClientOnly>
</template>
