CREATE TABLE users (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,    
    employee_id VARCHAR(36) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (employee_id) REFERENCES employees(id)
);

INSERT INTO users (id, username, password, employee_id) 
VALUES ('14fddca2-0def-43b1-9ee1-fe130936b2a8', 'nana', '$2a$10$UYP1al6zQij8ReO0siO3f.djxqWidj/dn.LbLGR8IPVI4dueRcOL2', '534fb16d-d8dd-44b0-a145-444d0b39ee84');