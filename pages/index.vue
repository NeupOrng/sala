<script setup lang="ts">
import { useStudentStore } from "~/store/student";

const studentStore = useStudentStore();
const showAlert = ref(false);
</script>
<template>
  <ClientOnly>
    <h1>Index page</h1>
    <DonutChart />
    {{ studentStore.students }}
  </ClientOnly>
</template>
