<script setup lang="ts">
import {
    type ICreateStudentModel,
    CreateStudentModel,
    StudentDto,
    type IStudentDto,
} from "~/model/student";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

const props = defineProps<{
    onUploadImage: (file: File, studentId: string) => Promise<string>;
    onCreateStudent: (
        student: ICreateStudentModel
    ) => Promise<StudentDto | null>;
}>();

const isOpen = ref(false);
const isCreatedStudent = ref(false);
const imageLoading = ref(false);
const studentModel = ref(new CreateStudentModel());

const handleClose = () => {
    isOpen.value = false;
};
const handleOpen = () => {
    isOpen.value = true;
};

const handleSave = studentModel.value.formContext.handleSubmit(async () => {
    const student = await props.onCreateStudent(studentModel.value);
    if (student) {
        isCreatedStudent.value = true;
    }
});

const handleCancel = () => {
    studentModel.value.formContext.resetForm();
    handleClose();
};

const dateOfBirthString = computed({
    get() {
        if (!studentModel.value.dateOfBirth) return "";
        const d = studentModel.value.dateOfBirth;
        if (typeof d === "string") {
            const str = d as string;
            return str.length >= 10 ? str.slice(0, 10) : "";
        }
        return d instanceof Date && !isNaN(d.getTime())
            ? d.toISOString().slice(0, 10)
            : "";
    },
    set(val: string) {
        if (studentModel) {
            studentModel.value.dateOfBirth = val ? new Date(val) : new Date("");
        }
    },
});

const handleImageChange = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files && target.files[0];
    if (file) {
        const url = await props.onUploadImage(file, studentModel.value.firstName);
        studentModel.value.photoUrl = url + "?t=" + Date.now();
    }
};
</script>
<template>
    <Button variant="default" @click="handleOpen">Add</Button>
    <Dialog :open="isOpen" @update:open="handleClose">
        <DialogContent class="max-h-[80vh] w-fit overflow-hidden">
            <DialogHeader class="h-fit">
                <DialogTitle>Add New Student</DialogTitle>
            </DialogHeader>
            <section class="h-[calc(80vh-180px)] overflow-y-auto">
                <div
                    v-if="isCreatedStudent"
                    class="flex flex-col items-start justify-center h-full"
                >
                    <Label class="py-4">Upload Student Photo</Label>
                    <Label
                        for="student-image-upload"
                        class="cursor-pointer group"
                    >
                        <img
                            :src="studentModel.photoUrl"
                            alt="Student Image"
                            @load="imageLoading = false"
                            @error="imageLoading = false"
                            :style="{
                                visibility: imageLoading ? 'hidden' : 'visible',
                            }"
                            class="w-64 h-64 object-cover rounded-full border border-gray-200 group-hover:opacity-80 transition"
                        />
                        <input
                            id="student-image-upload"
                            type="file"
                            accept="image/*"
                            class="hidden"
                            @change="handleImageChange"
                        />
                    </Label>
                    <span class="text-xs text-muted-foreground mt-2"
                        >Click image to upload</span
                    >
                </div>
                <form
                    v-else
                    @submit="handleSave"
                    class="flex flex-col justify-start flex-1 gap-6 pt-2 px-1"
                >
                    <div class="flex gap-2 items-start ">
                        <FormField name="firstName" v-slot="{ componentField }">
                            <FormItem class="mb-2">
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                    <Input v-bind="componentField" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                        <FormField
                            name="middleName"
                            v-slot="{ componentField }"
                        >
                            <FormItem class="mb-2">
                                <FormLabel>Middle Name</FormLabel>
                                <FormControl>
                                    <Input v-bind="componentField" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                        <FormField name="lastName" v-slot="{ componentField }">
                            <FormItem class="mb-2">
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                    <Input v-bind="componentField" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                    </div>
                    <FormField name="email" v-slot="{ componentField }">
                        <FormItem class="mb-2">
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input v-bind="componentField" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <FormField name="phone" v-slot="{ componentField }">
                        <FormItem class="mb-2">
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                                <Input v-bind="componentField" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <FormField name="nationality" v-slot="{ componentField }">
                        <FormItem class="mb-2">
                            <FormLabel>Nationality</FormLabel>
                            <FormControl>
                                <Input v-bind="componentField" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <FormField name="gender" v-slot="{ componentField }">
                        <FormItem class="mb-2">
                            <FormLabel>Gender</FormLabel>
                            <FormControl>
                                <Select v-bind="componentField">
                                    <SelectTrigger class="w-[180px]">
                                        <SelectValue
                                            placeholder="Select gender"
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="male">
                                                Male
                                            </SelectItem>
                                            <SelectItem value="female">
                                                Female
                                            </SelectItem>
                                            <SelectItem value="other">
                                                Other
                                            </SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <FormField name="dateOfBirth" v-slot="{ componentField }">
                        <FormItem class="mb-2">
                            <FormLabel>Date of Birth</FormLabel>
                            <FormControl>
                                <Input v-bind="componentField" type="date" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <DialogFooter>
                        <div class="flex justify-end gap-2">
                            <Button variant="destructive" @click="handleCancel"
                                >Cancel</Button
                            >
                            <Button type="submit">Save</Button>
                        </div>
                    </DialogFooter>
                </form>
            </section>
        </DialogContent>
    </Dialog>
</template>
