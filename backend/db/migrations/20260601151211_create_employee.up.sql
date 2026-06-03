CREATE TABLE employees (
    id VARCHAR(36) PRIMARY KEY,    
    full_name VARCHAR(255) NOT NULL,
    nickname VARCHAR(255) NOT NULL,
    division_id INT NOT NULL,
    position_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (division_id) REFERENCES divisions(id),
    FOREIGN KEY (position_id) REFERENCES positions(id)
);

INSERT INTO employees (id, full_name, nickname, division_id, position_id)
VALUES('534fb16d-d8dd-44b0-a145-444d0b39ee84', 'Herliana Wahyu Lestari', 'Nana', 1, 3);
