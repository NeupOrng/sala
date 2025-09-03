<script setup lang="ts">
import _ from "lodash";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ClassDto } from "~/store/model/class";
import {
    StudentModel,
    type IStudentModel,
    type Student,
} from "~/store/model/student";
import type { TeacherDto } from "~/store/model/teacher";

const props = defineProps<{
    classItem: ClassDto;
    onSaveClass: (updatedClass: ClassDto) => Promise<void>;
    availableStudent: Student[];
    teachers: TeacherDto[];
}>();

const isDialogOpen = ref(false);
const isEditing = ref(false);
const isLoading = ref(false);
const classModel = ref<ClassDto>(_.cloneDeep(props.classItem));
const studentsModel = ref<IStudentModel[]>(
    props.classItem.students.map((student) => ({
        ...student,
        isSelected: false,
        isNewStudent: false,
    }))
);

const removeStudent = (student: IStudentModel) => {
    studentsModel.value = studentsModel.value.filter(
        (std) => student.id != std.id
    );
};

const onEditingToggle = () => {
    isEditing.value = !isEditing.value;
};

const onCancel = () => {
    studentsModel.value = props.classItem.students.map((student) => ({
        ...student,
        isSelected: false,
        isNewStudent: false,
    }));
    isDialogOpen.value = false;
};

const onSaveEditedClass = async () => {
    isLoading.value = true;
    console.log("OnSave ClassModel", classModel.value);
    classModel.value.students = studentsModel.value.map((std) => {
        const studentModel = new StudentModel(std);
        return studentModel.studentDto;
    });
    await props.onSaveClass(classModel.value).then(() => {
        studentsModel.value = props.classItem.students.map((student) => ({
            ...student,
            isSelected: false,
            isNewStudent: false,
        }));
        isLoading.value = false;
        isEditing.value = false;
        isDialogOpen.value = false;
    });
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

const handleAddStudents = (studentIds: IStudentModel[]) => {
    console.log("Selected student IDs:", studentIds);
    studentsModel.value = [...studentsModel.value, ...studentIds];
};
</script>

<template>
    <Dialog v-model:open="isDialogOpen">
        <DialogTrigger as-child>
            <Card
                class="w-[24rem] m-1 cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
            >
                <CardHeader class="pb-2">
                    <CardTitle
                        class="text-lg font-semibold text-gray-800 truncate"
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
        <DialogContent class="w-[1100px] max-h-[85vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle class="text-xl font-semibold text-gray-800">
                    <span v-if="isEditing">Edit Class</span>
                    <span v-else>Class Details</span>
                    <div class="mt-2 h-1 w-16 bg-blue-500 rounded"></div>
                </DialogTitle>
            </DialogHeader>
            <div class="mt-4 space-y-6" :aria-disabled="isLoading">
                <div class="flex flex-row justify-between gap-6">
                    <div>
                        <h3 class="font-semibold text-lg text-gray-700">
                            Name
                        </h3>
                        <p class="text-sm text-gray-600 italic pl-2">
                            {{ classItem.name }}
                        </p>
                    </div>
                    <div class="text-left w-fit px-5">
                        <h3 class="font-semibold text-lg text-gray-700">
                            Teacher
                        </h3>
                        <Select v-model="classModel.teacher" v-if="isEditing">
                            <SelectTrigger class="w-[180px]">
                                <SelectValue placeholder="Select a teacher" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem
                                        v-for="(teacher, index) in teachers"
                                        :key="teacher.id"
                                        :value="teacher"
                                    >
                                        {{ teacher.fullName }}
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <div class="pl-2" v-else>
                            <p class="text-sm text-gray-800 italic">
                                {{ classItem.teacher.fullName }}
                            </p>
                        </div>
                    </div>
                </div>
                <div>
                    <div>
                        <h3 class="font-semibold text-lg text-gray-700">
                            Description
                        </h3>
                        <p class="text-sm text-gray-600 italic pl-2">
                            {{ classItem.description }}
                        </p>
                    </div>
                </div>
                <div>
                    <div class="flex justify-between items-center mb-3">
                        <h3 class="text-lg font-semibold text-gray-700">
                            Students ({{ studentsModel.length }})
                        </h3>

                        <ClassSelectStudentTable
                            v-if="isEditing"
                            :disabled="isLoading"
                            :classItem="classItem"
                            :availableStudent="availableStudent"
                            @add-students="handleAddStudents"
                        />
                    </div>
                    <Table
                        class="w-full max-h-56"
                        containerClass="max-h-[45vh]"
                    >
                        <TableHeader class="sticky top-[-1px] bg-white z-10">
                            <TableRow>
                                <TableHead class="text-gray-600">#</TableHead>
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
                                v-for="(student, index) in studentsModel"
                                :key="student.id"
                                :class="
                                    student.isNewStudent ? 'bg-emerald-100' : ''
                                "
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
                </div>
            </div>
            <DialogFooter>
                <div class="flex justify-end mt-4" v-if="!isEditing">
                    <Button class="mt-4" @click="onEditingToggle">Edit</Button>
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
                        @click="onSaveEditedClass()"
                        >Save Changes</Button
                    >
                </div>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>
