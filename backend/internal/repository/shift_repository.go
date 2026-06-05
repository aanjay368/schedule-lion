package repository

import (
	"github.com/aanjay368/schedule-lion/backend/internal/entity"
	"github.com/aanjay368/schedule-lion/backend/internal/model/request"
	"gorm.io/gorm"
)

type ShiftRepository interface {
	FindById(db *gorm.DB, id int) (*entity.Shift, error)
	Save(db *gorm.DB, shift *entity.Shift) error
	Delete(db *gorm.DB, shift *entity.Shift) error
	FindAll(db *gorm.DB, request *request.QueryShiftRequest) ([]entity.Shift, error)
}

type ShiftRepositoryImpl struct {
	
}

func (repository *ShiftRepositoryImpl) FindById(db *gorm.DB, id int) (*entity.Shift, error) {
	var shift entity.Shift
	err := db.Take(&shift, "id = ?", id).Error
	return &shift, err
}

func (repository *ShiftRepositoryImpl) Save(db *gorm.DB, shift *entity.Shift) error {
	return db.Save(shift).Error
}

func (repository *ShiftRepositoryImpl) Delete(db *gorm.DB, shift *entity.Shift) error {
	return db.Delete(shift).Error
}

func (repository *ShiftRepositoryImpl) FindAll(db *gorm.DB, request *request.QueryShiftRequest) ([]entity.Shift, error) {
	var shifts []entity.Shift
	err := db.Joins("Division").Joins("Position").Where("division_id = ? AND position_id = ?", request.DivisionID, request.PositionID).Find(&shifts).Error
	return shifts, err
}
