import { useForm, type FormContext } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

export interface ILoginModel {
    username: string,
    password: string
}

export class LoginModel implements ILoginModel {
    username: string;
    password: string;

    constructor(json: ILoginModel) {
        this.username = json.username;
        this.password = json.password;
    }

    getForm(): FormContext<ILoginModel> {
        const formSchema = toTypedSchema(z.object({
            username: z.string(),
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
                username: this.username || '',
                password: this.password || ''
            }
        });
    }
}