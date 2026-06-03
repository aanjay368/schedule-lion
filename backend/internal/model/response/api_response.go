package response

type ApiResponse struct {
	Data  any                `json:"data,omitempty"`
	Error any                `json:"error,omitempty"`
	Page  *PaginationResponse `json:"pagination,omitempty"`
}

type PaginationResponse struct {
	Page       int `json:"page,omitempty"`
	Limit      int `json:"limit,omitempty"`
	Total      int `json:"total,omitempty"`
	TotalPages int `json:"total_pages,omitempty"`
}