import api from '@/lib/axios';
import type { ApiResponse } from '@/model/api.model';
import type {
    ShiftResponse,
    CreateShiftRequest,
    UpdateShiftRequest,
    ShiftParams,
} from '@/model/shift.model';

export const shiftService = {
    getAll: async (params: ShiftParams = {}): Promise<ApiResponse<ShiftResponse[]>> => {
        const { data } = await api.get<{ data: ShiftResponse[] }>('/shifts', {
            params: {
                division_id: params.division_id,
                position_id: params.position_id,
            }
        });

        return {
            data: data.data ?? [],
        };
    },

    create: async (payload: CreateShiftRequest): Promise<ShiftResponse> => {
        const { data } = await api.post<{ data: ShiftResponse }>('/shifts', payload);
        return data.data;
    },

    update: async (id: number, payload: UpdateShiftRequest): Promise<ShiftResponse> => {
        const { data } = await api.put<{ data: ShiftResponse }>(`/shifts/${id}`, payload);
        return data.data;
    },

    remove: async (id: number): Promise<void> => {
        await api.delete(`/shifts/${id}`);
    },
};
