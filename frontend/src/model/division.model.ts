import type { PositionResponse } from "./position.model";

export interface DivisionResponse {
	id: number;
	name: string;
	positions?: PositionResponse[]
}