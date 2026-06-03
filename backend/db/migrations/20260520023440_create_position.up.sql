CREATE TABLE positions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

INSERT INTO positions (name) VALUES ('Staff'), ('Leader'), ('Admin');