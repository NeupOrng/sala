<template>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead class="w-[50px]">#</TableHead>
        <TableHead>Student ID</TableHead>
        <TableHead>Full Name</TableHead>
        <TableHead>Gender</TableHead>
        <TableHead>School</TableHead>
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
        <TableCell>{{ student.school.name }}</TableCell>
        <TableCell>{{ student.phoneNumber }}</TableCell>
        <TableCell>{{ student.email }}</TableCell>
        <TableCell>
            <Button>Edit</Button>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>

<script setup lang="ts">
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import {
    Button
} from "@/components/ui/button"
import type { Student } from "~/store/model/student";
defineProps<{
  students: Student[]
}>()
</script>
