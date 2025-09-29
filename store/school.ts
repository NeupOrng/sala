import { defineStore } from "pinia";
import type { ISchool } from "../model/school";
import type { IGenderCount } from "~/model/general/gender-count";
import { CreateStudentModel, StudentDto } from "../model/student";
import { ClassDto, CreateClassModelDto } from "../model/class";
import useClassApi from "./fetch-api/class-api";
import useSchoolApi from "./fetch-api/school-api";
import { TeacherDto } from "../model/teacher";
import useTeacherApi from "./fetch-api/teacher-api";
import { useLoadingStore } from './loading'
import useQuizApi from "./fetch-api/quiz-api";
import { QuizDto } from "~/model/quiz";

export const useSchoolStore = defineStore("schoolStore", () => {
    const school = ref<ISchool>({
        id: "",
        name: "",
        shortName: "",
    });
    const genderCount = ref<IGenderCount[]>([]);
    const students = ref<StudentDto[]>([]);
    const classes = ref<ClassDto[]>([]);
    const teachers = ref<TeacherDto[]>([]);
    const quizzes = ref<QuizDto[]>([]);
    const schoolApi = useSchoolApi();
    const classApi = useClassApi();
    const teacherApi = useTeacherApi();
    const quizApi = useQuizApi();
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
            students.value = [];
            const { data } = await $apiFetch("/api/protected/students", {
                credentials: "include",
            });
            students.value = (data?.students || []).map(
                (student: any) => new StudentDto(student)
            );
        } catch (err) {
            console.error("Unexpected error fetching students:", err);
        }
    }
    async function editStudent(student: StudentDto) {
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
                students.value[idx] = new StudentDto(data?.student);
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
    async function deleteStudent(student: StudentDto) {
        console.log("delete", student);
    }
    async function createStudent(student: CreateStudentModel): Promise<StudentDto | null> {
        try {
            const res = await $apiFetch("/api/protected/students", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: student.requestString,
            });
            if (res.statusCode !== 201) {
                throw new Error(
                    res.statusMessage || "Failed to create student"
                );
            }
            const data = res.data;
            return new StudentDto(data?.student);
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
    async function createClass(payload: CreateClassModelDto) {
        console.log("Creating class with data:", payload);
        classes.value = await classApi.createClass(payload);
    }
    async function editClass(updatedClass: ClassDto) {
        classes.value = await classApi.editClass(updatedClass);
    }

    async function fetchTeachers() {
        teachers.value = await teacherApi.fetchTeachers();
    }

    async function fetchQuizzes() {
        quizzes.value = await quizApi.fetchQuizzes();
    }

    async function fetchQuizById(quizId: string) {
        return quizApi.fetchQuizById(quizId);
    }

    async function updateQuiz(quizModel: UpdateQuizRequestDto) {
        console.log(quizModel);
    }

    async function initialize() {
        await Promise.all([
            fetchSchool(),
            fetchOnLoad(),
        ])
    }

    function getAvailableStudentsForClass(classId: string): StudentDto[] {
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
        quizzes,

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
        fetchQuizzes,
        fetchQuizById,
        updateQuiz,

        //Getter
        totalClasses,
        totalStudents,
        totalTeachers,
        schoolName,
        currentClasses,
    };
});
