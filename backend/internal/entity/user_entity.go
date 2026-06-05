package entity

import (
	"time"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	ID        uuid.UUID `gorm:"primaryKey"`
	Username  string    `gorm:"unique;not null"`
	Password  string    `gorm:"not null"`
	EmployeeID uuid.UUID
	CreatedAt time.Time `gorm:"autoCreateTime;<-:create"`
	UpdatedAt time.Time `gorm:"autoCreateTime;autoUpdateTime"`
	DeletedAt gorm.DeletedAt `gorm:"autoDeleteTime"`
	Employee  *Employee `gorm:"foreignKey:employee_id;references:id"`
}

func (user *User) BeforeCreate(db *gorm.DB) (err error) {
	user.ID = uuid.New()
	return
}
