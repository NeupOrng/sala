export interface ITeacherDto {
    id: string;
    userId: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    status: string;
    createdAt?: string;
    updatedAt?: string;
}

export class TeacherDto implements ITeacherDto {
    id: string;
    userId: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    status: string;
    createdAt?: string;
    updatedAt?: string;

    constructor(json: any) {
        this.id = String(json?.id ?? "");
        this.userId = String(json?.userId ?? "");
        this.firstName = String(json?.firstName ?? "");
        this.middleName = json?.middleName ? String(json.middleName) : undefined;
        this.lastName = String(json?.lastName ?? "");
        this.status = String(json?.status ?? "active");
        this.createdAt = json?.createdAt ? String(json.createdAt) : undefined;
        this.updatedAt = json?.updatedAt ? String(json.updatedAt) : undefined;
    }

    get fullName(): string {
        return [this.firstName, this.middleName, this.lastName].filter(Boolean).join(" ");
    }
}
