<script setup lang="ts">
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogHeader,
} from "@/components/ui/dialog";
import { Textarea } from "../ui/textarea";
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
    Form,
    FormControl,
    FormItem,
    FormLabel,
    FormMessage,
    FormField,
} from "@/components/ui/form";
import type { TeacherDto } from "~/model/teacher";
import { CreateClassModelDto, type IClassDto } from "~/model/class";
import type { StudentDto } from "~/model/student";



const props = defineProps<{
    handleCreateClass: (payload: CreateClassModelDto) => Promise<void>;
    teachers: TeacherDto[];
    allStudents: StudentDto[];
}>();


const isDialogOpen = ref(false);
const isLoading = ref(false);
const formModel = ref(new CreateClassModelDto().formContext)
const availableStudents = computed((): StudentDto[] => {
    if(formModel.value.values.students.length === 0) {
        return props.allStudents;
    }
    return props.allStudents.filter((std) => !formModel.value.values.students.includes(std.id))
})
const studentsInForm = computed((): StudentDto[] => {
    if(formModel.value.values.students.length === 0) {
        return [];
    }
    return props.allStudents.filter((std) => formModel.value.values.students.includes(std.id)) 
})



watch(isDialogOpen, (newVal) => {
    if (!newVal) {
        formModel.value.resetForm();
    }
});



const handleAddStudents = (students: StudentDto[]) => {
    console.log("handle add student", students)
    const newStudentIds = students.map((std) => std.id);
    formModel.value.setFieldValue("students", [...formModel.value.values.students,...newStudentIds])
    console.log("end handle add student", formModel)
}

const removeStudent = (student: StudentDto) => {
    const filteredStudents = formModel.value.values.students.filter((studentId) => studentId !== student.id);
    formModel.value.setFieldValue("students",filteredStudents )
}

const handleClose = () => {
    isDialogOpen.value = false;
};

const handleSubmit = formModel.value.handleSubmit(async (value) => {
    isLoading.value = true;
    const payload = new CreateClassModelDto();
    payload.values = value;
    await props.handleCreateClass(payload).then(() => {
        isLoading.value = false;
        isDialogOpen.value = false;
    })
});
</script>
<template>
    <Dialog v-model:open="isDialogOpen" :disabled="isLoading">
        <DialogTrigger>
            <Button variant="default">Add</Button>
        </DialogTrigger>

        <DialogContent class="max-h-[80vh] w-fit overflow-auto">
            <DialogHeader>
                <DialogTitle class="text-xl font-semibold text-gray-800">
                    <span>Create Class</span>
                    <div class="mt-2 h-1 w-16 bg-blue-500 rounded"></div>
                </DialogTitle>
            </DialogHeader>
            <div>
                <form @submit="handleSubmit">
                    <div class="flex justify-between items-start gap-4">
                        <FormField name="name" v-slot="{ componentField }">
                            <FormItem class="mb-4">
                                <FormLabel>Class Name</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="class name"
                                        v-bind="componentField"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                        <FormField name="teacher" v-slot="{ componentField }">
                            <FormItem class="mb-4">
                                <FormLabel>Teacher</FormLabel>
                                <FormControl>
                                    <Select v-bind="componentField">
                                        <SelectTrigger class="w-[180px]">
                                            <SelectValue
                                                placeholder="Select a teacher"
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem
                                                    v-for="(
                                                        teacher, index
                                                    ) in teachers"
                                                    :key="index"
                                                    :value="teacher.id"
                                                >
                                                    {{ teacher.fullName }}
                                                </SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                    </div>
                    <FormField name="description" v-slot="{ componentField }">
                        <FormItem class="mb-4">
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="class description"
                                    v-bind="componentField"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <section>
                        <div class="flex justify-between items-center mb-3">
                        <h3 class="text-lg font-semibold text-gray-700">
                            Students ({{ formModel.values.students.length }})
                        </h3>

                        <ClassSelectStudentTable
                            :availableStudent="availableStudents"
                            @add-students="handleAddStudents"
                        />
                    </div>
                    <Table
                        class="w-full max-h-56 mb-3"
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
                                    >Actions</TableHead
                                >
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow
                                v-for="(student, index) in studentsInForm"
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
                                <TableCell class="text-right">
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        @click="removeStudent(student)"
                                        >Remove</Button
                                    >
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    </section>
                    <DialogFooter class="flex gap-4 justify-end">
                        <Button
                            variant="destructive"
                            type="button"
                            @click="handleClose"
                            >Cancel</Button
                        >
                        <Button variant="default" type="submit">Submit</Button>
                    </DialogFooter>
                </form>
            </div>
        </DialogContent>
    </Dialog>
</template>
