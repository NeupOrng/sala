import { Student, type IStudent } from "./student";
import { TeacherDto, type ITeacherDto } from "./teacher";

export interface IClassDto {
    id: string;
    name: string;
    students: IStudent[];
    teacher: ITeacherDto;
    schoolId: string;
    description: string;
}

export class ClassDto implements IClassDto {
    id: string;
    name: string;
    students: Student[];
    teacher: TeacherDto;
    schoolId: string;
    description: string;

    constructor(json: any) {
        this.id = String(json?.id ?? "");
        this.name = String(json?.name ?? "");
        this.students = json?.students?.map((s: any) => new Student(s)) || [];
        this.teacher = new TeacherDto(json?.teacher);
        this.schoolId = String(json?.schoolId ?? "");
        this.description = String(json?.description ?? "");
    }

    get toEditClassRequestString(): string {
        const req = {
            classId: this.id,
            name: this.name,
            description: this.description,
            teacherId: this.teacher.id,
            students: this.students.map((std) => std.id)
        }
        return JSON.stringify(req);
    }
}
