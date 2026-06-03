package entity

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Employee struct {
	ID         uuid.UUID `gorm:"uuid;primaryKey"`
	FullName   string    `gorm:"not null"`
	Nickname   string    `gorm:"not null"`
	DivisionID int
	PositionID int	
	CreatedAt  time.Time      `gorm:"autoCreateTime"`
	UpdatedAt  time.Time      `gorm:"autoUpdateTime;autoCreateTime"`
	DeletedAt  gorm.DeletedAt `gorm:"autoDeleteTime"`
	Division   *Division      `gorm:"foreignKey:division_id;references:id"`
	Position   *Position      `gorm:"foreignKey:position_id;references:id"`	
	User       *User          `gorm:"foreignKey:employee_id;references:id;onDelete:CASCADE"`
}

func (employee *Employee) BeforeCreate(db *gorm.DB) (err error) {
	employee.ID = uuid.New()
	return
}

func (employee *Employee) AfterDelete(db *gorm.DB) (err error) {
	return db.Delete(employee.User).Error
}