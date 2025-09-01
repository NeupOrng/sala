export interface ICreateClassRequestDto {
    name: string;
    description?: string;
    students?: string[];
    teacherId?: string;
}

export class CreateClassRequestDto implements ICreateClassRequestDto {
    name: string;
    description?: string;
    students?: string[];
    teacherId?: string;

    constructor(json: any) {
        this.validate(json);
        this.name = String(json?.name ?? "");
        this.description = json?.description
            ? String(json.description)
            : undefined;
        this.students = json?.students
            ? (json.students as any[]).map((s) => String(s))
            : [];
        this.teacherId = json?.teacherId ? String(json.teacherId) : undefined;
    }

    private validate(json: any) {
        if (!json.name) {
            throw new Error("Class name is required");
        } else if (json.name.length < 3) {
            throw new Error("Class name must be at least 3 characters long");
        }
    }

    public get hasStudents(): boolean {
        return Array.isArray(this.students) && this.students.length > 0;
    }

    public get hasTeacher(): boolean {
        return (
            this.teacherId !== undefined &&
            this.teacherId !== null &&
            this.teacherId !== ""
        );
    }

    public get safeStudents(): string[] {
        return this.students || [];
    }

    public get safeTeacherId(): string {
        return this.teacherId ?? "";
    }
}

export interface IEditClassRequestDto extends ICreateClassRequestDto {
    classId: string;
}

export class EditClassRequestDto implements IEditClassRequestDto {
    classId: string;
    name: string;
    description?: string;
    students?: string[];
    teacherId?: string;

    constructor(json: any) {
        this.validate(json);

        this.classId = json.classId;
        this.name = json.name;

        this.description = json?.description
            ? String(json.description)
            : undefined;
        this.students = json?.students
            ? (json.students as any[]).map((s) => String(s))
            : [];
        this.teacherId = json?.teacherId ? String(json.teacherId) : undefined;
    }

    private validate(json: any) {
        console.log("Validating EditClassRequestDto", json)
        if (!json.classId) {
            throw badRequest("classId is required")
        } else if (!json.name) {
            throw badRequest("Class name is required");
        } else if (json.name.length < 3) {
            throw badRequest("Class name must be at least 3 characters long");
        }
    }

    public get hasStudents(): boolean {
        return Array.isArray(this.students) && this.students.length > 0;
    }

    public get hasTeacher(): boolean {
        return (
            this.teacherId !== undefined &&
            this.teacherId !== null &&
            this.teacherId !== ""
        );
    }

    public get safeStudents(): string[] {
        return this.students || [];
    }

    public get safeTeacherId(): string {
        return this.teacherId ?? "";
    }
}
