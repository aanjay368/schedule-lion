package response

type ScheduleResponse struct {
	ID         string            `json:"id"`
	Date       string    `json:"date"`
	ShiftID    int               `json:"shift_id"`
	Shift      *ShiftResponse    `json:"shift,omitempty"`
	DivisionID int               `json:"division_id"`
	PositionID int               `json:"position_id"`
	OwnerID    *string           `json:"owner_id"`
	Owner      *EmployeeResponse `json:"owner,omitempty"`
}
