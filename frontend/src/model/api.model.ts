export interface ApiResponse<T> {
    data?: T;    
    error?: {
        message: string;
        errors?: Record<string, string>;
    };
    pagination?: PaginatedResponse | null;
}

export interface PaginatedResponse {
    page:        number;
    limit:       number;
    total:       number;
    total_pages: number;
}