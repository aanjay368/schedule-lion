package request

import "mime/multipart"

type ScheduleUploadRequest struct {
	DivisionID int                   `form:"division_id" validate:"required"`
	PositionID int                   `form:"position_id" validate:"required"`
	Month      int                   `form:"month" validate:"required,min=1,max=12"`
	Year       int                   `form:"year" validate:"required"`
	File       *multipart.FileHeader `form:"file" validate:"required"`
}
