package service

import (
	"log"

	"github.com/aanjay368/schedule-lion/backend/internal/mapper"
	"github.com/aanjay368/schedule-lion/backend/internal/model/response"
	"github.com/aanjay368/schedule-lion/backend/internal/repository"
	"github.com/gofiber/fiber/v3"
	"gorm.io/gorm"
)

// UserService defines the contract for user-related operations.
type UserService interface {
	GetCurrent(userID string) (*response.UserResponse, error)
}

// UserServiceImpl is the implementation of UserService.
type UserServiceImpl struct {
	UserRepository repository.UserRepository
	DB             *gorm.DB
}

func (service *UserServiceImpl) GetCurrent(userID string) (*response.UserResponse, error) {
	user, err := service.UserRepository.FindByID(service.DB, userID)
	if err != nil {
		log.Println("GetCurrent error:", err.Error())
		return nil, fiber.NewError(fiber.StatusNotFound, "user not found")
	}

	role := ""
	if user.Employee != nil && user.Employee.Position != nil {
		role = user.Employee.Position.Name
	}

	userResponse := mapper.ToUserResponse(user, role)
	return &userResponse, nil
}
