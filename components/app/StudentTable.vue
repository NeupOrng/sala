<template>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead class="w-[50px]">#</TableHead>
        <TableHead>Student ID</TableHead>
        <TableHead>Full Name</TableHead>
        <TableHead>School</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="(student, index) in students" :key="student.id">
        <TableCell>{{ index + 1 }}</TableCell>
        <TableCell>{{ student.studentIdNumber }}</TableCell>
        <TableCell>{{ student.fullname }}</TableCell>
        <TableCell>{{ student.school.name }}</TableCell>
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
import type { Student } from "~/store/model/student";
defineProps<{
  students: Student[]
}>()
</script>
