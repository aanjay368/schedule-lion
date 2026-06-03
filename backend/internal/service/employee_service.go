package service

import (
	"log"

	"github.com/aanjay368/schedule-lion/backend/internal/config"
	"github.com/aanjay368/schedule-lion/backend/internal/entity"
	"github.com/aanjay368/schedule-lion/backend/internal/model/request"
	"github.com/aanjay368/schedule-lion/backend/internal/model/response"
	"github.com/aanjay368/schedule-lion/backend/internal/pkg"
	"github.com/aanjay368/schedule-lion/backend/internal/repository"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v3"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type EmployeeService interface {
	CreateEmployee(request request.CreateEmployeeRequest) (*response.EmployeeResponse, error)
	GetAllEmployees() ([]response.EmployeeResponse, error)
	UpdateEmployee(request request.UpdateEmployeeRequest) (*response.EmployeeResponse, error)
	DeleteEmployee(id string) error
	SearchEmployee(request *request.SearchEmployeeRequest) ([]response.EmployeeResponse, int, error)
}

type EmployeeServiceImpl struct {
	EmployeeRepository repository.EmployeeRepository
	DivisionRepository repository.DivisionRepository
	UserRepository     repository.UserRepository
	DB                 *gorm.DB
	Validator          *validator.Validate
	Config             *config.Config
}

func (service *EmployeeServiceImpl) CreateEmployee(request request.CreateEmployeeRequest) (*response.EmployeeResponse, error) {
	var employeeResponse response.EmployeeResponse

	if err := service.Validator.Struct(request); err != nil {
		return nil, err
	}

	err := service.DB.Transaction(func(tx *gorm.DB) error {

		division, _ := service.DivisionRepository.FindByID(tx, request.DivisionID)

		var position *entity.Position
		for _, pos := range division.Positions {
			if pos.ID == request.PositionID {
				position = &pos
				break
			}
		}

		username := pkg.GenerateUsername(request.Nickname)
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(service.Config.DefaultPassword), bcrypt.DefaultCost)

		if err != nil {
			return err
		}

		employee := &entity.Employee{
			FullName:   request.FullName,
			Nickname:   request.Nickname,
			DivisionID: request.DivisionID,
			PositionID: request.PositionID,
			User: &entity.User{
				Username: username,
				Password: string(hashedPassword),
			},
		}
		
		if err := service.EmployeeRepository.Save(tx, employee); err != nil {
			return err
		}		

		employeeResponse = response.EmployeeResponse{
			ID:       employee.ID.String(),
			FullName: employee.FullName,
			Nickname: employee.Nickname,
			IsDeleted: employee.DeletedAt.Valid,
			Division: response.DivisionResponse{
				ID:   division.ID,
				Name: division.Name,
			},
			Position: response.PositionResponse{
				ID:   position.ID,
				Name: position.Name,
			},
		}

		return nil
	})

	if err != nil {
		log.Println("Error :", err.Error())
		return nil, err
	}

	return &employeeResponse, nil
}

func (service *EmployeeServiceImpl) GetAllEmployees() ([]response.EmployeeResponse, error) {
	employees, err := service.EmployeeRepository.FindAll(service.DB)
	if err != nil {
		return nil, err
	}

	var responses []response.EmployeeResponse
	for _, e := range employees {
		resp := response.EmployeeResponse{
			ID:       e.ID.String(),
			FullName: e.FullName,
			Nickname: e.Nickname,
			IsDeleted: e.DeletedAt.Valid,
		}
		if e.Division != nil {
			resp.Division = response.DivisionResponse{
				ID:   e.Division.ID,
				Name: e.Division.Name,
			}
		}
		if e.Position != nil {
			resp.Position = response.PositionResponse{
				ID:   e.Position.ID,
				Name: e.Position.Name,
			}
		}
		responses = append(responses, resp)
	}

	return responses, nil
}

func (service *EmployeeServiceImpl) UpdateEmployee(request request.UpdateEmployeeRequest) (*response.EmployeeResponse, error) {

	var err error
	var employee *entity.Employee
	var employeeResponse response.EmployeeResponse

	if err = service.Validator.Struct(request); err != nil {
		return nil, err
	}

	employee = &entity.Employee{}

	err = service.DB.Transaction(func(tx *gorm.DB) error {

		employee, err = service.EmployeeRepository.FindByID(tx, request.ID)	
			
		if employee == nil {
			log.Println("Error :", err.Error())	
			return fiber.NewError(fiber.StatusNotFound, "Tidak dapat menemukan karyawan dengan ID " + request.ID)
		}
		
		division, _ := service.DivisionRepository.FindByID(tx, request.DivisionID)

		var position *entity.Position
		for _, pos := range division.Positions {
			if pos.ID == request.PositionID {
				position = &pos
				break
			}
		}

		employee.Nickname = request.Nickname
		employee.FullName = request.FullName
		employee.Division = division
		employee.Position = position

		if err := service.EmployeeRepository.Save(tx, employee); err != nil {
			log.Println("Error :", err.Error())			
			return err
		}
		return nil
	})

	if err != nil {
		return nil, err
	}

	employeeResponse = response.EmployeeResponse{
		ID:       employee.ID.String(),
		FullName: employee.FullName,
		Nickname: employee.Nickname,
		IsDeleted: employee.DeletedAt.Valid,
		Division: response.DivisionResponse{
			ID:   employee.Division.ID,
			Name: employee.Division.Name,
		},
		Position: response.PositionResponse{
			ID:   employee.Position.ID,
			Name: employee.Position.Name,
		},
	}

	return &employeeResponse, nil
}

func (service *EmployeeServiceImpl) DeleteEmployee(id string) error {
	var err error

	err = service.DB.Transaction(func(tx *gorm.DB) error {
		employee, _ := service.EmployeeRepository.FindByID(tx, id)
		if employee == nil {
			return fiber.NewError(fiber.StatusNotFound, "Tidak dapat menemukan karyawan dengan ID " + id)
		}
		if err := service.EmployeeRepository.Delete(tx, employee); err != nil {
			return err
		}
		return nil
	})

	if err != nil {
		return err
	}

	return nil
}

func (service *EmployeeServiceImpl) SearchEmployee(request *request.SearchEmployeeRequest) ([]response.EmployeeResponse, int, error) {
	employees, total, err := service.EmployeeRepository.Search(service.DB, request)
	if err != nil {
		log.Println("Error :", err.Error())
		return nil, 0, fiber.NewError(fiber.StatusNotFound, "Tidak ada karyawan yang ditemukan")
	}

	if len(employees) == 0 {
		return nil, 0, fiber.NewError(fiber.StatusNotFound, "Tidak ada karyawan yang ditemukan")
	}

	var responses []response.EmployeeResponse
	for _, e := range employees {
		resp := response.EmployeeResponse{
			ID:       e.ID.String(),
			FullName: e.FullName,
			Nickname: e.Nickname,
			IsDeleted: e.DeletedAt.Valid,
		}
		if e.Division != nil {
			resp.Division = response.DivisionResponse{
				ID:   e.Division.ID,
				Name: e.Division.Name,
			}
		}
		if e.Position != nil {
			resp.Position = response.PositionResponse{
				ID:   e.Position.ID,
				Name: e.Position.Name,
			}
		}
		responses = append(responses, resp)
	}

	return responses, int(total), nil
}
