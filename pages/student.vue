<script setup lang="ts">
import { useStudentStore } from "~/store/student";

const studentStore = useStudentStore();

</script>
<template>
  <ClientOnly>
    <AppStudentTable :students="studentStore.students" />
  </ClientOnly>
</template>
