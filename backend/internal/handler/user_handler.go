package handler

import (
	"github.com/aanjay368/schedule-lion/backend/internal/model/response"
	"github.com/aanjay368/schedule-lion/backend/internal/service"
	"github.com/gofiber/fiber/v3"
)

type UserHandler interface {
	GetCurrent(ctx fiber.Ctx) error
}

// UserHandlerImpl is the implementation of UserHandler.
type UserHandlerImpl struct {
	UserService service.UserService
}

func (handler *UserHandlerImpl) GetCurrent(ctx fiber.Ctx) error {
	userID, ok := ctx.Locals("user_id").(string)
	if !ok || userID == "" {
		return fiber.NewError(fiber.StatusUnauthorized, "User ID not found in token")
	}

	userResponse, err := handler.UserService.GetCurrent(userID)
	if err != nil {
		return err
	}

	return ctx.JSON(response.ApiResponse{
		Data: userResponse,
	})
}