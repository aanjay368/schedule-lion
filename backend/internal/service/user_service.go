package service

import (
	"log"
	"strings"

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

	userResponse := response.UserResponse{
		ID:       user.ID.String(),
		Username: user.Username,
		Role:     strings.ToLower(user.Employee.Position.Name),
	}

	if user.Employee != nil {
		userResponse.Employee = response.EmployeeResponse{
			ID:       user.Employee.ID.String(),
			FullName: user.Employee.FullName,
			Nickname: user.Employee.Nickname,
		}
		if user.Employee.Division != nil {
			userResponse.Employee.Division = response.DivisionResponse{
				ID:   user.Employee.Division.ID,
				Name: user.Employee.Division.Name,
			}
		}
		if user.Employee.Position != nil {
			userResponse.Employee.Position = response.PositionResponse{
				ID:   user.Employee.Position.ID,
				Name: user.Employee.Position.Name,
			}
		}
	}

	return &userResponse, nil
}
