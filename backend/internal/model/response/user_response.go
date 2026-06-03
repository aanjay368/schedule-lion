package response

type UserResponse struct {
	ID       string               `json:"id"`
	Username string               `json:"username"`
	Role     string               `json:"role"`
	Employee EmployeeResponse `json:"employee"`
}
