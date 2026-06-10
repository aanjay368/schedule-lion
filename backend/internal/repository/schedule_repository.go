package repository

import (
	"log"

	"github.com/aanjay368/schedule-lion/backend/internal/entity"
	"github.com/aanjay368/schedule-lion/backend/internal/model/request"
	"gorm.io/gorm"
)

type ScheduleRepository interface {
	SaveAll(db *gorm.DB, schedules []entity.Schedule) error
	DeleteByMetadata(db *gorm.DB, divisionID int, positionID int, month int, year int) error
	ExistsByMetadata(db *gorm.DB, divisionID int, positionID int, month int, year int) (bool, error)
	FindByMetadata(db *gorm.DB, divisionID int, positionID int, month int, year int) ([]entity.Schedule, error)
	DeleteByIDs(db *gorm.DB, ids []string) error
	FindWithRelations(db *gorm.DB, request request.QueryScheduleRequest) ([]entity.Schedule, error)
}

type ScheduleRepositoryImpl struct{}

func (repository *ScheduleRepositoryImpl) SaveAll(db *gorm.DB, schedules []entity.Schedule) error {
	return db.CreateInBatches(&schedules, 100).Error
}

func (repository *ScheduleRepositoryImpl) DeleteByMetadata(db *gorm.DB, divisionID int, positionID int, month int, year int) error {
	return db.Where("division_id = ? AND position_id = ? AND MONTH(date) = ? AND YEAR(date) = ?", divisionID, positionID, month, year).Delete(&entity.Schedule{}).Error
}

func (repository *ScheduleRepositoryImpl) ExistsByMetadata(db *gorm.DB, divisionID int, positionID int, month int, year int) (bool, error) {
	var count int64
	err := db.Where("division_id = ? AND position_id = ? AND MONTH(date) = ? AND YEAR(date) = ?", divisionID, positionID, month, year).Count(&count).Error
	return count > 0, err
}

func (repository *ScheduleRepositoryImpl) FindByMetadata(db *gorm.DB, divisionID int, positionID int, month int, year int) ([]entity.Schedule, error) {
	var schedules []entity.Schedule
	err := db.Where("division_id = ? AND position_id = ? AND MONTH(date) = ? AND YEAR(date) = ?", divisionID, positionID, month, year).Find(&schedules).Error
	return schedules, err
}

func (repository *ScheduleRepositoryImpl) DeleteByIDs(db *gorm.DB, ids []string) error {
	return db.Where("id IN ?", ids).Delete(&entity.Schedule{}).Error
}

func (repository *ScheduleRepositoryImpl) FindWithRelations(db *gorm.DB, request request.QueryScheduleRequest) ([]entity.Schedule, error) {
	var schedules []entity.Schedule
	query := db.Preload("Owner").
		Preload("Owner.Division").
		Preload("Owner.Position").
		Preload("Filler.Division").
		Preload("Filler.Position").		
		Preload("Shift").
		Preload("Shift.Division").
		Preload("Shift.Position").		
		Where("division_id = ? AND position_id = ? AND date = ?", request.DivisionID, request.PositionID, request.Date.Format("2006-01-02"));
		log.Println("shiftID : ", request.ShiftID)
		if request.ShiftID != 0 {
			query = query.Where("shift_id = ?", request.ShiftID)
		}
	err := query.Find(&schedules).Error
	return schedules, err
}
