import api from '@/lib/axios';
import type { DivisionResponse } from '@/model/division.model';

export const divisionService = {
    getAll: async (): Promise<DivisionResponse[]> => {
        const { data } = await api.get<{ data: DivisionResponse[] }>('/divisions');
        return data.data;
    },
};