package request

type QueryShiftRequest struct {
	DivisionID int `query:"division_id" validate:"required,exist_division"`
	PositionID int `query:"position_id" validate:"required,exist_position,sync_division_position=DivisionID"`
}
