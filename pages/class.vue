<script setup lang="ts">
import { useSchoolStore } from "~/store/school";

const classes = computed(() => {
    const schoolStore = useSchoolStore();
    return schoolStore.classes;
});
const schoolStore = useSchoolStore();

onMounted(async () => {
    await schoolStore.fetchClasses();
});
</script>
<template>
    <ClientOnly>
        <div class="py-2 px-4 flex justify-between items-center">
            <p class="font-bold text-xl">Class</p>
            <AppCreateClassButtonDialog
                :onCreateClass="schoolStore.createClass"
            />
        </div>
        <div class="p-4 grid grid-cols-4 gap-4">
            <ClassDisplayItem
                v-for="item in classes"
                :key="item.id"
                :classItem="item"
                :students="schoolStore.students"
                :onSaveClass="schoolStore.editClass"
                :availableStudent="schoolStore.getAvailableStudentsForClass(item.id)"
            />
        </div>
    </ClientOnly>
</template>
