package handler

import (
	"log"
	"strconv"

	"github.com/aanjay368/schedule-lion/backend/internal/model/request"
	"github.com/aanjay368/schedule-lion/backend/internal/model/response"
	"github.com/aanjay368/schedule-lion/backend/internal/service"
	"github.com/gofiber/fiber/v3"
)

type ShiftHandler interface {
	Create(c fiber.Ctx) error
	Update(c fiber.Ctx) error
	Delete(c fiber.Ctx) error
	GetAll(c fiber.Ctx) error
}

type ShiftHandlerImpl struct {
	ShiftService service.ShiftService
}

func (handler *ShiftHandlerImpl) Create(c fiber.Ctx) error {
	var request request.CreateShiftRequest	
	
	if err := c.Bind().Body(&request); err != nil {
		log.Println(err)
		return err
	}	

	shiftResponse, err := handler.ShiftService.Create(&request)
	if err != nil {
		return err
	}
	
	return c.JSON(response.ApiResponse{
		Data: shiftResponse,
	})
}

func (handler *ShiftHandlerImpl) Update(c fiber.Ctx) error {

	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid shift ID")
	}

	request := request.UpdateShiftRequest{ID: id}
	if err := c.Bind().Body(&request); err != nil {
		return err
	}
	
	shiftResponse, err := handler.ShiftService.Update(&request)
	if err != nil {
		return err
	}
	
	return c.JSON(response.ApiResponse{
		Data: shiftResponse,
	})

}

func (handler *ShiftHandlerImpl) Delete(c fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid shift ID")
	}

	shiftResponse, err := handler.ShiftService.Delete(id)
	if err != nil {
		return err
	}
	
	return c.JSON(response.ApiResponse{
		Data: shiftResponse,
	})
}

func (handler *ShiftHandlerImpl) GetAll(c fiber.Ctx) error {

	var request request.QueryShiftRequest
	if err := c.Bind().Query(&request); err != nil {
		return err
	}

	shiftResponses, err := handler.ShiftService.GetAll(&request)
	if err != nil {
		return err
	}

	return c.JSON(response.ApiResponse{
		Data: shiftResponses,
	})
}