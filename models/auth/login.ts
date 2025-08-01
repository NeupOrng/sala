import { useForm, type FormContext } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

export interface ILoginModel {
    email: string,
    password: string
}

export class LoginModel implements ILoginModel {
    email: string;
    password: string;

    constructor(json: ILoginModel) {
        this.email = json.email;
        this.password = json.password;
    }

    getForm(): FormContext<ILoginModel> {
        const formSchema = toTypedSchema(z.object({
            email: z.string().email('Please enter a valid email address'),
            password: z.string()
                .min(8, 'Password must be at least 8 characters long')
                .regex(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
                    'Password must include uppercase, lowercase, number, and special character'
                )
        }));
        return useForm<ILoginModel>({
            validationSchema: formSchema,
            initialValues: {
                email: this.email || '',
                password: this.password || ''
            }
        });
    }
}