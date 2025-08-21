<script setup lang="ts">
import { useStudentStore } from "~/store/student";

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
    </ClientOnly>
</template>