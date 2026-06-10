package service

import (
	"github.com/aanjay368/schedule-lion/backend/internal/mapper"
	"github.com/aanjay368/schedule-lion/backend/internal/model/response"
	"github.com/aanjay368/schedule-lion/backend/internal/repository"
	"gorm.io/gorm"
)

type DivisionService interface {
	GetAllDivisions() ([]response.DivisionResponse, error)
}

type DivisionServiceImpl struct {
	DivisionRepository repository.DivisionRepository
	DB                 *gorm.DB
}

func (service *DivisionServiceImpl) GetAllDivisions() ([]response.DivisionResponse, error) {
	divisions, err := service.DivisionRepository.FindAll(service.DB)
	if err != nil {
		return nil, err
	}

	return mapper.ToDivisionResponses(divisions), nil
}
