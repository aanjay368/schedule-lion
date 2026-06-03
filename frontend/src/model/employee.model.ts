import type { DivisionResponse } from "./division.model";
import type { PositionResponse } from "./position.model";

export type EmployeeParams = {
    search?: string;
    division_id?: number;
    position_id?: number;
    show_deleted?: boolean;
    page?:   number;
    limit?:  number;
};


export interface EmployeeResponse {
	id: string;
	nickname: string;
	fullname: string;
	division: DivisionResponse;
	position: PositionResponse;
    is_deleted: boolean;
}