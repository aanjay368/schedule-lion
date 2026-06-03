package handler

import (
	"log"
	"time"

	"github.com/aanjay368/schedule-lion/backend/internal/model/request"
	"github.com/aanjay368/schedule-lion/backend/internal/model/response"
	"github.com/aanjay368/schedule-lion/backend/internal/service"
	"github.com/gofiber/fiber/v3"
)

// AuthHandler defines the contract for authentication HTTP endpoints.
type AuthHandler interface {
	Login(ctx fiber.Ctx) error
	Refresh(ctx fiber.Ctx) error
}

// AuthHandlerImpl is the implementation of AuthHandler.
type AuthHandlerImpl struct {
	AuthService service.AuthService
}

func (handler *AuthHandlerImpl) Login(c fiber.Ctx) error {
	var request request.LoginRequest
	if err := c.Bind().Body(&request); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid request body")
	}

	userResponse, accessToken, refreshToken, err := handler.AuthService.Login(request)
	if err != nil {
		return err
	}

	c.Cookie(&fiber.Cookie{
		Name:     "access_token",
		Value:    accessToken,
		Expires:  time.Now().Add(10 * time.Minute),
		HTTPOnly: true,
		Secure:   false,
	})

	c.Cookie(&fiber.Cookie{
		Name:     "refresh_token",
		Value:    refreshToken,
		Expires:  time.Now().Add(24 * time.Hour),
		HTTPOnly: true,
		Secure:   false,
	})

	return c.JSON(response.ApiResponse{
		Data: userResponse,
	})
}

func (handler *AuthHandlerImpl) Refresh(c fiber.Ctx) error {
	rt := c.Cookies("refresh_token")
	if rt == "" {
		return fiber.NewError(fiber.StatusUnauthorized, "No refresh token provided")
	}

	log.Println("Refresh token:", rt)
	newAt, newRt, err := handler.AuthService.Refresh(rt)
	if err != nil {		
		return fiber.NewError(fiber.StatusUnauthorized, err.Error())
	}

	c.Cookie(&fiber.Cookie{
		Name:     "access_token",
		Value:    newAt,
		Expires:  time.Now().Add(10 * time.Minute),
		HTTPOnly: true,
		Secure:   false,
	})

	c.Cookie(&fiber.Cookie{
		Name:     "refresh_token",
		Value:    newRt,
		Expires:  time.Now().Add(24 * time.Hour),
		HTTPOnly: true,
		Secure:   false,
	})

	return c.JSON(response.ApiResponse{
		Data: fiber.Map{"message": "tokens refreshed"},
	})
}
