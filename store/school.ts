import { defineStore } from "pinia";
import type { ISchool } from "./model/school";
import type { IGenderCount } from "~/models/gender-count";
import { Student } from "./model/student";
import { ClassDto } from "./model/class";

export const useSchoolStore = defineStore("schoolStore", {
    state: () => ({
        school: {
            id: "",
            name: "",
            shortName: "",
        } as ISchool,
        genderCount: [] as IGenderCount[],
        students: [] as Student[],
        classes: [] as ClassDto[],
    }),
    actions: {
        async fetchSchools() {
            const { $apiFetch } = useNuxtApp();
            this.school = (await $apiFetch("/api/schools", {
                credentials: "include",
            })) as unknown as ISchool;
        },

        async fetchOnLoad() {
            const { $apiFetch } = useNuxtApp();
            const onloadResponse = await $apiFetch("/api/protected/on-load", {
                credentials: "include",
            });
            if (onloadResponse.statusCode !== 200) {
                const { addNotification } = useNotification();
                addNotification({
                    title: "Error",
                    description:
                        onloadResponse.statusMessage ||
                        "Failed to load school data",
                    type: "destructive",
                    duration: 4000,
                });
            }
            this.genderCount = onloadResponse.data?.genderCount || [];
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
                    description:
                        res.statusMessage || "Student updated successfully",
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
        async fetchClasses() {
            const { $apiFetch } = useNuxtApp();
            try {
                const response = await $apiFetch("/api/protected/classes", {
                    credentials: "include",
                });
                if (response.statusCode !== 200) {
                    throw new Error(
                        response.statusMessage || "Failed to fetch classes"
                    );
                }
                this.classes =
                    response.data?.classes.map(
                        (cls: any) => new ClassDto(cls)
                    ) || [];
            } catch (err) {
                console.error("Unexpected error fetching classes:", err);
                const { addNotification } = useNotification();
                addNotification({
                    title: "Fetch Classes Error",
                    description: (err as Error).message || "Unknown error",
                    type: "destructive",
                    duration: 4000,
                });
            }
        },

        async createClass() {
            console.log("Creating class with data:");
        },
        async initialize() {
            await this.fetchOnLoad();
            await this.fetchStudents();
            await this.fetchClasses();
        },
    },
});
