package request

type SearchEmployeeRequest struct {
	Name        string `query:"name"`
	DivisionID  int    `query:"division_id"`
	PositionID  int    `query:"position_id"`
	ShowDeleted bool   `query:"show_deleted"`
	Page        int    `query:"page"`
	Limit       int    `query:"limit"`
}
