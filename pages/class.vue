<script setup lang="ts">
import { useSchoolStore } from "~/store/school";
const schoolStore = useSchoolStore();
const classes = computed(() => {
    return schoolStore.currentClasses;
});
onMounted(async () => {
    await Promise.all([
        schoolStore.fetchClasses(),
        schoolStore.fetchTeachers(),
    ]);
});
</script>
<template>
    <ClientOnly>
        <div class="py-2 px-4 flex justify-between items-center">
            <p class="font-bold text-xl">Class</p>
            <ClassCreateButton
                :teachers="schoolStore.teachers"
                :handleCreateClass="schoolStore.createClass"
                :allStudents="schoolStore.students"
            />
        </div>
        <div class="p-2 flex flex-wrap">
            <ClassDisplayItem
                v-for="item in classes"
                :key="item.id"
                :classItem="item"
                :students="schoolStore.students"
                :onSaveClass="schoolStore.editClass"
                :availableStudent="
                    schoolStore.getAvailableStudentsForClass(item.id)
                "
                :teachers="schoolStore.teachers"
            />
        </div>
    </ClientOnly>
</template>
