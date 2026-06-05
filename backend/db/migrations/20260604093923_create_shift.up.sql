CREATE TABLE shifts (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name varchar(50) NOT NULL,
    code varchar(10) NOT NULL,
    start_time TIME NULL,
    end_time TIME NULL,
    division_id INT NOT NULL,
    position_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (division_id) REFERENCES divisions(id),
    FOREIGN KEY (position_id) REFERENCES positions(id)
);

INSERT INTO shifts (name, code, start_time, end_time, division_id, position_id) VALUES 
('Libur', 'L', NULL, NULL, 2, 1),
('Libur', 'L', NULL, NULL, 3, 1),
('Libur', 'L', NULL, NULL, 2, 2),
('Libur', 'L', NULL, NULL, 3, 2),
('Libur', 'L', NULL, NULL, 1, 3);