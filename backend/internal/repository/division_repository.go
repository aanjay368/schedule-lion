package repository

import (
	"log"

	"github.com/aanjay368/schedule-lion/backend/internal/entity"
	"gorm.io/gorm"
)

type DivisionRepository interface {	
	FindAll(db *gorm.DB) ([]entity.Division, error)
	FindByID(db *gorm.DB, divisionId int) (*entity.Division, error)	
}

type DivisionRepositoryImpl struct {
	
}

func (repository *DivisionRepositoryImpl) FindAll(db *gorm.DB) ([]entity.Division, error) {
	var divisions []entity.Division	
	err := db.Preload("Positions").Find(&divisions).Error
	log.Println("divisions", divisions)
	return divisions, err
}
	
func (repository *DivisionRepositoryImpl) FindByID(db *gorm.DB, divisionId int) (*entity.Division, error) {
	var division entity.Division
	err := db.Model(&division).Preload("Positions").Take(&division, "id = ?", divisionId).Error
	return &division, err
}
