<script setup lang="ts">
import { useStudentStore } from "~/store/student";

const classes = computed(() => {
    const studentStore = useStudentStore();
    return studentStore.classes;
});
const studentStore = useStudentStore();
</script>
<template>
    <ClientOnly>
        <div class="py-2 px-4 flex justify-between items-center">
            <p class="font-bold text-xl">Class</p>
            <AppCreateClassButtonDialog
                :onCreateClass="studentStore.createClass"
            />
        </div>
        <div class="p-4 flex ">
            <ClassDisplayItem v-for="item in classes" :key="item.id" :classItem="item" />
        </div>
    </ClientOnly>
</template>
