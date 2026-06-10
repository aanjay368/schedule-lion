CREATE TABLE employees (
    id VARCHAR(36) PRIMARY KEY,    
    full_name VARCHAR(255) NOT NULL,
    nickname VARCHAR(255) NOT NULL,
    division_id INT NOT NULL,
    position_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (division_id) REFERENCES divisions(id),
    FOREIGN KEY (position_id) REFERENCES positions(id)
);

INSERT INTO employees (id, full_name, nickname, division_id, position_id) VALUES
('534fb16d-d8dd-44b0-a145-444d0b39ee84', 'Herliana Wahyu Lestari', 'Nana', 1, 3),
('029f3a2c-e8b3-413c-b1af-41d746b64c0c','M.Jafar Sedek','Jafar',3,1),
('1c18ecb9-2954-4556-ad6a-b3bae208fdc7','Arinatun','Airin',3,1),
('9f65ab32-bfff-4f32-931e-25548ca49e32','Elma Septiana','Elma',3,1),
('a2cbc857-6e37-4eec-acf0-0e4fc39bd86e','Sandi Taba Hiu','Sandi AIC',3,1),
('a404d4ef-e709-4cc1-b14b-f39e047ab611','Nuril','Nuril',3,1),
('b740c7db-83f7-47aa-a67b-1d3a468e267c','Sasya S Asri N.GD','Asya',3,1),
('ba56bfff-96b5-4054-b096-45b6b1083917','Sepriyani','Yani',3,1),
('be5b268d-923a-4517-b842-cec348dbb701','Yuli Fitriani','Yuli',3,1),
('c8c99f59-7064-45a5-9d7c-6c8513f92e94','Dela Safira','Dela',3,1),
('de42991d-3a6f-4ec9-926e-da6be5d08093','Nartin Odje','Nartin',3,1);
