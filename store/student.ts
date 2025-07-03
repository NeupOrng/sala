import { defineStore } from "pinia";
import { Student, type IStudent } from "./model/student";
import { useNotification } from "@/composables/use-notification";

export const useStudentStore = defineStore("studentStore", {
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
            const { addNotification } = useNotification();
            try {
                const res = await fetch("/api/students", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: student.toRequestString,
                });
                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(
                        err.statusMessage || "Failed to update student"
                    );
                }
                const data = await res.json();
                // Update local students array
                const idx = this.students.findIndex((s) => s.id === student.id);
                console.log("idx", idx);
                if (idx !== -1) {
                    this.students[idx] = new Student(data.student);
                }
                console.log(this.students[idx]);

                addNotification({
                    title: "Student Updated",
                    description: data.message || "Student updated successfully",
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
            console.log("created", student);
            const { addNotification } = useNotification();
            try {
                const res = await fetch("/api/students", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: student.toRequestString,
                });
                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(
                        err.statusMessage || "Failed to update student"
                    );
                }
                const data = await res.json();
                return new Student(data.student);
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
