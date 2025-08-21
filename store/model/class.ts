import { Student, type IStudent } from "./student";

export interface IClassDto {
    id: string;
    name: string;
    students: IStudent[];
    teacherId: string;
    schoolId: string;
    description: string;
}

export class ClassDto implements IClassDto {
    id: string;
    name: string;
    students: Student[];
    teacherId: string;
    schoolId: string;
    description: string;

    constructor(json: any) {
        this.id = String(json?.id ?? "");
        this.name = String(json?.name ?? "");
        this.students = json?.students?.map((s: any) => new Student(s)) || [];
        this.teacherId = String(json?.teacherId ?? "");
        this.schoolId = String(json?.schoolId ?? "");
        this.description = String(json?.description ?? "");
    }
}