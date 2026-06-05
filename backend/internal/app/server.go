package app

import (
	"github.com/aanjay368/schedule-lion/backend/internal/config"
	"github.com/aanjay368/schedule-lion/backend/internal/handler"
	"github.com/aanjay368/schedule-lion/backend/internal/middleware"
	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/logger"
)

// Server holds the Fiber app, all handlers, and configuration.
type Server struct {
	App             *fiber.App
	DivisionHandler handler.DivisionHandler
	AuthHandler     handler.AuthHandler
	UserHandler     handler.UserHandler
	EmployeeHandler handler.EmployeeHandler
	ShiftHandler    handler.ShiftHandler
	Config          *config.Config
}

// RunApp registers all middleware and routes, then starts the HTTP server.
func (server *Server) RunApp(addr string) error {
	server.App.Use(logger.New(logger.Config{
		Format: "${cyan}[${ip}]:${pid} ${status} - ${method} ${path}${reset}\n",
	}))

	api := server.App.Group("/api")
	server.authRoutes(api)
	server.divisionRoutes(api)
	server.userRoutes(api)
	server.employeeRoutes(api)
	server.shiftRoutes(api)

	return server.App.Listen(addr, fiber.ListenConfig{
		EnablePrefork: true,	
	})
}

func (server *Server) authRoutes(router fiber.Router) {
	auth := router.Group("/auth")
	auth.Post("/login", server.AuthHandler.Login)
	auth.Post("/refresh", server.AuthHandler.Refresh)
}

func (server *Server) divisionRoutes(router fiber.Router) {
	divisions := router.Group("/divisions")
	divisions.Use(middleware.AuthMiddleware(server.Config))
	divisions.Get("/", server.DivisionHandler.GetAllDivisions)
}

func (server *Server) userRoutes(router fiber.Router) {
	users := router.Group("/users")
	users.Use(middleware.AuthMiddleware(server.Config))
	users.Get("/current", server.UserHandler.GetCurrent)
}

func (server *Server) employeeRoutes(router fiber.Router) {
	employees := router.Group("/employees")
	employees.Use(middleware.AuthMiddleware(server.Config))
	employees.Get("/", server.EmployeeHandler.GetAllEmployees)
	employees.Post("/", middleware.AdminOnly, server.EmployeeHandler.CreateEmployee)
	employees.Put("/:id", middleware.AdminOnly, server.EmployeeHandler.UpdateEmployee)
	employees.Delete("/:id", middleware.AdminOnly, server.EmployeeHandler.DeleteEmployee)
	employees.Get("/search", middleware.AdminOnly, server.EmployeeHandler.SearchEmployees)
}

func (server *Server) shiftRoutes(router fiber.Router) {
	shifts := router.Group("/shifts")
	shifts.Use(middleware.AuthMiddleware(server.Config))
	shifts.Use(middleware.AdminOnly)
	shifts.Get("/", server.ShiftHandler.GetAll)
	shifts.Post("/", server.ShiftHandler.Create)
	shifts.Put("/:id", server.ShiftHandler.Update)
	shifts.Delete("/:id", server.ShiftHandler.Delete)
}