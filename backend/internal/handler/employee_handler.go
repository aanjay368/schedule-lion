package handler

import (
	"math"
	"github.com/aanjay368/schedule-lion/backend/internal/model/request"
	"github.com/aanjay368/schedule-lion/backend/internal/model/response"
	"github.com/aanjay368/schedule-lion/backend/internal/service"
	"github.com/gofiber/fiber/v3"
)

type EmployeeHandler interface {
	CreateEmployee(c fiber.Ctx) error
	GetAllEmployees(c fiber.Ctx) error
	SearchEmployees(c fiber.Ctx) error
	UpdateEmployee(c fiber.Ctx) error
	DeleteEmployee(c fiber.Ctx) error
}

type EmployeeHandlerImpl struct {
	EmployeeService service.EmployeeService
}

func (handler *EmployeeHandlerImpl) CreateEmployee(c fiber.Ctx) error {
	var request request.CreateEmployeeRequest
	if err := c.Bind().Body(&request); err != nil {	
		return fiber.NewError(fiber.StatusBadRequest, "Invalid request body")
	}

	employeeResponse, err := handler.EmployeeService.CreateEmployee(request)
	if err != nil {
		return err
	}

	return c.Status(fiber.StatusCreated).JSON(response.ApiResponse{
		Data: employeeResponse,
	})
}

func (handler *EmployeeHandlerImpl) GetAllEmployees(c fiber.Ctx) error {
	employees, err := handler.EmployeeService.GetAllEmployees()
	if err != nil {
		return err
	}

	return c.JSON(response.ApiResponse{
		Data: employees,
	})
}

func (handler *EmployeeHandlerImpl) SearchEmployees(c fiber.Ctx) error {
	request := request.SearchEmployeeRequest{
		Page: 1,
		Limit: 10,
	}
	if err := c.Bind().Query(&request); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid request param")
	}	

	employees, total, err := handler.EmployeeService.SearchEmployee(&request)
	if err != nil {
		return err
	}

	return c.JSON(response.ApiResponse{
		Data: employees,
		Page: &response.PaginationResponse{
			Total: total,
			Limit: request.Limit,
			Page:  request.Page,	
			TotalPages: int(math.Ceil(float64(total) / float64(request.Limit))),
		},
	})
}

func (handler *EmployeeHandlerImpl) UpdateEmployee(c fiber.Ctx) error {
	var request request.UpdateEmployeeRequest
	id := c.Params("id")
	request.ID = id
	if err := c.Bind().Body(&request); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid request body")
	}

	employeeResponse, err := handler.EmployeeService.UpdateEmployee(request)
	if err != nil {
		return err
	}

	return c.JSON(response.ApiResponse{
		Data: employeeResponse,
	})
}

func (handler *EmployeeHandlerImpl) DeleteEmployee(c fiber.Ctx) error {
	id := c.Params("id")
	err := handler.EmployeeService.DeleteEmployee(id)
	if err != nil {
		return err
	}

	return c.Res().SendStatus(fiber.StatusOK)
}
