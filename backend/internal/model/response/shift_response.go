package response

import "gorm.io/datatypes"

type ShiftResponse struct {
	ID         int              `json:"id"`
	Name       string           `json:"name"`
	Code       string           `json:"code"`
	StartTime  *datatypes.Time   `json:"start_time"`
	EndTime    *datatypes.Time   `json:"end_time"`
	IsReadOnly bool             `json:"is_read_only"`
	Division   DivisionResponse `json:"division"`
	Position   PositionResponse `json:"position"`
	CreatedAt  string           `json:"created_at"`
	UpdatedAt  string           `json:"updated_at"`
}
