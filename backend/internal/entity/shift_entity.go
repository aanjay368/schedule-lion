package entity

import (
	"time"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type Shift struct {
	ID         int             `gorm:"primaryKey;autoIncrement:true"`
	Name       string          `gorm:"not null"`
	Code       string          `gorm:"not null"`
	StartTime  *datatypes.Time `gorm:"type:time;default:null"`
	EndTime    *datatypes.Time `gorm:"type:time;default:null"`
	DivisionID int             `gorm:"not null"`
	PositionID int             `gorm:"not null"`
	CreatedAt  time.Time       `gorm:"autoCreateTime"`
	UpdatedAt  time.Time       `gorm:"autoCreateTime;autoUpdateTime"`
	DeletedAt  *gorm.DeletedAt `gorm:"autoDeleteTime"`
	Division   *Division       `gorm:"foreignKey:division_id;references:id"`
	Position   *Position       `gorm:"foreignKey:position_id;references:id"`
}
