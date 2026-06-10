package service

import (
	"errors"
	"log"
	"strings"

	"github.com/aanjay368/schedule-lion/backend/internal/config"
	"github.com/aanjay368/schedule-lion/backend/internal/mapper"
	"github.com/aanjay368/schedule-lion/backend/internal/model/request"
	"github.com/aanjay368/schedule-lion/backend/internal/model/response"
	"github.com/aanjay368/schedule-lion/backend/internal/pkg"
	"github.com/aanjay368/schedule-lion/backend/internal/repository"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v3"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type AuthService interface {
	Login(request request.LoginRequest) (*response.UserResponse, string, string, error)
	Refresh(refreshToken string) (string, string, error)
}

type AuthServiceImpl struct {
	UserRepository repository.UserRepository
	Config         *config.Config
	DB             *gorm.DB
	Validator      *validator.Validate
}

func (service *AuthServiceImpl) Login(request request.LoginRequest) (*response.UserResponse, string, string, error) {	
	if err := service.Validator.Struct(request); err != nil {
		return nil, "", "", err
	}
	user, err := service.UserRepository.FindByUsername(service.DB, request.Username)
	if err != nil {
		log.Println("Login error:", err.Error())
		return nil, "", "", fiber.NewError(fiber.StatusUnauthorized, "Username atau Password salah")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(request.Password)); err != nil {
		log.Println("Password mismatch:", err.Error())
		return nil, "", "", fiber.NewError(fiber.StatusUnauthorized, "Username atau Password salah")
	}
	
	role := strings.ToLower(user.Employee.Position.Name)
	if user.Employee != nil && user.Employee.Position != nil {
		role = user.Employee.Position.Name
	}

	accessToken, refreshToken, err := pkg.GenerateTokens(user.ID.String(), user.Username, role, service.Config.JWTSecret)
	if err != nil {
		return nil, "", "", err
	}

	userResponse := mapper.ToUserResponse(user, role)

	return &userResponse, accessToken, refreshToken, nil
}

func (service *AuthServiceImpl) Refresh(refreshToken string) (string, string, error) {
	claims, err := pkg.ValidateRefreshToken(refreshToken, service.Config.JWTSecret)
	if err != nil {
		return "", "", errors.New("invalid refresh token")
	}

	user, err := service.UserRepository.FindByID(service.DB, claims.UserID)
	if err != nil {
		log.Println("Refresh token user lookup error:", err.Error())
		return "", "", errors.New("user not found")
	}
	
	role := user.Employee.Position.Name
	if user.Employee != nil && user.Employee.Position != nil {
		role = user.Employee.Position.Name
	}

	at, rt, err := pkg.GenerateTokens(user.ID.String(), user.Username, role, service.Config.JWTSecret)
	log.Println("Refresh token generated:", at, rt)
	if err != nil {
		return "", "", err
	}

	return at, rt, nil
}
