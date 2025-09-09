import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { useForm, type FormContext } from "vee-validate";

export interface IGuardianDto {
    id: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    phone?: string;
    email?: string;
    relationshipToStudent: string;
    isPrimary: boolean;
}

export class GuardianDto implements IGuardianDto {
    id: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    phone?: string;
    email?: string;
    relationshipToStudent: string;
    isPrimary: boolean;
    constructor(json: any) {
        this.id = json.id ?? "";
        this.firstName = json.firstName ?? "";
        this.middleName = json.middleName ?? undefined;
        this.lastName = json.lastName ?? "";
        this.phone = json.phone ?? undefined;
        this.email = json.email ?? undefined;
        this.relationshipToStudent = json.relationshipToStudent ?? "";
        this.isPrimary = json.isPrimary ?? false;
    }
}

export interface ICreateGuardianModel {
    firstName: string;
    middleName?: string;
    lastName: string;
    phone?: string;
    email?: string;
    relationshipToStudent: string;
    isPrimary: boolean;
}

export class CreateGuardianModel implements ICreateGuardianModel {
    firstName: string;
    middleName?: string;
    lastName: string;
    phone?: string;
    email?: string;
    relationshipToStudent: string;
    isPrimary: boolean;
    constructor() {
        this.firstName = "";
        this.middleName = "";
        this.lastName = "";
        this.phone = "";
        this.email = "";
        this.relationshipToStudent = "";
        this.isPrimary = false;
    }

    get formContext(): FormContext<IGuardianDto> {
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
                relationshipToStudent: z.string().nonempty(),
                isPrimary: z.boolean(),
            })
        );
        return useForm<IGuardianDto>({
            validationSchema: formSchema,
            initialValues: {
                firstName: "",
                middleName: "",
                lastName: "",
                phone: "",
                email: "",
                relationshipToStudent: "",
                isPrimary: false,
            },
        });
    }

    validate() {
        this.formContext.validate();
    }

    get jsonRequest() {
        const json = {
            firstName: this.firstName,
            middleName: this.middleName === "" ? null : this.middleName,
            lastName: this.lastName,
            phone: this.phone === "" ? null : this.phone,
            email: this.email === "" ? null : this.email,
            relationshipToStudent: this.relationshipToStudent,
            isPrimary: this.isPrimary,
        };
        return json;
    }
}
