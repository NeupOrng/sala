export interface ICreateStudentRequest {
  schoolId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  gender: string;
  email: string;
  nationality: string;
  dateOfBirth: Date;
  phoneNumber: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  relationshipToStudent: string;
  academicYear: string;
  photoUrl: string;
}

export class CreateStudentRequest implements ICreateStudentRequest {
  schoolId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  gender: string;
  email: string;
  nationality: string;
  dateOfBirth: Date;
  phoneNumber: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  relationshipToStudent: string;
  academicYear: string;
  photoUrl: string;


  constructor(json: any) {
    this.schoolId = String(json?.schoolId ?? "");
    this.firstName = String(json?.firstName ?? "");
    this.middleName = json?.middleName ? String(json.middleName) : undefined;
    this.lastName = String(json?.lastName ?? "");
    this.gender = String(json?.gender ?? "");
    this.email = String(json?.email ?? "");
    this.nationality = String(json?.nationality ?? "");
    this.dateOfBirth = new Date(json.dateOfBirth)
    this.phoneNumber = String(json?.phoneNumber ?? "");
    this.guardianName = String(json?.guardianName ?? "");
    this.guardianPhone = String(json?.guardianPhone ?? "");
    this.guardianEmail = String(json?.guardianEmail ?? "");
    this.relationshipToStudent = String(json?.relationshipToStudent ?? "");
    this.academicYear = String(json?.academicYear ?? "");
    this.photoUrl = json?.photoUrl ?? "";
  }
}
