CREATE TABLE divisions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

INSERT INTO divisions (name) VALUES ('Managerial'), ('Porter'), ('AIC');