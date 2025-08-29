<script setup lang="ts">
const props = defineProps<{
    schoolName: string;
    totalStudents: number;
    totalTeachers: number;
    totalClasses: number;
}>();
</script>
<template>
    <Card class="w-full max-w-md shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
            <CardTitle class="text-2xl font-semibold text-gray-800">{{ schoolName }}</CardTitle>
            <div class="mt-2 h-1 w-16 bg-blue-500 rounded mx-auto"></div>
        </CardHeader>
        <CardContent>
            <div class="grid grid-cols-1 gap-4">
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors duration-200">
                    <span class="text-sm font-medium text-gray-600">Total Students</span>
                    <span class="text-lg font-bold text-blue-600">{{ totalStudents }}</span>
                </div>
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors duration-200">
                    <span class="text-sm font-medium text-gray-600">Total Teachers</span>
                    <span class="text-lg font-bold text-blue-600">{{ totalTeachers }}</span>
                </div>
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors duration-200">
                    <span class="text-sm font-medium text-gray-600">Total Classes</span>
                    <span class="text-lg font-bold text-blue-600">{{ totalClasses }}</span>
                </div>
            </div>
        </CardContent>
    </Card>
</template>