<script setup lang="ts">
import { StudentDto, type IStudentDto } from "~/model/student";
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
    onCreateStudent: (student: StudentDto) => Promise<StudentDto | null>;
}>();

const isOpen = ref(false);
const isCreatedStudent = ref(false);
const imageLoading = ref(false);
const studentModel = reactive<IStudentDto>({
    id: "",
    firstName: "",
    middleName: "",
    lastName: "",
    studentIdNumber: "",
    status: "",
    email: "",
    nationality: "",
    gender: "",
    dateOfBirth: new Date(),
    phoneNumber: "",
    guardianName: "",
    guardianPhone: "",
    guardianEmail: "",
    relationToStudent: "",
    school: {
        id: "",
        name: "",
        shortName: "",
    },
    photoUrl: "",
});

const handleClose = () => {
    isOpen.value = false;
};
const handleOpen = () => {
    isOpen.value = true;
};

const handleSave = async () => {
    const student = await props.onCreateStudent(new StudentDto(studentModel));
    if (student) {
        studentModel.id = student.id;
        studentModel.studentIdNumber = student.studentIdNumber;
        isCreatedStudent.value = true;
    }
};

const handleCancel = () => {
    handleClose();
};

const dateOfBirthString = computed({
    get() {
        if (!studentModel.dateOfBirth) return "";
        const d = studentModel.dateOfBirth;
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
            studentModel.dateOfBirth = val ? new Date(val) : new Date("");
        }
    },
});

const handleImageChange = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files && target.files[0];
    if (file) {
        const url = await props.onUploadImage(file, studentModel.id);
        studentModel.photoUrl = url + "?t=" + Date.now();
    }
};
</script>
<template>
    <Button variant="default" @click="handleOpen">Add</Button>
    <Dialog :open="isOpen" @update:open="handleClose">
        <DialogContent class="max-h-[80vh] overflow-hidden">
            <DialogHeader class="h-fit">
                <DialogTitle>Add New Student</DialogTitle>
            </DialogHeader>
            <section class="h-[calc(80vh-180px)] overflow-y-auto">
                <div
                    v-if="isCreatedStudent"
                    class="flex flex-col items-center justify-center w-full h-full"
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
                <Form
                    v-else
                    class="flex flex-col justify-start flex-1 gap-6 pt-2 px-1"
                >
                    <div class="flex gap-2">
                        <FormField name="firstName">
                            <FormItem class="mb-2">
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                    <Input v-model="studentModel.firstName" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                        <FormField name="middleName">
                            <FormItem class="mb-2">
                                <FormLabel>Middle Name</FormLabel>
                                <FormControl>
                                    <Input v-model="studentModel.middleName" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                        <FormField name="lastName">
                            <FormItem class="mb-2">
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                    <Input v-model="studentModel.lastName" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                    </div>
                    <FormField name="email">
                        <FormItem class="mb-2">
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input v-model="studentModel.email" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <FormField name="phoneNumber">
                        <FormItem class="mb-2">
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                                <Input v-model="studentModel.phoneNumber" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <FormField name="nationality">
                        <FormItem class="mb-2">
                            <FormLabel>Nationality</FormLabel>
                            <FormControl>
                                <Input v-model="studentModel.nationality" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <FormField name="gender">
                        <FormItem class="mb-2">
                            <FormLabel>Gender</FormLabel>
                            <FormControl>
                                <select
                                    v-model="studentModel.gender"
                                    class="input w-full h-9 rounded-md border px-3 py-1 text-base"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <FormField name="dateOfBirth">
                        <FormItem class="mb-2">
                            <FormLabel>Date of Birth</FormLabel>
                            <FormControl>
                                <Input
                                    v-model="dateOfBirthString"
                                    type="date"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <!-- Guardian Info Section -->
                    <div class="border-t pt-4 mt-4">
                        <div class="font-semibold mb-2">
                            Guardian Information
                        </div>
                        <FormField name="guardianName">
                            <FormItem class="mb-2">
                                <FormLabel>Guardian Name</FormLabel>
                                <FormControl>
                                    <Input
                                        v-model="studentModel.guardianName"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                        <FormField name="guardianPhone">
                            <FormItem class="mb-2">
                                <FormLabel>Guardian Phone</FormLabel>
                                <FormControl>
                                    <Input
                                        v-model="studentModel.guardianPhone"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                        <FormField name="guardianEmail">
                            <FormItem class="mb-2">
                                <FormLabel>Guardian Email</FormLabel>
                                <FormControl>
                                    <Input
                                        v-model="studentModel.guardianEmail"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                        <FormField name="relationToStudent">
                            <FormItem class="mb-2">
                                <FormLabel>Relation to Student</FormLabel>
                                <FormControl>
                                    <Input
                                        v-model="studentModel.relationToStudent"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                    </div>
                </Form>
            </section>
            <DialogFooter>
                <div class="flex justify-end gap-2">
                    <Button variant="destructive" @click="handleCancel"
                        >Cancel</Button
                    >
                    <Button @click="handleSave">Save</Button>
                </div>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>
