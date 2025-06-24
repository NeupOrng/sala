import type { ISchool } from "./school";

export interface IStudent {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  studentIdNumber: string;
  school: ISchool;
}

export class Student implements IStudent {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  studentIdNumber: string;
  school: ISchool;

  constructor(json: any) {
    this.id = json.id;
    this.firstName = json.firstName;
    this.middleName = json.middleName;
    this.lastName = json.lastName;
    this.studentIdNumber = json.studentIdNumber;
    this.school = json.school;
  }

  get fullname(): string {
    if(this.middleName) {
        return `${this.lastName} ${this.middleName} ${this.firstName}`
    }
    return `${this.lastName} ${this.firstName}`
  }
}