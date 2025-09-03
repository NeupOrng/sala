import type { ISchool } from "./school";

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
    guardianName: string;
    guardianPhone: string;
    guardianEmail: string;
    relationToStudent: string;
    school: ISchool;
    photoUrl: string;
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
    guardianName: string;
    guardianPhone: string;
    guardianEmail: string;
    relationToStudent: string;
    school: ISchool;
    photoUrl: string;

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
        this.guardianName = json.guardianName;
        this.guardianPhone = json.guardianPhone;
        this.guardianEmail = json.guardianEmail;
        this.relationToStudent = json.relationToStudent;
        this.photoUrl = json.photoUrl;
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
    guardianName: string;
    guardianPhone: string;
    guardianEmail: string;
    relationToStudent: string;
    school: ISchool;
    photoUrl: string;
    isNewStudent: boolean;
    isSelected: boolean;

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
        this.guardianName = json.guardianName;
        this.guardianPhone = json.guardianPhone;
        this.guardianEmail = json.guardianEmail;
        this.relationToStudent = json.relationToStudent;
        this.photoUrl = json.photoUrl;
    }

    get studentDto(): StudentDto {
        return new StudentDto(this);
    }
}
