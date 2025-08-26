export interface ISignUpRequestDto {
    username?: string;
    password?: string;
    role: "student" | "teacher" | "admin";
    userId?: string
    firstName?: string;
    middleName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
}

export class SignUpRequestDto implements ISignUpRequestDto {
    username?: string;
    password?: string;
    role: "student" | "teacher" | "admin";
    firstName?: string;
    middleName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    userId?: string;

    constructor(json: any) {
        console.log("SignUpRequestDto input:", json);
        this.validate(json);
        this.username = String(json?.username ?? "");
        this.password = String(json?.password ?? "");
        this.role = String(json?.role ?? "student") as
            | "student"
            | "teacher"
            | "admin";
        this.firstName = json?.firstName ? String(json.firstName) : undefined;
        this.middleName = json?.middleName
            ? String(json.middleName)
            : undefined;
        this.lastName = json?.lastName ? String(json.lastName) : undefined;
        this.phone = json?.phone ? String(json.phone) : undefined;
        this.email = json?.email ? String(json.email) : undefined;
        this.userId = json?.userId ? String(json.userId) : undefined;
    }

    private validate(json: any) {
        if (!json.username || !json.password) {
            throw new Error("Username and password are required");
        } else if (!json.role) {
            throw new Error("Role is required");
        } else if (!json.firstName || !json.lastName) {
            throw new Error(
                "First name and last name are required for teachers"
            );
        } else if(json.role.toLowerCase() === "teacher") {
            if (!json.email && !json.phone) {
                throw new Error("Email or phone number is required for teachers");
            } else if( json.email && !this.validateEmail(json.email)) {
                throw new Error("Invalid email format");
            } else if( json.phone && !this.validatePhone(json.phone)) {
                throw new Error("Invalid phone number format");
            }
        }
    }

    private validateEmail(email: string): boolean {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email.toLowerCase());
    }

    private validatePhone(phone: string): boolean {
        const re = /^\+?[1-9]\d{1,14}$/; 
        const re2 = /^(0\d{9,10})$/;
        return re.test(phone) || re2.test(phone);
    }
}
