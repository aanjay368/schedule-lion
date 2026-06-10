package response

type ShiftResponse struct {
	ID         int              `json:"id"`
	Name       string           `json:"name"`
	Code       string           `json:"code"`
	StartTime  string           `json:"start_time,omitempty"`
	EndTime    string           `json:"end_time,omitempty"`
	IsReadOnly bool             `json:"is_read_only"`
	Division   DivisionResponse `json:"division"`
	Position   PositionResponse `json:"position"`
	CreatedAt  string           `json:"created_at"`
	UpdatedAt  string           `json:"updated_at"`
}
