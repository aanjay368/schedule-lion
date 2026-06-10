package entity

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type Schedule struct {
	ID          uuid.UUID      `gorm:"type:varchar(36);primaryKey"`
	Date        datatypes.Date      `gorm:"type:date;not null"`
	ShiftID     int            `gorm:"not null"`
	Shift       *Shift         `gorm:"foreignKey:ShiftID;references:ID"`
	DivisionID  int            `gorm:"not null"`
	Division    *Division      `gorm:"foreignKey:DivisionID;references:ID"`
	PositionID  int            `gorm:"not null"`
	Position    *Position      `gorm:"foreignKey:PositionID;references:ID"`
	OwnerID     *uuid.UUID     `gorm:"type:varchar(36);default:null"`
	Owner       *Employee      `gorm:"foreignKey:OwnerID;references:ID"`
	FillerID    *uuid.UUID     `gorm:"type:varchar(36);default:null"`
	Filler      *Employee      `gorm:"foreignKey:FillerID;references:ID"`
	CreatedAt   time.Time      `gorm:"autoCreateTime"`
	UpdatedAt   time.Time      `gorm:"autoUpdateTime;autoCreateTime"`
	DeletedAt   gorm.DeletedAt `gorm:"autoDeleteTime"`
}

func (s *Schedule) BeforeCreate(tx *gorm.DB) (err error) {
	s.ID = uuid.New()
	return
}
