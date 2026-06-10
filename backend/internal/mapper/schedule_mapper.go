package mapper

import (
	"time"

	"github.com/aanjay368/schedule-lion/backend/internal/entity"
	"github.com/aanjay368/schedule-lion/backend/internal/model/response"
	"github.com/jinzhu/copier"
)

func ToScheduleResponse(sc *entity.Schedule) response.ScheduleResponse {
	var resp response.ScheduleResponse
	_ = copier.Copy(&resp, sc)

	resp.ID = sc.ID.String()
	resp.Date = time.Time(sc.Date).Format("02-01-2006")

	if sc.OwnerID != nil {
		str := sc.OwnerID.String()
		resp.OwnerID = &str
	}

	if sc.Owner != nil {
		empResp := ToEmployeeResponse(sc.Owner)
		resp.Owner = &empResp
	}

	if sc.Shift != nil {
		shiftResp := ToShiftResponse(sc.Shift)
		resp.Shift = &shiftResp
	}

	return resp
}

func ToScheduleResponses(schedules []entity.Schedule) []response.ScheduleResponse {
	responses := make([]response.ScheduleResponse, 0, len(schedules))
	for _, sc := range schedules {
		responses = append(responses, ToScheduleResponse(&sc))
	}
	return responses
}
