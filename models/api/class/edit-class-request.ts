import type { IRequestValidatedDto } from "~/models/dto/request-validated-dto";

export interface IEditClassRequest {
    name?: string;
    description?: string;
    students?: string[];
    teacherId?: string;
    classId: string;
}

export class EditClassRequest implements IEditClassRequest {
    name?: string;
    description?: string;
    students?: string[];
    teacherId?: string;
    classId: string;

    constructor(json: any) {
        this.classId = String(json?.classId ?? "");
        this.name = json?.name ? String(json.name) : undefined;
        this.description = json?.description
            ? String(json.description)
            : undefined;
        this.students = json?.students
            ? (json.students as any[]).map((s) => String(s))
            : [];
        this.teacherId = json?.teacherId ? String(json.teacherId) : undefined;
    }

    public validate(json: any): IRequestValidatedDto {
        if (!json.classId) {
            return { isError: true, message: "Class ID is required" };
        } else if( json.name === "") {
            return { isError: true, message: "Class name cannot be empty" };
        } else if (json.name && json.name.length < 3) {
            return { isError: true, message: "Class name must be at least 3 characters long" };
        }
        return { isError: false, message: "Valid" };
    }

    public get hasStudents(): boolean {
        return Array.isArray(this.students) && this.students.length > 0;
    }

    public get hasTeacher(): boolean {
        return this.teacherId !== undefined && this.teacherId !== null && this.teacherId !== "";
    }

    public get safeStudents(): string[] {
        return this.students || [];
    }

    public get safeTeacherId(): string {
        return this.teacherId ?? "";
    }
}