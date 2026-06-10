package mapper

import (
	"strings"
	"time"
	"github.com/aanjay368/schedule-lion/backend/internal/entity"
	"github.com/aanjay368/schedule-lion/backend/internal/model/response"
	"github.com/jinzhu/copier"
)

func IsReadOnlyShift(shift *entity.Shift) bool {
	if shift == nil {
		return false
	}
	return strings.EqualFold(shift.Code, "L") || strings.EqualFold(shift.Name, "Libur")
}

func ToShiftResponse(shift *entity.Shift) response.ShiftResponse {
	var resp response.ShiftResponse
	_ = copier.Copy(&resp, shift)
	resp.IsReadOnly = IsReadOnlyShift(shift)

	if shift.StartTime != nil {
		parseTime, _ := time.Parse("15:04:05", shift.StartTime.String())		
		resp.StartTime = parseTime.Format("15:04")
	}
	if shift.EndTime != nil {
		parseTime, _ := time.Parse("15:04:05", shift.EndTime.String())
		resp.EndTime = parseTime.Format("15:04")
	}
	resp.CreatedAt = shift.CreatedAt.Format("2006-01-02 15:04:05")
	resp.UpdatedAt = shift.UpdatedAt.Format("2006-01-02 15:04:05")
	
	return resp
}

func ToShiftResponses(shifts []entity.Shift) []response.ShiftResponse {
	responses := make([]response.ShiftResponse, 0, len(shifts))
	for _, shift := range shifts {
		responses = append(responses, ToShiftResponse(&shift))
	}
	return responses
}
