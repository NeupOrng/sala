import { defineStore } from "pinia";
import type { ISchool } from "./model/school";
import type { IGenderCount } from "~/models/dto/gender-count";
import { Student } from "./model/student";
import { ClassDto } from "./model/class";
import useClassApi from "./fetch-api/class-api";
import useSchoolApi from "./fetch-api/school-api";
import { TeacherDto } from "./model/teacher";
import useTeacherApi from "./fetch-api/teacher-api";

export const useSchoolStore = defineStore("schoolStore", () => {
    const school = ref<ISchool>({
        id: "",
        name: "",
        shortName: "",
    });
    const genderCount = ref<IGenderCount[]>([]);
    const students = ref<Student[]>([]);
    const classes = ref<ClassDto[]>([]);
    const teachers = ref<TeacherDto[]>([]);
    const schoolApi = useSchoolApi();
    const classApi = useClassApi();
    const teacherApi = useTeacherApi();
    const { $apiFetch } = useNuxtApp();
    const { addNotification } = useNotification();

    // action
    async function fetchSchool() {
        school.value = await schoolApi.fetchSchool();
    }
    async function fetchOnLoad() {
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
        genderCount.value = onloadResponse.data?.genderCount || [];
    }
    async function fetchStudents() {
        try {
            const { data } = await $apiFetch("/api/protected/students", {
                credentials: "include",
            });
            students.value = (data?.students || []).map(
                (student: any) => new Student(student)
            );
        } catch (err) {
            console.error("Unexpected error fetching students:", err);
        }
    }
    async function editStudent(student: Student) {
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
            const idx = students.value.findIndex((s) => s.id === student.id);
            if (idx !== -1) {
                students.value[idx] = new Student(data?.student);
            }

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
    }
    async function deleteStudent(student: Student) {
        console.log("delete", student);
    }
    async function createStudent(student: Student): Promise<Student | null> {
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
    }
    async function uploadImage(file: File, studentId: string): Promise<string> {
        try {
            // 1. Get presigned URL
            const presignRes = await fetch("/api/file/student-presign", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ studentId }),
            });
            if (!presignRes.ok) throw new Error("Failed to get presigned URL");
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
    }
    async function fetchClasses() {
        classes.value = await classApi.fetchClasses();
    }
    async function createClass() {
        console.log("Creating class with data:");
    }
    async function editClass(updatedClass: ClassDto) {
        classes.value = await classApi.editClass(updatedClass);
    }

    async function fetchTeachers() {
        teachers.value = await teacherApi.fetchTeachers();
    }

    async function initialize() {
        await fetchSchool();
        await fetchOnLoad();
        await fetchStudents();
        await fetchClasses();
        await fetchTeachers();
    }

    function getAvailableStudentsForClass(classId: string): Student[] {
        const cls = classes.value.find((c) => c.id === classId);
        if (!cls) return students.value;
        const assignedStudentIds = new Set(cls.students.map((s) => s.id));
        return students.value.filter((s) => !assignedStudentIds.has(s.id));
    }
    function getAvailableTeachersForClass(classId: string): TeacherDto[] {
        const cls = classes.value.find((c) => c.id === classId);
        if (!cls || cls.teacher === undefined || cls.teacher.id === '') return teachers.value;
        return teachers.value.filter((t) => t.id !== cls.teacher.id);
    }

    // Getter
    const totalStudents = computed((): number => {
        return students.value.length;
    });
    const totalClasses = computed((): number => {
        return classes.value.length;
    });
    const totalTeachers = computed((): number => {
        return teachers.value.length;
    });
    const schoolName = computed((): string => {
        return school.value.name || "Your School Name";
    });
    const currentClasses = computed((): ClassDto[] => {
        return classes.value;
    });

    return {
        // state
        school,
        genderCount,
        students,
        classes,
        teachers,

        //action
        fetchSchool,
        fetchOnLoad,
        fetchStudents,
        editStudent,
        deleteStudent,
        createStudent,
        uploadImage,
        fetchClasses,
        editClass,
        createClass,
        initialize,
        fetchTeachers,
        getAvailableStudentsForClass,
        getAvailableTeachersForClass,

        //Getter
        totalClasses,
        totalStudents,
        totalTeachers,
        schoolName,
        currentClasses,
    };
});
