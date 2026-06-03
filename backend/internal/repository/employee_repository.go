package repository

import (
	"github.com/aanjay368/schedule-lion/backend/internal/entity"
	"github.com/aanjay368/schedule-lion/backend/internal/model/request"
	"gorm.io/gorm"
)

type EmployeeRepository interface {
	Save(db *gorm.DB, employee *entity.Employee) error
	FindByNickname(db *gorm.DB, nickname string) (*entity.Employee, error)
	FindByID(db *gorm.DB, id string) (*entity.Employee, error)
	FindAll(db *gorm.DB) ([]entity.Employee, error)
	Search(db *gorm.DB, request *request.SearchEmployeeRequest) ([]entity.Employee, int64, error)
	Delete(db *gorm.DB, employee *entity.Employee) error
}

type EmployeeRepositoryImpl struct{}

func (repository *EmployeeRepositoryImpl) Save(db *gorm.DB, employee *entity.Employee) error {
	return db.Save(employee).Error
}

func (repository *EmployeeRepositoryImpl) FindByNickname(db *gorm.DB, nickname string) (*entity.Employee, error) {
	var employee entity.Employee
	err := db.Where("nickname = ?", nickname).Take(&employee).Error
	if err != nil {
		return nil, err
	}
	return &employee, nil
}

func (repository *EmployeeRepositoryImpl) FindByID(db *gorm.DB, id string) (*entity.Employee, error) {
	var employee entity.Employee
	err := db.Where("employees.id = ?", id).Joins("Division").Joins("Position").Joins("User").Take(&employee).Error
	if err != nil {
		return nil, err
	}
	return &employee, nil
}

func (repository *EmployeeRepositoryImpl) FindAll(db *gorm.DB) ([]entity.Employee, error) {
	var employees []entity.Employee
	err := db.Preload("Division").Preload("Position").Find(&employees).Error
	if err != nil {
		return nil, err
	}
	return employees, nil
}

func (repository *EmployeeRepositoryImpl) Delete(db *gorm.DB, employee *entity.Employee) error {
	return db.Delete(employee).Association("User").Error
}

func (repository *EmployeeRepositoryImpl) Search(
	db *gorm.DB,
	request *request.SearchEmployeeRequest,
) ([]entity.Employee, int64, error) {
	var employees []entity.Employee
	var total int64
	
	query := db.Model(&entity.Employee{}).
		Preload("Division").
		Preload("Position")
	
	if request.Name != "" {
		search := "%" + request.Name + "%"
		query = query.Where(
			"full_name LIKE ? OR nickname LIKE ?",
			search, search,
		)
	}

	if request.DivisionID != 0 {
		query = query.Where("division_id = ?", request.DivisionID)
	}

	if request.PositionID != 0 {
		query = query.Where("position_id = ?", request.PositionID)
	}

	if request.ShowDeleted {
		query = query.Unscoped()
	}
	
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	offset := (request.Page - 1) * request.Limit

	if err := query.Limit(request.Limit).Offset(int(offset)).Find(&employees).Error; err != nil {
		return nil, 0, err
	}

	return employees, total, nil
}
