import { useForm, type FormContext, } from "vee-validate";
import {
    type ICreateGuardianModel,
    CreateGuardianModel,
    GuardianDto,
    type IGuardianDto,
} from "./guardian";
import * as z from "zod";
import type { ISchool } from "./school";
import { toTypedSchema } from "@vee-validate/zod";

export interface IStudentDto {
    id: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    studentIdNumber: string;
    status: string;
    email: string;
    nationality: string;
    gender: string;
    dateOfBirth: Date;
    phoneNumber: string;
    school: ISchool;
    photoUrl: string;
    guardians: IGuardianDto[];
}

export class StudentDto implements IStudentDto {
    id: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    studentIdNumber: string;
    status: string;
    email: string;
    nationality: string;
    gender: string;
    dateOfBirth: Date;
    phoneNumber: string;
    school: ISchool;
    photoUrl: string;
    guardians: GuardianDto[];

    constructor(json: any) {
        this.id = json.id;
        this.firstName = json.firstName;
        this.middleName = json.middleName;
        this.lastName = json.lastName;
        this.studentIdNumber = json.studentIdNumber;
        this.school = json.school;
        this.status = json.status;
        this.email = json.email;
        this.nationality = json.email;
        this.gender = json.gender;
        this.dateOfBirth = new Date(json.dateOfBirth);
        this.phoneNumber = json.phoneNumber;
        this.photoUrl = json.photoUrl;
        this.guardians = (json.guardians ?? []).map(
            (guardian: IGuardianDto) => new GuardianDto(guardian)
        );
    }

    get fullname(): string {
        if (this.middleName) {
            return `${this.lastName} ${this.middleName} ${this.firstName}`;
        }
        return `${this.lastName} ${this.firstName}`;
    }

    get toRequestString(): string {
        if (this.photoUrl) {
            this.photoUrl = this.photoUrl.split("?t=")[0];
        }
        return JSON.stringify(this);
    }
}

export interface IStudentModel extends IStudentDto {
    isSelected: boolean;
    isNewStudent: boolean;
}

export class StudentModel implements IStudentModel {
    id: string;
    firstName: string;
    middleName?: string | undefined;
    lastName: string;
    studentIdNumber: string;
    status: string;
    email: string;
    nationality: string;
    gender: string;
    dateOfBirth: Date;
    phoneNumber: string;
    school: ISchool;
    photoUrl: string;
    isNewStudent: boolean;
    isSelected: boolean;
    guardians: IGuardianDto[];

    constructor(json: any) {
        this.isNewStudent = json.isNewStudent;
        this.isSelected = json.isSelected;
        this.id = json.id;
        this.firstName = json.firstName;
        this.middleName = json.middleName;
        this.lastName = json.lastName;
        this.studentIdNumber = json.studentIdNumber;
        this.school = json.school;
        this.status = json.status;
        this.email = json.email;
        this.nationality = json.email;
        this.gender = json.gender;
        this.dateOfBirth = new Date(json.dateOfBirth);
        this.phoneNumber = json.phoneNumber;
        this.photoUrl = json.photoUrl;
        this.guardians = (json.guardians ?? []).map(
            (guardian: IGuardianDto) => new GuardianDto(guardian)
        );
    }

    get studentDto(): StudentDto {
        return new StudentDto(this);
    }
}

export interface ICreateStudentModel {
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    nationality: string;
    gender: string;
    dateOfBirth: string;
    phone: string;
    guardians: ICreateGuardianModel[];
}

export class CreateStudentModel implements ICreateStudentModel {
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    nationality: string;
    gender: string;
    dateOfBirth: string;
    phone: string;
    guardians: CreateGuardianModel[];

    constructor() {
        this.firstName = "";
        this.middleName = "";
        this.lastName = "";
        this.email = "";
        this.nationality = "";
        this.gender = "";
        this.dateOfBirth = (new Date()).toString();
        this.phone = "";
        this.guardians = [];
    }

    get formContext(): FormContext<ICreateStudentModel> {
        const guardianSchema = z.object({
            firstName: z.string().nonempty("FirstName is required"),
            middleName: z.string().optional(),
            lastName: z.string().nonempty("LastName is required"),
            phone: z
                .string()
                .min(9, "Phone number must be at least 9 digits")
                .max(13, "Phone number must be no more than 13 digits")
                .optional(),
            email: z.string().email().optional(),
            relationshipToStudent: z
                .string()
                .nonempty("Relationship to student is required"),
            isPrimary: z.boolean().default(false).optional(),
        });

        const formSchema = toTypedSchema(
            z.object({
                firstName: z.string().nonempty("FirstName is required"),
                middleName: z.string().optional(),
                lastName: z.string().nonempty("LastName is required"),
                phone: z
                    .string()
                    .min(9, "Phone number must be at least 9 digits")
                    .max(13, "Phone number must be no more than 13 digits")
                    .optional(),
                email: z.string().email().optional(),
                nationality: z.string().nonempty(),
                gender: z.string().nonempty(),
                dateOfBirth: z.string()
                    .refine((date) => new Date(date) >= new Date("1900-01-01"), {
                        message: "Date of birth must be after January 1, 1900",
                    }),
                guardians: z.array(guardianSchema).default([]).optional(),
            })
        );
        return useForm<ICreateStudentModel>({
            validationSchema: formSchema,
            initialValues: {
                firstName: "",
                middleName: "",
                lastName: "",
                email: "",
                nationality: "",
                gender: "",
                dateOfBirth: (new Date()).toString(),
                phone: "",
                guardians: [],
            },
        });
    }

    set values(json: any) {
        this.firstName = json.firstName ?? "";
        this.middleName = json.middleName ?? "";
        this.lastName = json.lastName ?? "";
        this.email = json.email ?? "";
        this.nationality = json.nationality ?? "";
        this.gender = json.gender ?? "";
        this.dateOfBirth = (new Date()).toString();
        this.phone = json.phone ?? "";
        this.guardians = (json.guardians ?? []).map((guardianJson: any) => {
            const createGuardianModel = new CreateGuardianModel();
            createGuardianModel.values = guardianJson;
            return createGuardianModel;
        });
    }

    get requestString(): string {
        console.table(this)
        const req = {
            firstName: this.firstName,
            middleName: this.middleName === "" ? null : this.middleName,
            lastName: this.lastName,
            gender: this.gender,
            email: this.email,
            nationality: this.nationality,
            dateOfBirth: new Date(this.dateOfBirth).toLocaleDateString("en-CA"),
            phoneNumber: this.phone,
            guardian: this.guardians.map((guardian) => guardian.jsonRequest),
        };
        return JSON.stringify(req);
    }
}
