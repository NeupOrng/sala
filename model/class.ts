import { useForm, type FormContext } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { StudentDto, type IStudentDto } from "./student";
import { TeacherDto, type ITeacherDto } from "./teacher";

export interface IClassDto {
    id: string;
    name: string;
    students: IStudentDto[];
    teacher: ITeacherDto;
    schoolId: string;
    description: string;
}

export class ClassDto implements IClassDto {
    id: string;
    name: string;
    students: StudentDto[];
    teacher: TeacherDto;
    schoolId: string;
    description: string;

    constructor(json: any) {
        this.id = String(json?.id ?? "");
        this.name = String(json?.name ?? "");
        this.students = json?.students?.map((s: any) => new StudentDto(s)) || [];
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

export interface ICreateClassModelDto {
    name: string;
    students: string[];
    teacher: string;
    description: string;
}

export class CreateClassModelDto implements ICreateClassModelDto{
    name: string;
    students: string[];
    teacher: string;
    description: string;

    constructor() {
        this.name = '';
        this.students = [];
        this.teacher = '';
        this.description = '';
    }

    set values(json: ICreateClassModelDto) {
        this.name = json.name;
        this.students = json.students;
        this.teacher = json.teacher;
        this.description = json.description;
    }

    get toCreateClassRequestString(): string {
        const req = {
            name: this.name,
            description: this.description,
            teacherId: this.teacher,
            students: this.students
        }
        return JSON.stringify(req);
    }

    get formContext(): FormContext<ICreateClassModelDto> {
        const formSchema = toTypedSchema(z.object({
                    name: z.string()
                        .nonempty('Class name is required')
                        .min(3, 'name must be at least 3 characters long'),
                    description: z.string().optional(),
                    students: z.array(z.string()),
                    teacher: z.string().optional()
                }));
        return useForm<ICreateClassModelDto>({
                    validationSchema: formSchema,
                    initialValues: {
                        name: '',
                        description: '',
                        students: [],
                        teacher: ''
                    }
                }); 
    }
}
