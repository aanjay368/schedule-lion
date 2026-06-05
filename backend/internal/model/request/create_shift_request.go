package request

import "gorm.io/datatypes"

type CreateShiftRequest struct {
	Name         string         `json:"name" validate:"required,alphaspace,min=4,max=50,unique_shift_name"`
	Code         string         `json:"code" validate:"required,alphanum,max=10,unique_shift_code"`
	StartTime    *datatypes.Time `json:"start_time" validate:"required"`
	EndTime      *datatypes.Time `json:"end_time" validate:"is_last_flight=IsLastFlight"`
	IsLastFlight bool           `json:"is_last_flight"`
	DivisionID   int            `json:"division_id" validate:"required,exist_division"`
	PositionID   int            `json:"position_id" validate:"required,exist_position,sync_division_position=DivisionID"`
}
