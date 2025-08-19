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
  guardian: Array<{
    name: string;
    phone: string;
    email: string;
  }>;
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
  guardian: Array<{
    name: string;
    phone: string;
    email: string;
  }>;
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
    this.dateOfBirth = new Date(json.dateOfBirth);
    this.phoneNumber = String(json?.phoneNumber ?? "");
    this.guardian = json?.guardian?.map((g: any) => ({
      name: String(g.name ?? ""),
      phone: String(g.phone ?? ""),
      email: String(g.email ?? "")
    })) || [];
    this.relationshipToStudent = String(json?.relationshipToStudent ?? "");
    this.academicYear = String(json?.academicYear ?? "");
    this.photoUrl = json?.photoUrl ?? "";
  }
}
