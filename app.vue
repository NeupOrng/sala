<script setup lang="ts">
import { useSchoolStore } from '~/store/school';

const schoolStore = useSchoolStore();
await schoolStore.fetchSchools();
const schools = schoolStore.schools;
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold underline text-amber-800">
      Hello world!
    </h1>
    <ul>
      <li v-for="school in schools" :key="school.id">
        {{ school }}
      </li>
    </ul>
  </div>
</template>
