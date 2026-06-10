package mapper

import (
	"github.com/aanjay368/schedule-lion/backend/internal/entity"
	"github.com/aanjay368/schedule-lion/backend/internal/model/response"
	"github.com/jinzhu/copier"
)

func ToDivisionResponse(division *entity.Division) response.DivisionResponse {
	var resp response.DivisionResponse
	_ = copier.Copy(&resp, division)
	return resp
}

func ToDivisionResponses(divisions []entity.Division) []response.DivisionResponse {
	var responses []response.DivisionResponse
	if len(divisions) > 0 {
		_ = copier.Copy(&responses, &divisions)
	}
	if responses == nil {
		responses = []response.DivisionResponse{}
	}
	return responses
}
