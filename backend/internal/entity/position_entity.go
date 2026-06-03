package entity

type Position struct {
    ID        int        `gorm:"primaryKey"`
    Name      string     `gorm:"unique"`
    Divisions []Division `gorm:"many2many:division_positions;joinForeignKey:position_id;joinReferences:division_id"`
}