import type { ISchool } from "./school";

export interface IStudent {
  id: string;
  firstName: string;
  middleName?: string;
  studentIdNumber: string;
  school: ISchool;
}

export class Student implements IStudent {
  id: string;
  firstName: string;
  middleName?: string;
  studentIdNumber: string;
  school: ISchool;

  constructor(json: any) {
    this.id = json.id;
    this.firstName = json.firstName;
    this.middleName = json.middleName;
    this.studentIdNumber = json.studentIdNumber;
    this.school = json.school;
  }
}