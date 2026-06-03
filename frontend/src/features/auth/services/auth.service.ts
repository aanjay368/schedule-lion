import api from '@/lib/axios';
import type { UserResponse } from '@/model/user.model';

export const authService = {
    login: async (username: string, password: string): Promise<UserResponse> => {
        const { data } = await api.post<{ data: UserResponse }>('/auth/login', {
            username,
            password,
        });
        return data.data;
    },

    logout: async (): Promise<void> => {
        await api.post('/auth/logout');
    },

    getCurrentUser: async (): Promise<UserResponse | null> => {
        try {
			const { data } = await api.get<{ data: UserResponse }>('/users/current');			
            return data.data;
        } catch {
            return null;
        }
    },
};