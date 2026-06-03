import * as yup from 'yup';

export const loginSchema = yup.object({
    username: yup.string().required('Username wajib diisi'),
    password: yup.string().required('Password wajib diisi'),
    rememberMe: yup.boolean().optional(),
});

export type LoginFormValues = yup.InferType<typeof loginSchema>;