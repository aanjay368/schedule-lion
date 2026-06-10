package mapper

import (
	"github.com/aanjay368/schedule-lion/backend/internal/entity"
	"github.com/aanjay368/schedule-lion/backend/internal/model/response"
	"github.com/jinzhu/copier"
)

func ToEmployeeResponse(employee *entity.Employee) response.EmployeeResponse {
	var resp response.EmployeeResponse
	_ = copier.Copy(&resp, employee)
	
	resp.ID = employee.ID.String()
	resp.IsDeleted = employee.DeletedAt.Valid
	
	if employee.Division != nil {
		_ = copier.Copy(&resp.Division, employee.Division)
	}
	if employee.Position != nil {
		_ = copier.Copy(&resp.Position, employee.Position)
	}
	
	return resp
}

func ToEmployeeResponses(employees []entity.Employee) []response.EmployeeResponse {
	responses := make([]response.EmployeeResponse, 0, len(employees))
	for _, e := range employees {
		responses = append(responses, ToEmployeeResponse(&e))
	}
	return responses
}
