import { defineStore } from "pinia";
import { Student, type IStudent } from "./model/student";

export const useStudentStore = defineStore("students", {
  state: () => ({
    students: [] as Student[],
    schoolId: "",
  }),
  actions: {
    async initialize(schoolId: string) {
      this.schoolId = schoolId;
      await this.fetchStudentBySchoolid(schoolId);
    },
    async callFetchStudent(path: string, init?: RequestInit) {
      return await fetch(path, {
        headers: {
          school_id: this.schoolId,
        },
        ...init,
      });
    },

    async fetchStudentBySchoolid(schoolId: string) {
      try {
        const { data, error } = await useFetch("/api/students", {
          headers: {
            school_id: schoolId,
          },
        });

        if (error.value) {
          console.error("Failed to fetch students:", error.value);
          return;
        }

        console.log("response", data.value);
        this.students = (data.value || []).map(
          (student: any) => new Student(student)
        );
      } catch (err) {
        console.error("Unexpected error fetching students:", err);
      }
    },

    async editStudent(student: Student) {
        console.log('edit', student)
    },
    async deleteStudent(student: Student) {
        console.log('delete', student)
    }
  },
});
