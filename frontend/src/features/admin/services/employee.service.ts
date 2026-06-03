import api from '@/lib/axios';
import type { ApiResponse } from '@/model/api.model';
import type { EmployeeParams, EmployeeResponse } from '@/model/employee.model';
import type { EmployeeFormValues } from '../schemas/employee.schema';

export const employeeService = {
    getAll: async (): Promise<EmployeeResponse[]> => {
        const { data } = await api.get<{ data: EmployeeResponse[] }>('/employees');
        return data.data;
    },

    search: async (params: EmployeeParams = {}): Promise<ApiResponse<EmployeeResponse[]>> => {
        const {data} = await api.get<ApiResponse<EmployeeResponse[]>>('/employees/search', {
            params: {
                name: params.search || undefined,                
                division_id: params.division_id || undefined,
                position_id: params.position_id || undefined,
                show_deleted: params.show_deleted,
                page:   params.page   ?? 1,
                limit:  params.limit  ?? 10,
            },
        });
                
        return data;
    },

    create: async (payload: EmployeeFormValues): Promise<EmployeeResponse> => {
        const { data } = await api.post<{ data: EmployeeResponse }>('/employees', payload);
        return data.data;
    },

    update: async (id: string, payload: EmployeeFormValues): Promise<EmployeeResponse> => {
        const { data } = await api.put<{ data: EmployeeResponse }>(`/employees/${id}`, payload);
        return data.data;
    },

    remove: async (id: string): Promise<void> => {
        await api.delete(`/employees/${id}`);
    },
};