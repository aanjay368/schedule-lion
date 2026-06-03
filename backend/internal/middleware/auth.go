package middleware

import (
	"github.com/aanjay368/schedule-lion/backend/internal/config"
	"github.com/aanjay368/schedule-lion/backend/internal/model/response"
	"github.com/aanjay368/schedule-lion/backend/internal/pkg"
	"github.com/gofiber/fiber/v3"

	"github.com/golang-jwt/jwt/v5"
)

// AuthMiddleware validates the access token from cookies and injects user claims into context.
func AuthMiddleware(cfg *config.Config) fiber.Handler {
	return func(c fiber.Ctx) error {
		cookie := c.Cookies("access_token")
		if cookie == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(response.ApiResponse{
				Error: "Access token not found",
			})
		}

		token, err := jwt.ParseWithClaims(cookie, &pkg.Claims{}, func(token *jwt.Token) (any, error) {
			return []byte(cfg.JWTSecret), nil
		})

		if err != nil || !token.Valid {
			return c.Status(fiber.StatusUnauthorized).JSON(response.ApiResponse{
				Error: "Token is invalid or expired",
			})
		}

		claims := token.Claims.(*pkg.Claims)
		c.Locals("user_id", claims.UserID)
		c.Locals("role", claims.Role)
		c.Locals("username", claims.Username)

		return c.Next()
	}
}

// AdminOnly restricts access to users with the "Admin" role.
func AdminOnly(c fiber.Ctx) error {
	role, ok := c.Locals("role").(string)
	if !ok || role != "Admin" {
		return c.Status(fiber.StatusForbidden).JSON(response.ApiResponse{
			Error: "Access denied: admin privileges required",
		})
	}
	return c.Next()
}
