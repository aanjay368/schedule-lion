package response

type EmployeeResponse struct {
	ID        string           `json:"id"`
	Nickname  string           `json:"nickname"`
	FullName  string           `json:"fullname"`
	Division  DivisionResponse `json:"division"`
	Position  PositionResponse `json:"position"`
	IsDeleted bool             `json:"is_deleted"`
}
