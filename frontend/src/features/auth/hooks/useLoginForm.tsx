import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';

import { useAuth } from '@/context/AuthContext';
import { loginSchema, type LoginFormValues } from '../schemas/auth.schema';
import type { UserRole } from '@/model/user.model';

const ROLE_REDIRECT: Record<UserRole, string> = {
    admin:  '/admin/dashboard',
    leader: '/leader/dashboard',
    staff:  '/staff/dashboard',
};

const parseApiError = (err: unknown): {
    fieldErrors: Partial<Record<keyof LoginFormValues, string>>;
    message: string | null;
} => {
    // bukan axios error — kemungkinan network error
    if (!isAxiosError(err)) {
        return { fieldErrors: {}, message: 'Terjadi kesalahan. Silakan coba lagi.' };
    }

    const apiError = err.response?.data?.error;

    // tidak ada error dari backend
    if (!apiError) {
        return { fieldErrors: {}, message: 'Terjadi kesalahan pada server.' };
    }

    // error berupa pesan string biasa
    if (typeof apiError === 'string') {
        return { fieldErrors: {}, message: apiError };
    }

    // error berupa field validation map: { username: '...', password: '...' }
    if (typeof apiError === 'object' && apiError !== null) {
        // Jika ada nested errors
        if ('errors' in apiError && typeof apiError.errors === 'object' && apiError.errors !== null) {
            return { fieldErrors: apiError.errors as Record<string, string>, message: null };
        }
        // Jika langsung berupa key-value map
        return { fieldErrors: apiError as Record<string, string>, message: null };
    }

    return { fieldErrors: {}, message: 'Terjadi kesalahan.' };
};

export const useLoginForm = () => {
    const navigate = useNavigate();
    const { login, isLoading } = useAuth();
    const [serverError, setServerError] = useState<string | null>(null);

    const form = useForm<LoginFormValues>({
        resolver: yupResolver(loginSchema),
        defaultValues: {
            username: localStorage.getItem('remembered_username') ?? '',
            password: '',
            rememberMe: !!localStorage.getItem('remembered_username'),
        },
    });

    const onSubmit = form.handleSubmit(async (data: LoginFormValues) => {        
        setServerError(null);

        try {
            const user = await login(data.username, data.password);
            if (data.rememberMe) {
                localStorage.setItem('remembered_username', data.username);
            } else {
                localStorage.removeItem('remembered_username');
            }
            const redirect = ROLE_REDIRECT[user.role as UserRole] ?? '/dashboard';            
            navigate(redirect);
        } catch (err) {
            const { fieldErrors, message } = parseApiError(err);

            // set error per field jika ada
            (Object.keys(fieldErrors) as (keyof LoginFormValues)[]).forEach((field) => {
                form.setError(field, {
                    type: 'server',
                    message: fieldErrors[field],
                });
            });

            // set pesan error umum jika ada
            if (message) setServerError(message);
        }
    });

    return {
        form,
        onSubmit,
        isLoading,
        serverError,
    };
};