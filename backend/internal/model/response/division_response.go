package response

type DivisionResponse struct {
	ID        int                `json:"id"`
	Name      string             `json:"name"`
	Positions []PositionResponse `json:"positions,omitempty"`
}
