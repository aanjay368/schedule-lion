package mapper

import (
	"strings"

	"github.com/aanjay368/schedule-lion/backend/internal/entity"
	"github.com/aanjay368/schedule-lion/backend/internal/model/response"
	"github.com/jinzhu/copier"
)

func ToUserResponse(user *entity.User, role string) response.UserResponse {
	var userResponse response.UserResponse
	_ = copier.Copy(&userResponse, user)

	userResponse.ID = user.ID.String()
	userResponse.Role = strings.ToLower(role)
	
	if user.Employee != nil {
		empResp := ToEmployeeResponse(user.Employee)
		userResponse.Employee = empResp
	}

	return userResponse
}
