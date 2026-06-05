import type { DivisionResponse } from './division.model';
import type { PositionResponse } from './position.model';

export interface ShiftResponse {
    id: number;
    name: string;
    code: string;
    start_time: string | null; // Format "HH:mm" atau null
    end_time: string | null;   // Format "HH:mm" atau null
    is_read_only: boolean;
    division: DivisionResponse;
    position: PositionResponse;
}

export interface CreateShiftRequest {
    name: string;
    code: string;
    start_time?: string | null;
    end_time?: string | null;
    is_last_flight?: boolean;
    division_id: number;
    position_id: number;
}

export interface UpdateShiftRequest {
    name?: string;
    code?: string;
    start_time?: string | null;
    end_time?: string | null;
    is_last_flight?: boolean;
    division_id?: number;
    position_id?: number;
}

export type ShiftParams = {
    search?: string;
    division_id?: number;
    position_id?: number;
    page?: number;
    limit?: number;
};
