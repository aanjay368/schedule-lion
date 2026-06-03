package main

import (
	"log"

	"github.com/aanjay368/schedule-lion/backend/internal/app"
)

func main() {
	server, err := app.InitializeServer()
	if err != nil {
		log.Fatalf("Failed to initialize server: %v", err)
	}

	if err := server.RunApp(":8080"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}