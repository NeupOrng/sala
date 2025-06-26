<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormField } from "@/components/ui/form";
import type { Student } from "~/store/model/student";
import { cloneDeep } from "lodash";

const props = defineProps<{
  student: Student | null;
  onSave: (student: Student) => void;
  onDelete: (student: Student) => void;
}>();

const emit = defineEmits(["close"]);

const editableStudent = ref<Student | null>(null);

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
</script>

<template>
  <Dialog :open="!!student" @update:open="handleClose">
    <DialogContent class="max-h-[80vh]">
      <DialogHeader class="h-fit">
        <DialogTitle>Edit Student</DialogTitle>
      </DialogHeader>
      <div v-if="editableStudent">
        <Form class="flex flex-col justify-start">
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
          <div class="flex justify-end mt-4 gap-2">
            <Button variant="destructive" @click="handleDelete">Delete</Button>
            <Button @click="handleSave">Save</Button>
          </div>
        </Form>
      </div>
    </DialogContent>
  </Dialog>
</template>
