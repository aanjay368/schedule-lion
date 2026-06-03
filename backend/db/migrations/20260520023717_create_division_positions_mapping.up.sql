CREATE TABLE division_positions (
    division_id INT NOT NULL,
    position_id INT NOT NULL,
    PRIMARY KEY (division_id, position_id),
    FOREIGN KEY (division_id) REFERENCES divisions(id),
    FOREIGN KEY (position_id) REFERENCES positions(id)
);

INSERT INTO division_positions (division_id, position_id) 
SELECT d.id, p.id FROM divisions d, positions p 
WHERE d.name = 'Managerial' AND p.name = 'Admin';

-- AIC -> Leader, Staff
INSERT INTO division_positions (division_id, position_id) 
SELECT d.id, p.id FROM divisions d, positions p 
WHERE d.name = 'AIC' AND p.name IN ('Leader', 'Staff');

-- Porter -> Leader, Staff  
INSERT INTO division_positions (division_id, position_id) 
SELECT d.id, p.id FROM divisions d, positions p 
WHERE d.name = 'Porter' AND p.name IN ('Leader', 'Staff');
