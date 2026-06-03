package pkg

import (
	"strings"
)

func GenerateUsername(nickname string) string {
	// Lowercase and replace space with underscore
	username := strings.ToLower(nickname)
	username = strings.ReplaceAll(username, " ", "_")
	return username
}
