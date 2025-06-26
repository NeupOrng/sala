import type { ISchool } from "./school";

export interface IStudent {
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

export class Student implements IStudent {
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
}
