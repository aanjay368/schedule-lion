package handler

import (
	"github.com/aanjay368/schedule-lion/backend/internal/model/response"
	"github.com/aanjay368/schedule-lion/backend/internal/service"
	"github.com/gofiber/fiber/v3"
)

type DivisionHandler interface {
	GetAllDivisions(ctx fiber.Ctx) error
}

type DivisionHandlerImpl struct {
	DivisionService service.DivisionService
}

func (handler *DivisionHandlerImpl) GetAllDivisions(ctx fiber.Ctx) error {
	divisionsResponse, err := handler.DivisionService.GetAllDivisions()
	if err != nil {
		return err 
	}

	return ctx.JSON(response.ApiResponse{
		Data: divisionsResponse,
	})
}
