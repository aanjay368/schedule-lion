package pkg

import (
	"reflect"
	"regexp"
	"strings"

	ut "github.com/go-playground/universal-translator"
	"github.com/go-playground/validator/v10"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

func NewValidator(trans ut.Translator, db *gorm.DB) *validator.Validate {
	v := validator.New()

	registerTagNameFunc(v)
	registerCustomValidations(v, db)
	RegisterDefaultTranslations(v, trans)
	RegisterTranslations(v, trans)

	return v
}

// ── Tag name ───────────────────────────────────────────────────────────────

func registerTagNameFunc(v *validator.Validate) {
	v.RegisterTagNameFunc(func(field reflect.StructField) string {
		name := strings.SplitN(field.Tag.Get("json"), ",", 2)[0]
		if name == "-" {
			return ""
		}
		return name
	})
}

// ── Custom validations ─────────────────────────────────────────────────────

func registerCustomValidations(v *validator.Validate, db *gorm.DB) {
	v.RegisterValidation("unique_nickname", validateUniqueNickname(db))
	v.RegisterValidation("unique_username", validateUniqueUsername(db))
	v.RegisterValidation("exist_division", validateResourceExists(db, "divisions"))
	v.RegisterValidation("exist_position", validateResourceExists(db, "positions"))
	v.RegisterValidation("sync_division_position", validateSyncDivisionPosition(db))
	v.RegisterValidation("unique_shift_name", validateUniqueShiftName(db))
	v.RegisterValidation("unique_shift_code", validateUniqueShiftCode(db))
	v.RegisterValidation("alpha_space_dot", validateAlphaSpaceDot)
	v.RegisterValidation("is_last_flight", validateIsLastFlight)
}

func validateUniqueNickname(db *gorm.DB) validator.Func {
	return func(fl validator.FieldLevel) bool {
		value, _, _, ok := fl.GetStructFieldOK2()

		if !ok {
			return true
		}

		id := value.String()
		nickname := fl.Field().String()
		if nickname == "" {
			return true
		}

		var count int64
		var err error

		if id != "" {
			err = db.Table("employees").
				Where("nickname = ? AND id != ?", nickname, id).
				Count(&count).Error
		} else {
			err = db.Table("employees").
				Where("nickname = ?", nickname).
				Count(&count).Error
		}

		if err != nil {
			return false
		}

		return count == 0
	}
}

func validateUniqueUsername(db *gorm.DB) validator.Func {
	return func(fl validator.FieldLevel) bool {
		value := strings.ToLower(fl.Field().String())
		username := strings.ReplaceAll(value, " ", "_")
		if username == "" {
			return true
		}

		var count int64
		err := db.Table("users").
			Where("username = ?", username).
			Count(&count).Error
		if err != nil {
			return false
		}

		return count == 0
	}
}

func validateResourceExists(db *gorm.DB, table string) validator.Func {
	return func(fl validator.FieldLevel) bool {
		id := fl.Field().Int()
		if id == 0 {
			return true
		}

		var count int64
		err := db.Table(table).
			Where("id = ?", id).
			Count(&count).Error
		if err != nil {
			return false
		}

		return count > 0
	}
}

func validateSyncDivisionPosition(db *gorm.DB) validator.Func {
	return func(fl validator.FieldLevel) bool {

		value, _, _, ok := fl.GetStructFieldOK2()
		if !ok {
			return false
		}
		divisionID := value.Int()
		positionID := fl.Field().Int()

		var count int64
		err := db.Table("division_positions").
			Where("division_id = ? AND position_id = ?", divisionID, positionID).
			Count(&count).Error
		if err != nil || count == 0 {
			return false
		}

		return true
	}
}

func validateAlphaSpaceDot(fl validator.FieldLevel) bool {
	value := fl.Field().String()
	if value == "" {
		return true
	}

	regex := regexp.MustCompile(`^[a-zA-Z\s.]+$`)
	return regex.MatchString(value)
}

func validateUniqueShiftName(db *gorm.DB) validator.Func {
	return func(fl validator.FieldLevel) bool {
		name := fl.Field().String()
		if name == "" {
			return true
		}

		parent := fl.Parent()
		if parent.Kind() == reflect.Ptr {
			parent = parent.Elem()
		}

		divisionIDField := parent.FieldByName("DivisionID")
		positionIDField := parent.FieldByName("PositionID")

		if !divisionIDField.IsValid() || !positionIDField.IsValid() {
			return true
		}

		divisionID := divisionIDField.Int()
		positionID := positionIDField.Int()

		if divisionID == 0 || positionID == 0 {
			return true
		}

		var count int64
		query := db.Table("shifts").
			Where("name = ? AND division_id = ? AND position_id = ? AND deleted_at IS NULL", name, divisionID, positionID)

		err := query.Count(&count).Error
		if err != nil {
			return false
		}

		return count == 0
	}
}

func validateUniqueShiftCode(db *gorm.DB) validator.Func {
	return func(fl validator.FieldLevel) bool {
		code := fl.Field().String()
		if code == "" {
			return true
		}

		parent := fl.Parent()
		if parent.Kind() == reflect.Ptr {
			parent = parent.Elem()
		}

		divisionIDField := parent.FieldByName("DivisionID")
		positionIDField := parent.FieldByName("PositionID")

		if !divisionIDField.IsValid() || !positionIDField.IsValid() {
			return true
		}

		divisionID := divisionIDField.Int()
		positionID := positionIDField.Int()

		if divisionID == 0 || positionID == 0 {
			return true
		}

		var count int64
		query := db.Table("shifts").
			Where("code = ? AND division_id = ? AND position_id = ? AND deleted_at IS NULL", code, divisionID, positionID)

		err := query.Count(&count).Error
		if err != nil {
			return false
		}

		return count == 0
	}
}

func validateIsLastFlight(fl validator.FieldLevel) bool {
	value, _, _, ok := fl.GetStructFieldOK2()
	if !ok {
		return false
	}

	isLastFlight := value.Bool()
	field := new(fl.Field().Interface().(datatypes.Time))

	if isLastFlight && field == nil {
		return false
	} else if !isLastFlight && field != nil {
		return false
	} 

	return true
}
