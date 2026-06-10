package service

import (
	"encoding/csv"
	"fmt"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/aanjay368/schedule-lion/backend/internal/entity"
	"github.com/aanjay368/schedule-lion/backend/internal/mapper"
	"github.com/aanjay368/schedule-lion/backend/internal/model/request"
	"github.com/aanjay368/schedule-lion/backend/internal/model/response"
	"github.com/aanjay368/schedule-lion/backend/internal/repository"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type ScheduleService interface {
	UploadSchedule(req request.ScheduleUploadRequest) error
	GetSchedules(req request.QueryScheduleRequest) ([]response.ScheduleResponse, error)
}

type ScheduleServiceImpl struct {
	ScheduleRepository repository.ScheduleRepository
	EmployeeRepository repository.EmployeeRepository
	ShiftRepository    repository.ShiftRepository
	DivisionRepository repository.DivisionRepository
	DB                 *gorm.DB
	Validator          *validator.Validate
}

func (s *ScheduleServiceImpl) UploadSchedule(req request.ScheduleUploadRequest) error {
	// 1. Validate request DTO structure
	if err := s.Validator.Struct(req); err != nil {
		return err
	}

	// 2. Validate file extension
	ext := filepath.Ext(req.File.Filename)
	if ext != ".csv" {
		return fiber.NewError(fiber.StatusBadRequest, "Ekstensi file harus berupa .csv")
	}

	// 3. Open file
	file, err := req.File.Open()
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Gagal membuka file CSV")
	}
	defer file.Close()

	// 4. Read CSV records
	reader := csv.NewReader(file)
	records, err := reader.ReadAll()
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Gagal membaca format CSV. Pastikan format benar.")
	}

	if len(records) < 2 {
		return fiber.NewError(fiber.StatusBadRequest, "Berkas CSV kosong atau tidak memiliki baris data.")
	}

	// 5. Determine expected days in month
	expectedDays := getDaysInMonth(req.Year, req.Month)
	expectedCols := 2 + expectedDays

	// 6. Validate header structure
	header := records[0]
	if len(header) != expectedCols {
		return fiber.NewError(fiber.StatusBadRequest, fmt.Sprintf("Jumlah kolom dalam CSV (%d) tidak sesuai dengan jumlah hari pada bulan %d/%d (Harus %d kolom).", len(header)-2, req.Month, req.Year, expectedDays))
	}

	// Validate day headers
	for j := 2; j < len(header); j++ {
		colName := strings.TrimSpace(header[j])
		dayNum, err := strconv.Atoi(colName)
		if err != nil || dayNum != j-1 {
			return fiber.NewError(fiber.StatusBadRequest, fmt.Sprintf("Header kolom ke-%d tidak valid. Tanggal harus berupa angka bulat berurutan, contoh: '%d'.", j+1, j-1))
		}
	}

	// 7. Process data in transaction
	return s.DB.Transaction(func(tx *gorm.DB) error {
		// Verify division and position existence
		division, err := s.DivisionRepository.FindByID(tx, req.DivisionID)
		if err != nil {
			return fiber.NewError(fiber.StatusNotFound, "Divisi tidak ditemukan")
		}

		var positionExists bool
		for _, pos := range division.Positions {
			if pos.ID == req.PositionID {
				positionExists = true
				break
			}
		}
		if !positionExists {
			return fiber.NewError(fiber.StatusNotFound, "Posisi tidak ditemukan pada divisi yang dipilih")
		}

		// Load employees for division and position
		employees, err := s.EmployeeRepository.FindByDivisionAndPosition(tx, req.DivisionID, req.PositionID)
		if err != nil {
			return err
		}

		// Load shifts for division and position
		shifts, err := s.ShiftRepository.FindAll(tx, &request.QueryShiftRequest{
			DivisionID: req.DivisionID,
			PositionID: req.PositionID,
		})
		if err != nil {
			return err
		}

		// Build in-memory lookup maps
		employeeMap := make(map[string]*entity.Employee)
		for i := range employees {
			emp := &employees[i]
			employeeMap[strings.ToLower(strings.TrimSpace(emp.FullName))] = emp
			employeeMap[strings.ToLower(strings.TrimSpace(emp.Nickname))] = emp
		}

		shiftMap := make(map[string]entity.Shift)
		var liburShiftID int
		for _, sh := range shifts {
			shiftMap[strings.ToUpper(strings.TrimSpace(sh.Code))] = sh
			if strings.ToUpper(strings.TrimSpace(sh.Code)) == "L" {
				liburShiftID = sh.ID
			}
		}

		if liburShiftID == 0 {
			return fiber.NewError(fiber.StatusInternalServerError, "Shift Libur (L) belum dikonfigurasi di database untuk divisi/posisi ini.")
		}

		var validationErrors []string
		var schedulesToCreate []entity.Schedule

		// Parse and validate rows
		for i := 1; i < len(records); i++ {
			row := records[i]
			// Skip empty rows
			if len(row) == 0 || (len(row) == 1 && strings.TrimSpace(row[0]) == "") {
				continue
			}

			// Pad row if it has fewer columns than header
			if len(row) < expectedCols {
				paddedRow := make([]string, expectedCols)
				copy(paddedRow, row)
				row = paddedRow
			}

			name := strings.TrimSpace(row[1])
			var ownerID *uuid.UUID

			if name != "" {
				emp, exists := employeeMap[strings.ToLower(name)]
				if !exists {
					validationErrors = append(validationErrors, fmt.Sprintf("Baris %d: Karyawan '%s' tidak terdaftar di Divisi & Posisi ini.", i+1, name))
					continue
				}
				ownerID = &emp.ID
			}

			// Validate shifts for each day
			for j := 2; j < expectedCols; j++ {
				dayNum := j - 1
				shiftCode := strings.ToUpper(strings.TrimSpace(row[j]))

				var shiftID int
				if shiftCode == "" || shiftCode == "-" || shiftCode == "OFF" || shiftCode == "L" {
					shiftID = liburShiftID
				} else {
					sh, exists := shiftMap[shiftCode]
					if !exists {
						validationErrors = append(validationErrors, fmt.Sprintf("Baris %d, Kolom Tanggal %d: Kode shift '%s' tidak terdaftar.", i+1, dayNum, shiftCode))
						continue
					}
					shiftID = sh.ID
				}

				// Construct Date
				date := datatypes.Date(time.Date(req.Year, time.Month(req.Month), dayNum, 0, 0, 0, 0, time.UTC))
				schedulesToCreate = append(schedulesToCreate, entity.Schedule{
					ID:         uuid.New(),
					Date:       date,
					ShiftID:    shiftID,
					DivisionID: req.DivisionID,
					PositionID: req.PositionID,
					OwnerID:    ownerID,
					FillerID:   ownerID,
				})
			}
		}

		if len(validationErrors) > 0 {
			return fiber.NewError(fiber.StatusBadRequest, strings.Join(validationErrors, "; "))
		}

		// Load existing schedules from database
		existingSchedules, err := s.ScheduleRepository.FindByMetadata(tx, req.DivisionID, req.PositionID, req.Month, req.Year)
		if err != nil {
			return err
		}

		if len(existingSchedules) == 0 {
			if len(schedulesToCreate) > 0 {
				if err := s.ScheduleRepository.SaveAll(tx, schedulesToCreate); err != nil {
					return err
				}
			}
			return nil
		}

		getKey := func(date datatypes.Date, ownerID *uuid.UUID) string {
			dateStr := time.Time(date).Format("2006-01-02")
			ownerStr := "nil"
			if ownerID != nil {
				ownerStr = ownerID.String()
			}
			return dateStr + "|" + ownerStr
		}

		// Build map of existing schedules
		existingMap := make(map[string]entity.Schedule)
		for _, es := range existingSchedules {
			existingMap[getKey(es.Date, es.OwnerID)] = es
		}

		var schedulesToDelete []string
		var schedulesToInsert []entity.Schedule
		newKeysMap := make(map[string]bool)

		for _, ns := range schedulesToCreate {
			key := getKey(ns.Date, ns.OwnerID)
			newKeysMap[key] = true

			es, exists := existingMap[key]
			if !exists {
				schedulesToInsert = append(schedulesToInsert, ns)
			} else {
				if es.ShiftID != ns.ShiftID {
					schedulesToDelete = append(schedulesToDelete, es.ID.String())
					schedulesToInsert = append(schedulesToInsert, ns)
				}
			}
		}

		// Identify deleted schedules (present in DB, but not in new CSV)
		for key, es := range existingMap {
			if !newKeysMap[key] {
				schedulesToDelete = append(schedulesToDelete, es.ID.String())
			}
		}

		// Apply database changes
		if len(schedulesToDelete) > 0 {
			if err := s.ScheduleRepository.DeleteByIDs(tx, schedulesToDelete); err != nil {
				return err
			}
		}

		if len(schedulesToInsert) > 0 {
			if err := s.ScheduleRepository.SaveAll(tx, schedulesToInsert); err != nil {
				return err
			}
		}

		return nil
	})
}

func getDaysInMonth(year int, month int) int {
	t := time.Date(year, time.Month(month), 1, 0, 0, 0, 0, time.UTC)
	return t.AddDate(0, 1, -1).Day()
}

func (s *ScheduleServiceImpl) GetSchedules(req request.QueryScheduleRequest) ([]response.ScheduleResponse, error) {
	if err := s.Validator.Struct(req); err != nil {
		return nil, err
	}

	schedules, err := s.ScheduleRepository.FindWithRelations(s.DB, req)
	if err != nil {
		return nil, err
	}

	return mapper.ToScheduleResponses(schedules), nil
}
