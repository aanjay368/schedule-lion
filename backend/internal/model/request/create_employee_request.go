package request

type CreateEmployeeRequest struct {
	Nickname   string `json:"nickname" validate:"required,min=2,max=50,alphaspace,unique_nickname,unique_username"`
	FullName   string `json:"fullname" validate:"required,min=2,max=50,alpha_space_dot"`
	DivisionID int    `json:"division_id" validate:"required,exist_division"`
	PositionID int    `json:"position_id" validate:"required,exist_position,sync_division_position=DivisionID"`
}
