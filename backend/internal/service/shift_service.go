package service

import (
	"log"

	"github.com/aanjay368/schedule-lion/backend/internal/entity"
	"github.com/aanjay368/schedule-lion/backend/internal/mapper"
	"github.com/jinzhu/copier"
	"github.com/aanjay368/schedule-lion/backend/internal/model/request"
	"github.com/aanjay368/schedule-lion/backend/internal/model/response"
	"github.com/aanjay368/schedule-lion/backend/internal/repository"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v3"
	"gorm.io/gorm"
)

type ShiftService interface {
	Create(request *request.CreateShiftRequest) (*response.ShiftResponse, error)
	Update(request *request.UpdateShiftRequest) (*response.ShiftResponse, error)
	Delete(id int) (*response.ShiftResponse, error)
	GetAll(request *request.QueryShiftRequest) ([]response.ShiftResponse, error)
}

type ShiftServiceImpl struct {
	ShiftRepository    repository.ShiftRepository
	DivisionRepository repository.DivisionRepository
	Validator          *validator.Validate
	DB                 *gorm.DB
}

func (service *ShiftServiceImpl) Create(request *request.CreateShiftRequest) (*response.ShiftResponse, error) {
	if err := service.Validator.Struct(request); err != nil {
		log.Println(err)
		return nil, err
	}

	var shift *entity.Shift
	err := service.DB.Transaction(func(tx *gorm.DB) error {
		division, _ := service.DivisionRepository.FindByID(tx, request.DivisionID)

		var position *entity.Position
		for _, pos := range division.Positions {
			if pos.ID == request.PositionID {
				position = &pos
				break
			}
		}

		if position == nil {
			return fiber.NewError(fiber.StatusNotFound, "Tidak dapat menemukan posisi")
		}

		shift = &entity.Shift{
			Division:  division,
			Position:  position,
		}

		if err := copier.Copy(shift, request); err != nil {
			return err
		}

		if request.IsLastFlight {
			shift.EndTime = nil
		} else {
			shift.EndTime = request.EndTime
		}

		if err := service.ShiftRepository.Save(tx, shift); err != nil {
			return fiber.NewError(fiber.StatusBadRequest, "Gagal Menyimpan Shift")
		}

		return nil
	})

	if err != nil {
		log.Println(err)
		return nil, err
	}

	resp := mapper.ToShiftResponse(shift)
	return &resp, nil
}

func (service *ShiftServiceImpl) Update(request *request.UpdateShiftRequest) (*response.ShiftResponse, error) {
	var err error
	if err = service.Validator.Struct(request); err != nil {
		return nil, err
	}

	var shift *entity.Shift
	err = service.DB.Transaction(func(tx *gorm.DB) error {
		shift, err = service.ShiftRepository.FindById(tx, request.ID)
		if err != nil {
			return fiber.NewError(fiber.StatusBadRequest, "Shift tidak ditemukan")
		}		

		if mapper.IsReadOnlyShift(shift) {
			return fiber.NewError(fiber.StatusForbidden, "Shift Libur tidak dapat diedit")
		}

		if err := copier.Copy(shift, request); err != nil {
			return err
		}

		if err := service.ShiftRepository.Save(tx, shift); err != nil {
			return fiber.NewError(fiber.StatusBadRequest, "Gagal Menyimpan Shift")
		}

		return nil
	})

	if err != nil {
		return nil, err
	}

	resp := mapper.ToShiftResponse(shift)
	return &resp, nil
}

func (service *ShiftServiceImpl) Delete(id int) (*response.ShiftResponse, error) {
	var err error
	var shift *entity.Shift
	err = service.DB.Transaction(func(tx *gorm.DB) error {
		shift, err = service.ShiftRepository.FindById(tx, id)
		if err != nil {
			return fiber.NewError(fiber.StatusNotFound, "Shift tidak ditemukan")
		}		

		if mapper.IsReadOnlyShift(shift) {
			return fiber.NewError(fiber.StatusForbidden, "Shift Libur tidak dapat dihapus")
		}

		if err := service.ShiftRepository.Delete(tx, shift); err != nil {
			return fiber.NewError(fiber.StatusBadRequest, "Gagal Delete Shift")
		}

		return nil
	})

	if err != nil {
		return nil, err
	}

	resp := mapper.ToShiftResponse(shift)
	return &resp, nil
}

func (service *ShiftServiceImpl) GetAll(request *request.QueryShiftRequest) ([]response.ShiftResponse, error) {
	if err := service.Validator.Struct(request); err != nil {
		return nil, err
	}

	shifts, err := service.ShiftRepository.FindAll(service.DB, request)
	if err != nil {
		return nil, err
	}

	if len(shifts) == 0 {
		return nil, fiber.NewError(fiber.StatusNotFound, "Shift tidak ditemukan")
	}

	return mapper.ToShiftResponses(shifts), nil
}
