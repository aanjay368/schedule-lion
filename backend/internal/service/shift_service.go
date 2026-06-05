package service

import (
	"log"
	"strings"
	"github.com/aanjay368/schedule-lion/backend/internal/entity"
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

func isReadOnlyShift(shift *entity.Shift) bool {
	if shift == nil {
		return false
	}
	return strings.EqualFold(shift.Code, "L") || strings.EqualFold(shift.Name, "Libur")
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
			Name:      request.Name,
			Code:      request.Code,
			StartTime: request.StartTime,			
			Division:  division,
			Position:  position,
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

	shiftResponse := &response.ShiftResponse{
		ID:         shift.ID,
		Name:       shift.Name,
		Code:       shift.Code,
		StartTime:  shift.StartTime,
		EndTime:    shift.EndTime,
		IsReadOnly: isReadOnlyShift(shift),
		Division: response.DivisionResponse{
			ID:   shift.DivisionID,
			Name: shift.Division.Name,
		},
		Position: response.PositionResponse{
			ID:   shift.PositionID,
			Name: shift.Position.Name,
		},
	}

	return shiftResponse, nil
}

func (service *ShiftServiceImpl) Update(request *request.UpdateShiftRequest) (*response.ShiftResponse, error) {

	var err error
	if err = service.Validator.Struct(request); err != nil {
		return nil, err
	}

	var shift *entity.Shift

	service.DB.Transaction(func(tx *gorm.DB) error {

		shift, err = service.ShiftRepository.FindById(tx, request.ID)
		if err != nil {
			return fiber.NewError(fiber.StatusBadRequest, "Shift tidak ditemukan")
		}		

		if isReadOnlyShift(shift) {
			return fiber.NewError(fiber.StatusForbidden, "Shift Libur tidak dapat diedit")
		}

		shift = &entity.Shift{
			ID:         shift.ID,
			Name:       request.Name,
			Code:       request.Code,
			StartTime:  request.StartTime,
			EndTime:    request.EndTime,
			DivisionID: request.DivisionID,
			PositionID: request.PositionID,
		}

		if err := service.ShiftRepository.Save(tx, shift); err != nil {
			return fiber.NewError(fiber.StatusBadRequest, "Gagal Menyimpan Shift")
		}

		return nil
	})

	if err != nil {
		return nil, err
	}

	shiftResponse := &response.ShiftResponse{
		ID:         shift.ID,
		Name:       shift.Name,
		Code:       shift.Code,
		StartTime:  shift.StartTime,
		EndTime:    shift.EndTime,
		IsReadOnly: isReadOnlyShift(shift),
		Division: response.DivisionResponse{
			ID:   shift.DivisionID,
			Name: shift.Division.Name,
		},
		Position: response.PositionResponse{
			ID:   shift.PositionID,
			Name: shift.Position.Name,
		},
	}

	return shiftResponse, nil
}

func (service *ShiftServiceImpl) Delete(id int) (*response.ShiftResponse, error) {

	var err error
	var shift *entity.Shift
	err = service.DB.Transaction(func(tx *gorm.DB) error {

		shift, err = service.ShiftRepository.FindById(tx, id)
		if err != nil {
			return fiber.NewError(fiber.StatusBadRequest, "Shift tidak ditemukan")
		}		

		if isReadOnlyShift(shift) {
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

	shiftResponse := &response.ShiftResponse{
		ID:         shift.ID,
		Name:       shift.Name,
		Code:       shift.Code,
		StartTime:  shift.StartTime,
		EndTime:    shift.EndTime,
		IsReadOnly: isReadOnlyShift(shift),
		Division: response.DivisionResponse{
			ID:   shift.DivisionID,
			Name: shift.Division.Name,
		},
		Position: response.PositionResponse{
			ID:   shift.PositionID,
			Name: shift.Position.Name,
		},
	}

	return shiftResponse, nil
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

	shiftResponses := []response.ShiftResponse{}
	for _, shift := range shifts {
		shiftResponses = append(shiftResponses, response.ShiftResponse{
			ID:         shift.ID,
			Name:       shift.Name,
			Code:       shift.Code,
			StartTime:  shift.StartTime,
			EndTime:    shift.EndTime,
			IsReadOnly: isReadOnlyShift(&shift),
			Division: response.DivisionResponse{
				ID:   shift.DivisionID,
				Name: shift.Division.Name,
			},
			Position: response.PositionResponse{
				ID:   shift.PositionID,
				Name: shift.Position.Name,
			},
		})
	}

	return shiftResponses, nil
}
