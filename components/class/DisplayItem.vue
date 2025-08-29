<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import type { ClassDto } from "~/store/model/class";
import { ref } from "vue";
import type { Student } from "~/store/model/student";
import { is } from "drizzle-orm";

defineProps<{
    classItem: ClassDto;
    onSaveClass: (updatedClass: ClassDto) => void;
}>();

const isDialogOpen = ref(false);
const isEditing = ref(false);
const isLoading = ref(false);

// Placeholder functions for adding and removing students (implement logic as needed)
const addStudent = () => {
    // TODO: Implement logic to add a student (e.g., open a form or API call)
    console.log("Add student clicked");
};

const removeStudent = (student: Student) => {
    // TODO: Implement logic to remove a student (e.g., API call or state update)
    console.log(`Remove student: ${student.fullname}`);
};

const onEditingToggle = () => {
    isEditing.value = !isEditing.value;
};
const onCancel = () => {
    isEditing.value = false;
};
const onSaveEditedClass = (updatedClass: ClassDto) => {
    isLoading.value = true;
    // Simulate an API call or processing delay
    setTimeout(() => {
        isLoading.value = false;
        isEditing.value = false;
    }, 1000);
};
watch(
    () => isDialogOpen.value,
    (newVal) => {
        if (!newVal) {
            isLoading.value = false;
            isEditing.value = false;
        }
    }
);
</script>

<template>
    <Dialog v-model:open="isDialogOpen" >
        <DialogTrigger as-child>
            <Card
                class="w-64 m-2 cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
            >
                <CardHeader class="pb-2">
                    <CardTitle
                        class="text-xl font-semibold text-gray-800 truncate"
                        >{{ classItem.name }}</CardTitle
                    >
                    <p class="text-xs text-gray-500">
                        {{ classItem.description }}
                    </p>
                </CardHeader>
                <CardContent class="pt-2">
                    <div class="flex justify-between items-center">
                        <div class="flex flex-col items-start space-x-2">
                            <span class="text-sm italic text-gray-700"
                                >Students:</span
                            >
                            <span class="text-sm font-bold">{{
                                classItem.students.length
                            }}</span>
                        </div>
                        <div class="flex flex-col items-start space-x-2">
                            <span class="text-sm italic text-gray-700"
                                >Teacher:</span
                            >
                            <span class="text-sm font-bold truncate">{{
                                classItem.teacher.fullName
                            }}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </DialogTrigger>
        <DialogContent class="w-[1100px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle class="text-xl font-semibold text-gray-800">
                    <span>{{ classItem.name }}</span>
                    <div class="mt-2 h-1 w-16 bg-blue-500 rounded"></div>
                </DialogTitle>
            </DialogHeader>
            <div class="mt-4 space-y-6" :aria-disabled="isLoading">
                <div class="flex flex-row justify-between gap-6">
                    <div>
                        <h3 class="font-semibold text-lg text-gray-700">
                            <span>Description</span>
                        </h3>
                        <p class="text-sm text-gray-600 italic pl-2">
                            {{ classItem.description }}
                        </p>
                    </div>
                    <div class="text-left w-fit px-5">
                        <h3 class="font-semibold text-lg text-gray-700">
                            Teacher
                        </h3>
                        <div class="pl-2">
                            <p class="text-sm text-gray-800 italic">
                                {{ classItem.teacher.fullName }}
                            </p>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="flex justify-between items-center mb-3">
                        <h3 class="text-lg font-semibold text-gray-700">
                            Students
                        </h3>
                        <Button
                            v-if="isEditing"
                            size="sm"
                            @click="addStudent"
                            :disabled="isLoading"
                            >Add Student</Button
                        >
                    </div>
                    <Table class="w-full max-h-56">
                        <TableHeader>
                            <TableRow>
                                <TableHead class="text-gray-600"
                                    >#</TableHead
                                >
                                <TableHead class="text-gray-600"
                                    >Student Id</TableHead
                                >
                                <TableHead class="text-gray-600"
                                    >First Name</TableHead
                                >
                                <TableHead class="text-gray-600"
                                    >Middle Name</TableHead
                                >
                                <TableHead class="text-gray-600"
                                    >Last Name</TableHead
                                >
                                <TableHead
                                    class="text-right text-gray-600"
                                    v-if="isEditing"
                                    >Actions</TableHead
                                >
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow
                                v-for="(student, index) in classItem.students"
                                :key="student.id"
                            >
                                 <TableCell class="text-gray-700">{{
                                    index + 1
                                }}</TableCell>
                                <TableCell class="text-gray-700">{{
                                    student.studentIdNumber
                                }}</TableCell>
                                <TableCell class="text-gray-700">{{
                                    student.firstName
                                }}</TableCell>
                                <TableCell class="text-gray-700">{{
                                    student.middleName
                                }}</TableCell>
                                <TableCell class="text-gray-700">{{
                                    student.lastName
                                }}</TableCell>
                                <TableCell class="text-right" v-if="isEditing">
                                    <Button
                                        variant="destructive"
                                        :disabled="isLoading"
                                        size="sm"
                                        @click="removeStudent(student)"
                                        >Remove</Button
                                    >
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <div class="flex justify-end mt-4" v-if="!isEditing">
                        <Button class="mt-4" @click="onEditingToggle">
                            Edit
                        </Button>
                    </div>
                    <div class="flex justify-end mt-4" v-else>
                        <Button
                            class="mt-4"
                            variant="destructive"
                            :disabled="isLoading"
                            @click="onCancel"
                            >Cancel</Button
                        >
                        <Button
                            class="mt-4 ml-2"
                            :disabled="isLoading"
                            @click="onSaveEditedClass(classItem)"
                            >Save Changes</Button
                        >
                    </div>
                </div>
            </div>
        </DialogContent>
    </Dialog>
</template>
