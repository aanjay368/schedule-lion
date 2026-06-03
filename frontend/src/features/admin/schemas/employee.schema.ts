import * as yup from 'yup';

export const employeeSchema = yup.object({
    fullname: yup.string()
    .required('Nama lengkap wajib diisi')
    .min(3, 'Nama lengkap minimal 3 karakter')
    .max(50, 'Nama lengkap maksimal 50 karakter')
    .matches(/^[A-Za-z. ]+$/, 'Nama lengkap hanya boleh mengandung huruf, spasi dan titik saja'),
    nickname: yup.string()
    .required('Nama panggilan wajib diisi')
    .min(3, 'Nama panggilan minimal 3 karakter')
    .max(50, 'Nama panggilan maksimal 50 karakter')
    .matches(/^[A-Za-z ]+$/, 'Nama panggilan hanya boleh mengandung huruf dan spasi saja'),
    division_id: yup.number().transform((value) => Number(value || 0)).required('Divisi wajib diisi').notOneOf([0], 'Divisi wajib diisi'),
    position_id: yup.number().transform((value) => Number(value || 0)).required('Posisi wajib diisi').notOneOf([0], 'Posisi wajib diisi'),    
});

export type EmployeeFormValues = yup.InferType<typeof employeeSchema>;