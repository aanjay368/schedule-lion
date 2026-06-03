package pkg

import (
	"github.com/aanjay368/schedule-lion/backend/internal/exception"
	"github.com/gofiber/fiber/v3"
)

// NewFiberApp creates a new Fiber application with standard configuration.
func NewFiberApp(handler *exception.ExceptionHandler) *fiber.App {
	return fiber.New(fiber.Config{
		AppName:      "Schedule Lion Backend v1.0",
		BodyLimit:    10 * 1024 * 1024,
		ErrorHandler: handler.Handler,
	})
}