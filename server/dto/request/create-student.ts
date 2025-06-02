export interface ICreateStudentRequest {
    schoolId: string,
    firstName: string,
    middleName: string,
    lastName: string,
    gender: string,
    email: string,
    nationality: string,
    dateOfBirth: Date,
    phoneNumber: string,
    guardianName: string,
    guardianPhone: string,
    guardianEmail: string,
    relationshipToStudent: string,
    academicYear: string
}

export class CreateStudentRequest {
    
}