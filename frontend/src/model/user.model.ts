import type { EmployeeResponse } from "./employee.model";

export type UserRole = 'admin' | 'leader' | 'staff';

export interface UserResponse {
    id: string;
    username: string;
    role: string;
    employee: EmployeeResponse;
}