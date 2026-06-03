package config

import (
	"log"

	"github.com/spf13/viper"
)

// Config holds all application configuration loaded from environment variables.
type Config struct {
	DBUser     string `mapstructure:"DB_USER"`
	DBPassword string `mapstructure:"DB_PASSWORD"`
	DBHost     string `mapstructure:"DB_HOST"`
	DBPort     string `mapstructure:"DB_PORT"`
	DBName     string `mapstructure:"DB_NAME"`
	JWTSecret  string `mapstructure:"JWT_SECRET"`
	DefaultPassword string `mapstructure:"DEFAULT_PASSWORD"`
}

// LoadConfig reads configuration from .env file or environment variables.
func LoadConfig() *Config {
	viper.SetConfigFile(".env")
	viper.AutomaticEnv()

	if err := viper.ReadInConfig(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	var cfg Config
	if err := viper.Unmarshal(&cfg); err != nil {
		log.Fatalf("Unable to decode config: %v", err)
	}

	return &cfg
}
