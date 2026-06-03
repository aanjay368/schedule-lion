package exception

import (
	"errors"	
	"github.com/aanjay368/schedule-lion/backend/internal/model/response"
	ut "github.com/go-playground/universal-translator"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v3"
)

type ExceptionHandler struct {
	Validate   *validator.Validate
	Translator ut.Translator
}

func (handler *ExceptionHandler) Handler(c fiber.Ctx, err error) error {

	var appErr *AppError
	if errors.As(err, &appErr) {
		return c.Status(appErr.Code).JSON(response.ApiResponse{
			Error: fiber.Map{
				"message": appErr.Message,
				"errors":  appErr.Errors,
			},
		})
	}

	if exception, ok := err.(*fiber.Error); ok {
		return c.Status(exception.Code).JSON(response.ApiResponse{
			Error: exception.Error(),
		})
	}	

	if exception, ok := err.(validator.ValidationErrors); ok {

		jsonError := make(map[string]string)
		for _, fieldError := range exception {
			field := fieldError.Field()
			jsonError[field] = fieldError.Translate(handler.Translator)
		}

		return c.Status(fiber.ErrBadRequest.Code).JSON(response.ApiResponse{
			Error: jsonError,
		})
	}

	return c.Status(fiber.ErrInternalServerError.Code).JSON(response.ApiResponse{
		Error: fiber.Map{
			"message": "Internal server error",
		},
	})
}
