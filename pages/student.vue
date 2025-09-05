<script setup lang="ts">
import { useSchoolStore } from "~/store/school";

const schoolStore = useSchoolStore();
const computedStudents = computed(() => schoolStore.students);
</script>
<template>
    <ClientOnly>
        <div class="py-2 px-4 flex justify-between items-center">
            <p class="font-bold text-xl">Students</p>
            <StudentCreateButtonDialog 
                :onCreateStudent="schoolStore.createStudent"
                :onUploadImage="schoolStore.uploadImage"
            />
        </div>
        <StudentTable
            :students="computedStudents"
            :onSaveStudent="schoolStore.editStudent"
            :onDeleteStudent="schoolStore.deleteStudent"
            :onUploadImage="schoolStore.uploadImage"
        />
    </ClientOnly>
</template>
