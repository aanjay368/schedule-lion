package pkg

import (
	"time"
	"github.com/golang-jwt/jwt/v5"
)

type Claims struct {
	UserID   string  `json:"user_id"`
	Username string `json:"username"`
	Role     string `json:"role"`
	jwt.RegisteredClaims
}

type RefreshClaims struct {
	UserID string `json:"user_id"`
	jwt.RegisteredClaims
}

func GenerateTokens(userID string, username, role, secret string) (string, string, error) {
	// Access Token (short lived)
	accessTokenClaims := &Claims{
		UserID:   userID,
		Username: username,
		Role:     role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(10 * time.Minute)),
		},
	}
	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, accessTokenClaims)
	at, err := accessToken.SignedString([]byte(secret))
	if err != nil {
		return "", "", err
	}

	// Refresh Token (long lived)
	refreshTokenClaims := &RefreshClaims{
		UserID: userID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
		},
	}
	refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshTokenClaims)
	rt, err := refreshToken.SignedString([]byte(secret))
	if err != nil {
		return "", "", err
	}

	return at, rt, nil
}

func ValidateRefreshToken(tokenString, secret string) (*RefreshClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &RefreshClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(secret), nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(*RefreshClaims); ok && token.Valid {
		return claims, nil
	}

	return nil, jwt.ErrSignatureInvalid
}
