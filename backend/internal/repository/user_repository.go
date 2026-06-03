package repository

import (
	"github.com/aanjay368/schedule-lion/backend/internal/entity"
	"gorm.io/gorm"
)

// UserRepository defines the contract for user data access.
type UserRepository interface {
	FindByUsername(db *gorm.DB, username string) (*entity.User, error)
	FindByID(db *gorm.DB, userID string) (*entity.User, error)
}

// UserRepositoryImpl is the GORM-based implementation of UserRepository.
type UserRepositoryImpl struct{}

func (repository *UserRepositoryImpl) FindByUsername(db *gorm.DB, username string) (*entity.User, error) {
	var user entity.User
	err := db.Joins("Employee").Joins("Employee.Division").Joins("Employee.Position").Take(&user, "username = ?", username).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (repository *UserRepositoryImpl) FindByID(db *gorm.DB, userID string) (*entity.User, error) {
	var user entity.User
	err := db.Joins("Employee").Joins("Employee.Division").Joins("Employee.Position").Take(&user, "users.id = ?", userID).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}
