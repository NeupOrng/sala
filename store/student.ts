import { defineStore } from "pinia";
import { Student, type IStudent } from "./model/student";
import { useNotification } from "@/composables/use-notification";

export const useStudentStore = defineStore("studentStore", {
    state: () => ({
        students: [] as Student[],
    }),
    actions: {
        async initialize() {
            await this.fetchStudents();
        },

        async fetchStudents() {
            const { $apiFetch } = useNuxtApp();
            try {
                const { data } = await $apiFetch("/api/protected/students", {
                    credentials: "include",
                });
                this.students = (data?.students || []).map(
                    (student: any) => new Student(student)
                );
            } catch (err) {
                console.error("Unexpected error fetching students:", err);
            }
        },

        async editStudent(student: Student) {
            const { addNotification } = useNotification();
            const { $apiFetch } = useNuxtApp();
            try {
                const res = await $apiFetch("/api/protected/students", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: student.toRequestString,
                });
                if (res.statusCode !== 200) {
                    throw new Error(
                        res.statusMessage || "Failed to update student"
                    );
                }
                const data = res.data;
                // Update local students array
                const idx = this.students.findIndex((s) => s.id === student.id);
                if (idx !== -1) {
                    this.students[idx] = new Student(data?.student);
                }
                console.log(this.students[idx]);

                addNotification({
                    title: "Student Updated",
                    description: res.statusMessage || "Student updated successfully",
                    type: "default",
                    duration: 4000,
                });
            } catch (err: any) {
                addNotification({
                    title: "Update Error",
                    description: err.message || "Unknown error",
                    type: "destructive",
                    duration: 4000,
                });
            }
        },
        async deleteStudent(student: Student) {
            console.log("delete", student);
        },
        async createStudent(student: Student): Promise<Student | null> {
            const { addNotification } = useNotification();
            const { $apiFetch } = useNuxtApp();
            try {
                const res = await $apiFetch("/api/protected/students", {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: student.toRequestString,
                });
                if (res.statusCode !== 201) {
                    throw new Error(
                        res.statusMessage || "Failed to create student"
                    );
                }
                const data = res.data;
                return new Student(data?.student);
            } catch (err: any) {
                addNotification({
                    title: "Update Error",
                    description: err.message || "Unknown error",
                    type: "destructive",
                    duration: 4000,
                });
                return null;
            }
        },
        async uploadImage(file: File, studentId: string): Promise<string> {
            const { addNotification } = useNotification();
            try {
                // 1. Get presigned URL
                const presignRes = await fetch("/api/file/student-presign", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ studentId }),
                });
                if (!presignRes.ok)
                    throw new Error("Failed to get presigned URL");
                const { url } = await presignRes.json();

                // 2. Upload file to presigned URL
                const putRes = await fetch(url, {
                    method: "PUT",
                    headers: {
                        "Content-Type": file.type || "image/jpeg",
                    },
                    body: file,
                });
                if (!putRes.ok)
                    throw new Error("Failed to upload image to storage");

                // 3. Return the image URL (assuming public access via the same key)
                const urlObj = new URL(url);
                const key = urlObj.pathname.replace(/^\//, "");
                const publicUrl = `${urlObj.origin}/${key}`;
                return publicUrl;
            } catch (err: any) {
                addNotification({
                    title: "Image Upload Error",
                    description: err.message || "Unknown error",
                    type: "destructive",
                    duration: 4000,
                });
                throw err;
            }
        },
    },
});
