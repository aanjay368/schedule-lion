package handler

import (
	"github.com/aanjay368/schedule-lion/backend/internal/model/request"
	"github.com/aanjay368/schedule-lion/backend/internal/model/response"
	"github.com/aanjay368/schedule-lion/backend/internal/service"
	"github.com/gofiber/fiber/v3"
)

type ScheduleHandler interface {
	UploadSchedule(c fiber.Ctx) error
	GetSchedules(c fiber.Ctx) error
}

type ScheduleHandlerImpl struct {
	ScheduleService service.ScheduleService
}

func (h *ScheduleHandlerImpl) UploadSchedule(c fiber.Ctx) error {
	
	var request request.ScheduleUploadRequest
	if err := c.Bind().Form(&request); err != nil {		
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	if err := h.ScheduleService.UploadSchedule(request); err != nil {
		return err
	}

	return c.JSON(response.ApiResponse{
		Data: "Jadwal karyawan berhasil disimpan ke server",
	})
}

func (h *ScheduleHandlerImpl) GetSchedules(c fiber.Ctx) error {
	var req request.QueryScheduleRequest
	if err := c.Bind().Query(&req); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	res, err := h.ScheduleService.GetSchedules(req)
	if err != nil {
		return err
	}

	return c.JSON(response.ApiResponse{
		Data: res,
	})
}
