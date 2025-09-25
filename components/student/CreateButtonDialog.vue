<script setup lang="ts">
import { useFieldArray } from "vee-validate";

const props = defineProps<{
    onUploadImage: (file: File, studentId: string) => Promise<string>;
    onCreateStudent: (
        student: CreateStudentModel
    ) => Promise<StudentDto | null>;
}>();

const isOpen = ref(false);
const isCreatedStudent = ref(false);
const imageLoading = ref(false);
const studentModel = ref(new CreateStudentModel());

const handleOpen = () => {
    isOpen.value = true;
};

const handleSave = studentModel.value.formContext.handleSubmit(async (value) => {
    console.log("handleSave", value)
    const createStudentModel = new CreateStudentModel();
    createStudentModel.values = value;
    const student = await props.onCreateStudent(createStudentModel);
    if (student) {
        isCreatedStudent.value = true;
    }
});
const { fields, push, remove } = useFieldArray("guardians");

const handleClose = () => {
    isOpen.value = false;
};

const onAddGuardian = () => {
    push({
        firstName: "",
        middleName: "",
        lastName: "",
        phone: "",
        email: "",
        relationshipToStudent: "",
        isPrimary: false,
    });
};
// const handleImageChange = async (event: Event) => {
//     const target = event.target as HTMLInputElement;
//     const file = target.files && target.files[0];
//     if (file) {
//         const url = await props.onUploadImage(
//             file,
//             studentModel.value.firstName
//         );
//         studentModel.value.photoUrl = url + "?t=" + Date.now();
//     }
// };

