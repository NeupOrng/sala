<script setup lang="ts">
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "~/components/ui/table";
import { Checkbox } from "~/components/ui/checkbox";
import { Button } from "~/components/ui/button";
import { ClassDto } from "~/store/model/class";
import { Student, type IStudentModel } from "~/store/model/student";
import { useSchoolStore } from "~/store/school";

// Props
const props = defineProps({
    classItem: {
        type: ClassDto,
        required: true,
    },
    availableStudent: {
        type: Array<Student>,
        required: true
    }
});

const emit = defineEmits(["update:isAddStudentDialogOpen", "add-students"]);

const schoolStore = useSchoolStore();
const selectedStudents = ref({} as Record<string, boolean>);
const selectAll = ref(false);
const isLoading = ref(false);
const studentModelData = ref<IStudentModel[]>(props.availableStudent.map((student) => ({
    ...student,
    isSelected: false,
    isNewStudent: true
})));

// Computed
const hasSelectedStudents = computed(() => {
    return studentModelData.value.some((student) => student.isSelected);
});
const isDialogOpen = ref(false);

const selectAllToggle = (value: boolean | "indeterminate") => {
    console.log("Select All toggled:", value);
    if (value === true) {
        studentModelData.value.forEach((student) => {
            student.isSelected = true;
        });
    } else if (value === false) {
        studentModelData.value.forEach((student) => {
            student.isSelected = false;
        });
    }
    // Do nothing if value is "indeterminate"
    return value;
};

watch(
    () => studentModelData.value.map((student) => student.isSelected),
    (newSelections) => {
        const allSelected = newSelections.every((isSelected) => isSelected);
        if (selectAll.value !== allSelected) {
            selectAll.value = allSelected;
        }
    },
    { deep: true }
);

const onCancel = () => {
    selectedStudents.value = {};
    selectAll.value = false;
    emit("update:isAddStudentDialogOpen", false);
    isDialogOpen.value = false;
};

const submitNewStudent = async () => {
    isLoading.value = true;
    try {
        const selectedStudents = studentModelData.value.filter((s) => s.isSelected);
        emit("add-students", selectedStudents);
        selectAll.value = false;
    } catch (error) {
        console.error("Error adding students:", error);
    } finally {
        isLoading.value = false;
        isDialogOpen.value = false;
    }
};
</script>
<template>
    <Dialog v-model:open="isDialogOpen">
        <DialogTrigger asChild>
            <Button size="sm">Add Student</Button>
        </DialogTrigger>
        <DialogContent class="w-fit">
            <DialogHeader>
                <DialogTitle class="text-lg font-semibold text-gray-800"
                    >Add New Student</DialogTitle
                >
            </DialogHeader>
            <div class="relative">
                <Table class="w-full max-h-[50vh] h-fit relative overflow-y-auto" containerClass="max-h-[50vh]">
                    <TableHeader class="sticky top-[-1px] bg-white z-10">
                        <TableRow>
                            <TableHead class="w-12">
                                <Checkbox
                                    v-model="selectAll"
                                    @update:model-value="selectAllToggle"
                                    class="text-gray-600"
                                />
                            </TableHead>
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
                        </TableRow>
                    </TableHeader>
                    <TableBody class="">
                        <TableRow
                            v-for="(student, index) in studentModelData"
                            :key="student.id"
                        >
                            <TableCell>
                                <Checkbox
                                    v-model="student.isSelected"
                                />
                            </TableCell>
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
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
            <DialogFooter class="mt-4 flex justify-end space-x-2">
                <Button
                    variant="outline"
                    @click="onCancel"
                >
                    Cancel
                </Button>
                <Button
                    @click="submitNewStudent"
                    :disabled="!hasSelectedStudents"
                >
                    Add Selected
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>
