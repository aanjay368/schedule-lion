import * as yup from 'yup';

export const shiftSchema = yup.object({
    name: yup.string()
        .required('Nama shift wajib diisi')
        .min(3, 'Nama shift minimal 3 karakter')
        .max(50, 'Nama shift maksimal 50 karakter'),
    code: yup.string()
        .required('Kode/Label wajib diisi')
        .max(5, 'Kode/Label maksimal 5 karakter'),
    start_time: yup.string()
        .nullable()
        .notRequired()
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
            message: 'Format jam mulai harus HH:mm (contoh: 08:00)',
            excludeEmptyString: true,
        }),
    end_time: yup.string()
        .nullable()
        .notRequired()
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
            message: 'Format jam selesai harus HH:mm (contoh: 17:00)',
            excludeEmptyString: true,
        }),
    is_last_flight: yup.boolean().default(false),
    division_id: yup.number().transform((value) => Number(value || 0)).required('Divisi wajib diisi').notOneOf([0], 'Divisi wajib diisi'),
    position_id: yup.number().transform((value) => Number(value || 0)).required('Posisi wajib diisi').notOneOf([0], 'Posisi wajib diisi'),
});

export type ShiftFormValues = yup.InferType<typeof shiftSchema>;
