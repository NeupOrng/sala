<script setup lang="ts">
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { Student } from "~/store/model/student";
defineProps<{
  students: Student[]
  onSaveStudent: (student: Student) => void
  onDeleteStudent: (student: Student) => void
  onUploadImage: (file: File, studentId: string) => Promise<string>;
}>();
const selectedStudent = ref<Student | null>(null);
</script>
<template>
  <div>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead class="w-[50px]">#</TableHead>
          <TableHead>Student ID</TableHead>
          <TableHead>Full Name</TableHead>
          <TableHead>Gender</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="(student, index) in students" :key="student.id">
          <TableCell>{{ index + 1 }}</TableCell>
          <TableCell>{{ student.studentIdNumber }}</TableCell>
          <TableCell>{{ student.fullname }}</TableCell>
          <TableCell>{{ student.gender }}</TableCell>
          <TableCell>{{ student.phoneNumber }}</TableCell>
          <TableCell>{{ student.email }}</TableCell>
          <TableCell>
            <Button @click="selectedStudent = student">Edit</Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
    <AppEditStudentTableDialog
      v-if="selectedStudent"
      :student="selectedStudent as Student | null"
      :onSave="onSaveStudent"
      :onDelete="onDeleteStudent"
      :onUploadImage="onUploadImage"
      @close="selectedStudent = null"
    />
  </div>
</template>
