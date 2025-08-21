import { Student, type IStudent } from "./student";

export interface IClass {
    id: string;
    name: string;
    students: IStudent[];
    teacherId: string;
    schoolId: string;
    createdAt: Date;
    updatedAt: Date;
}

export class Class implements IClass {
    id: string;
    name: string;
    students: Student[];
    teacherId: string;
    schoolId: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(json: any) {
        this.id = String(json?.id ?? "");
        this.name = String(json?.name ?? "");
        this.students = json?.students?.map((s: any) => new Student(s)) || [];
        this.teacherId = String(json?.teacherId ?? "");
        this.schoolId = String(json?.schoolId ?? "");
        this.createdAt = new Date(json?.createdAt);
        this.updatedAt = new Date(json?.updatedAt);
    }
}