watch(isOpen, (newVal) => {
    if (!newVal) {
        console.log(fields);
        studentModel.value.formContext.resetForm();
        // fields.value.forEach((field, index) => remove(index));
        while (fields.value.length > 0) {
            remove(0); // Remove from index 0 until array is empty
        }
    }
});
</script>
<template>
    <Button variant="default" @click="handleOpen">Add</Button>
    <Dialog v-model:open="isOpen">
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
                        <!-- <img
                            :src="studentModel.photoUrl"
                            alt="Student Image"
                            @load="imageLoading = false"
                            @error="imageLoading = false"
                            :style="{
                                visibility: imageLoading ? 'hidden' : 'visible',
                            }"
                            class="w-64 h-64 object-cover rounded-full border border-gray-200 group-hover:opacity-80 transition"
                        /> -->
                        <!-- <input
                            id="student-image-upload"
                            type="file"
                            accept="image/*"
                            class="hidden"
                            @change="handleImageChange"
                        /> -->
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
                    <div class="flex gap-2 items-start">
                        <FormField name="firstName" v-slot="{ componentField }">
                            <FormItem class="mb-2">
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                    <Input v-bind="componentField" />
                                </FormControl>
                                <FormMessage
                                    class="text-red-600 text-xs mt-1"
                                />
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
                                <FormMessage
                                    class="text-red-600 text-xs mt-1"
                                />
                            </FormItem>
                        </FormField>
                        <FormField name="lastName" v-slot="{ componentField }">
                            <FormItem class="mb-2">
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                    <Input v-bind="componentField" />
                                </FormControl>
                                <FormMessage
                                    class="text-red-600 text-xs mt-1"
                                />
                            </FormItem>
                        </FormField>
                    </div>
                    <FormField name="email" v-slot="{ componentField }">
                        <FormItem class="mb-2">
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input v-bind="componentField" />
                            </FormControl>
                            <FormMessage class="text-red-600 text-xs mt-1" />
                        </FormItem>
                    </FormField>
                    <FormField name="phone" v-slot="{ componentField }">
                        <FormItem class="mb-2">
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                                <Input v-bind="componentField" />
                            </FormControl>
                            <FormMessage class="text-red-600 text-xs mt-1" />
                        </FormItem>
                    </FormField>
                    <FormField name="nationality" v-slot="{ componentField }">
                        <FormItem class="mb-2">
                            <FormLabel>Nationality</FormLabel>
                            <FormControl>
                                <Input v-bind="componentField" />
                            </FormControl>
                            <FormMessage class="text-red-600 text-xs mt-1" />
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
                            <FormMessage class="text-red-600 text-xs mt-1" />
                        </FormItem>
                    </FormField>
                    <FormField name="dateOfBirth" v-slot="{ componentField }">
                        <FormItem class="mb-2">
                            <FormLabel>Date of Birth</FormLabel>
                            <FormControl>
                                <Input v-bind="componentField" type="date" />
                            </FormControl>
                            <FormMessage class="text-red-600 text-xs mt-1" />
                        </FormItem>
                    </FormField>
                    <div class="flex flex-col">
                        <div class="flex justify-between items-center mb-6">
                            <h3 class="text-lg font-semibold text-gray-900">
                                Guardians
                            </h3>
                            <Button
                                type="button"
                                @click="onAddGuardian"
                                variant="default"
                                class="px-4 py-2" 
                            >
                                + Add Guardian
                            </Button>
                        </div>
                        <div
                            v-for="(guardian, index) in fields"
                            :key="guardian.key"
                            class="space-y-4 border border-gray-200 p-6 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div class="flex justify-between items-center mb-4">
                                <h4 class="text-sm font-medium text-gray-700">
                                    Guardian {{ index + 1 }}
                                </h4>
                                <div class="flex gap-2">
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        type="button"
                                        @click="remove(index)"
                                        class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                                    >
                                        <svg
                                            class="w-4 h-4 mr-1"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                            />
                                        </svg>
                                        Remove
                                    </Button>
                                </div>
                            </div>
                            <div class="flex gap-4 mb-4 items-start">
                                <FormField
                                    :name="`guardians[${index}].firstName`"
                                    v-slot="{ componentField }"
                                >
                                    <FormItem class="flex-1">
                                        <FormLabel
                                            class="text-sm font-medium text-gray-700 mb-1"
                                            >First Name</FormLabel
                                        >
                                        <FormControl>
                                            <Input
                                                v-bind="componentField"
                                                placeholder="John"
                                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            />
                                        </FormControl>
                                        <FormMessage
                                            class="text-red-600 text-xs mt-1"
                                        />
                                    </FormItem>
                                </FormField>

                                <FormField
                                    :name="`guardians[${index}].middleName`"
                                    v-slot="{ componentField }"
                                >
                                    <FormItem class="flex-1">
                                        <FormLabel
                                            class="text-sm font-medium text-gray-700 mb-1"
                                            >Middle Name</FormLabel
                                        >
                                        <FormControl>
                                            <Input
                                                v-bind="componentField"
                                                placeholder="Middle"
                                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            />
                                        </FormControl>
                                        <FormMessage
                                            class="text-red-600 text-xs mt-1"
                                        />
                                    </FormItem>
                                </FormField>

                                <FormField
                                    :name="`guardians[${index}].lastName`"
                                    v-slot="{ componentField }"
                                >
                                    <FormItem class="flex-1">
                                        <FormLabel
                                            class="text-sm font-medium text-gray-700 mb-1"
                                            >Last Name</FormLabel
                                        >
                                        <FormControl>
                                            <Input
                                                v-bind="componentField"
                                                placeholder="Doe"
                                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            />
                                        </FormControl>
                                        <FormMessage
                                            class="text-red-600 text-xs mt-1"
                                        />
                                    </FormItem>
                                </FormField>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    :name="`guardians[${index}].phone`"
                                    v-slot="{ componentField }"
                                >
                                    <FormItem>
                                        <FormLabel
                                            class="text-sm font-medium text-gray-700 mb-1"
                                            >Phone Number</FormLabel
                                        >
                                        <FormControl>
                                            <Input
                                                v-bind="componentField"
                                                placeholder="+1 (555) 123-4567"
                                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            />
                                        </FormControl>
                                        <FormMessage
                                            class="text-red-600 text-xs mt-1"
                                        />
                                    </FormItem>
                                </FormField>

                                <FormField
                                    :name="`guardians[${index}].email`"
                                    v-slot="{ componentField }"
                                >
                                    <FormItem>
                                        <FormLabel
                                            class="text-sm font-medium text-gray-700 mb-1"
                                            >Email Address *</FormLabel
                                        >
                                        <FormControl>
                                            <Input
                                                v-bind="componentField"
                                                placeholder="john.doe@example.com"
                                                type="email"
                                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            />
                                        </FormControl>
                                        <FormMessage
                                            class="text-red-600 text-xs mt-1"
                                        />
                                    </FormItem>
                                </FormField>

                                <FormField
                                    :name="`guardians[${index}].relationshipToStudent`"
                                    v-slot="{ componentField }"
                                >
                                    <FormItem>
                                        <FormLabel
                                            class="text-sm font-medium text-gray-700 mb-1"
                                            >Relationship</FormLabel
                                        >
                                        <FormControl>
                                            <Select v-bind="componentField">
                                                <SelectTrigger class="w-full">
                                                    <SelectValue
                                                        placeholder="Select relationship"
                                                    />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="parent"
                                                        >Parent</SelectItem
                                                    >
                                                    <SelectItem
                                                        value="legal_guardian"
                                                        >Legal
                                                        Guardian</SelectItem
                                                    >
                                                    <SelectItem
                                                        value="grandparent"
                                                        >Grandparent</SelectItem
                                                    >
                                                    <SelectItem value="other"
                                                        >Other</SelectItem
                                                    >
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage
                                            class="text-red-600 text-xs mt-1"
                                        />
                                    </FormItem>
                                </FormField>
                                <FormField
                                    :name="`guardians[${index}].isPrimary`"
                                    v-slot="{ value, handleChange }" 
                                    type="checkbox"
                                >
                                    <FormItem
                                        class="flex items-center space-y-0"
                                    >
                                        <FormControl>
                                            <Checkbox
                                                :model-value="value"
                                                @update:model-value="handleChange"
                                                class="mr-2"
                                                aria-label="Mark as primary guardian"
                                            />
                                        </FormControl>
                                        <FormLabel>Primary Guardian</FormLabel>
                                    </FormItem>
                                </FormField>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <div class="flex justify-end gap-2">
                            <Button variant="destructive" @click="handleClose"
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
