package exception

import "fmt"

// AppError represents a structured application error with HTTP status code.
type AppError struct {
	Code    int               `json:"-"`
	Message string            `json:"message"`
	Errors  map[string]string `json:"errors,omitempty"`
}

func (e *AppError) Error() string {
	return fmt.Sprintf("AppError %d: %s", e.Code, e.Message)
}

// NewAppError creates a new AppError with status code and message.
func NewAppError(code int, message string) *AppError {
	return &AppError{
		Code:    code,
		Message: message,
	}
}

func NewValidationError(errors map[string]string) *AppError {
	return &AppError{
		Code:    400,
		Message: "Validation failed",
		Errors:  errors,
	}
}
