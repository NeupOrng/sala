<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { Student } from "~/store/model/student";
import { cloneDeep } from "lodash";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { computed } from "vue";

const props = defineProps<{
  student: Student | null;
  onSave: (student: Student) => void;
  onDelete: (student: Student) => void;
  onUploadImage: (file: File, studentId: string) => Promise<string>;
}>();

const emit = defineEmits(["close"]);

const editableStudent = ref<Student | null>(null);
const imagePreview = ref<string | null>(null);
const imageLoading = ref(true);

watch(
  () => props.student,
  (val) => {
    editableStudent.value = val ? cloneDeep(val) : null;
  },
  { immediate: true }
);

function handleSave() {
  if (editableStudent.value) props.onSave(editableStudent.value);
  emit("close");
}

function handleDelete() {
  if (editableStudent.value) props.onDelete(editableStudent.value);
  emit("close");
}

function handleClose(open: boolean) {
  if (!open) emit("close");
}

async function handleImageChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files && target.files[0];
  if (file) {
    if (editableStudent.value) {
      const url = await props.onUploadImage(file, editableStudent.value.id);
      if (url) {
        editableStudent.value.photoUrl = url + "?t=" + Date.now();
      }
    }
  }
}

const dateOfBirthString = computed({
  get() {
    if (!editableStudent.value?.dateOfBirth) return "";
    const d = editableStudent.value.dateOfBirth;
    if (typeof d === "string") {
      const str = d as string;
      return str.length >= 10 ? str.slice(0, 10) : "";
    }
    return d instanceof Date && !isNaN(d.getTime())
      ? d.toISOString().slice(0, 10)
      : "";
  },
  set(val: string) {
    if (editableStudent.value) {
      editableStudent.value.dateOfBirth = val ? new Date(val) : new Date("");
    }
  },
});
</script>

<template>
  <Dialog :open="!!student" @update:open="handleClose">
    <DialogContent class="max-h-[80vh] overflow-hidden">
      <DialogHeader class="h-fit">
        <DialogTitle>Edit Student</DialogTitle>
      </DialogHeader>
      <div v-if="editableStudent">
        <div
          class="flex flex-col gap-6 max-h-[calc(80vh-84px)] overflow-y-auto"
        >
          <!-- Image Upload & Preview -->
          <div class="flex flex-col items-center justify-center w-full">
            <Label for="student-image-upload" class="cursor-pointer group">
              <img
                :src="editableStudent.photoUrl"
                alt="Student Image"
                @load="imageLoading = false"
                @error="imageLoading = false"
                :style="{ visibility: imageLoading ? 'hidden' : 'visible' }"
                class="w-32 h-32 object-cover rounded-full border border-gray-200 group-hover:opacity-80 transition"
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
          <!-- Form Fields -->
          <Form class="flex flex-col justify-start flex-1">
            <FormField name="studentIdNumber">
              <FormItem class="mb-2">
                <FormLabel>Student ID</FormLabel>
                <FormControl>
                  <Input v-model="editableStudent.studentIdNumber" disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <div class="flex gap-2">
              <FormField name="firstName">
                <FormItem class="mb-2">
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input v-model="editableStudent.firstName" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField name="middleName">
                <FormItem class="mb-2">
                  <FormLabel>Middle Name</FormLabel>
                  <FormControl>
                    <Input v-model="editableStudent.middleName" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField name="lastName">
                <FormItem class="mb-2">
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input v-model="editableStudent.lastName" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>
            <FormField name="email">
              <FormItem class="mb-2">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input v-model="editableStudent.email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField name="phoneNumber">
              <FormItem class="mb-2">
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input v-model="editableStudent.phoneNumber" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField name="nationality">
              <FormItem class="mb-2">
                <FormLabel>Nationality</FormLabel>
                <FormControl>
                  <Input v-model="editableStudent.nationality" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField name="gender">
              <FormItem class="mb-2">
                <FormLabel>Gender</FormLabel>
                <FormControl>
                  <select
                    v-model="editableStudent.gender"
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
                  <Input v-model="dateOfBirthString" type="date" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <!-- Guardian Info Section -->
            <div class="border-t pt-4 mt-4">
              <div class="font-semibold mb-2">Guardian Information</div>
              <FormField name="guardianName">
                <FormItem class="mb-2">
                  <FormLabel>Guardian Name</FormLabel>
                  <FormControl>
                    <Input v-model="editableStudent.guardianName" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField name="guardianPhone">
                <FormItem class="mb-2">
                  <FormLabel>Guardian Phone</FormLabel>
                  <FormControl>
                    <Input v-model="editableStudent.guardianPhone" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField name="guardianEmail">
                <FormItem class="mb-2">
                  <FormLabel>Guardian Email</FormLabel>
                  <FormControl>
                    <Input v-model="editableStudent.guardianEmail" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField name="relationToStudent">
                <FormItem class="mb-2">
                  <FormLabel>Relation to Student</FormLabel>
                  <FormControl>
                    <Input v-model="editableStudent.relationToStudent" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>
            <div class="flex justify-end mt-4 gap-2">
              <Button variant="destructive" @click="handleDelete"
                >Delete</Button
              >
              <Button @click="handleSave">Save</Button>
            </div>
          </Form>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
