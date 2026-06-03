package entity

type Division struct {
    ID        int        `gorm:"primaryKey"`
    Name      string
    Positions []Position `gorm:"many2many:division_positions;joinForeignKey:division_id;joinReferences:position_id"`
}
