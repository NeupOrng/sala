<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Student } from "~/store/model/student";
import { cloneDeep } from 'lodash'

const props = defineProps<{
  student: Student | null
  onSave: (student: Student) => void
  onDelete: (student: Student) => void
}>()

const emit = defineEmits(['close'])

const editableStudent = ref<Student | null>(null)

watch(
  () => props.student,
  (val) => {
    editableStudent.value = val ? cloneDeep(val) : null
  },
  { immediate: true }
)

function handleSave() {
  if (editableStudent.value) props.onSave(editableStudent.value)
  emit('close')
}

function handleDelete() {
  if (editableStudent.value) props.onDelete(editableStudent.value)
  emit('close')
}

function handleClose(open: boolean) {
  if (!open) emit('close')
}

</script>
<template>
  <Dialog :open="!!student" @update:open="handleClose">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit Student</DialogTitle>
      </DialogHeader>
      <div v-if="editableStudent">
        <div class="mb-2">
          <label class="text-sm text-muted-foreground">Student ID</label>
          <Input v-model="editableStudent.studentIdNumber" disabled />
        </div>
        <div class="mb-2">
          <label class="text-sm text-muted-foreground">First Name</label>
          <Input v-model="editableStudent.firstName" />
        </div>
        <div class="mb-2">
          <label class="text-sm text-muted-foreground">First Name</label>
          <Input v-model="editableStudent.middleName" />
        </div>
        <div class="mb-2">
          <label class="text-sm text-muted-foreground">First Name</label>
          <Input v-model="editableStudent.lastName" />
        </div>
        <div class="mb-2">
          <label class="text-sm text-muted-foreground">School</label>
          <Input v-model="editableStudent.school.name" disabled />
        </div>
        <div class="flex justify-end mt-4 gap-2">
          <Button variant="destructive" @click="handleDelete">Delete</Button>
          <Button @click="handleSave">Save</Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
