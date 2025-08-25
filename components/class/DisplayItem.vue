<script setup lang="ts">
import type { ClassDto } from '~/store/model/class';

defineProps<{
    classItem: ClassDto;
}>();

</script>
<template>
    <div>
        <p class="font-bold text-lg">{{ classItem.name }}</p>
        <p class="text-sm text-gray-600">Description: {{ classItem.description }}</p>
        <p class="text-sm text-gray-600">Students: {{ classItem.students.length }}</p>
        <p class="text-sm text-gray-600">Teacher: {{ classItem.teacher.fullName }}</p>
    </div>
</template>