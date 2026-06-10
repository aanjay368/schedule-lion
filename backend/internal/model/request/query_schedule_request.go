package request

import "time"

type QueryScheduleRequest struct {
	DivisionID int        `query:"division_id" validate:"required"`
	PositionID int        `query:"position_id" validate:"required"`
	ShiftID    int        `query:"shift_id"`
	Date       *time.Time `query:"date" validate:"required"`
}
