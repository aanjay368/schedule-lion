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

INSERT INTO users (id, username, password, employee_id) VALUES 
('14fddca2-0def-43b1-9ee1-fe130936b2a8', 'nana', '$2a$10$UYP1al6zQij8ReO0siO3f.djxqWidj/dn.LbLGR8IPVI4dueRcOL2', '534fb16d-d8dd-44b0-a145-444d0b39ee84'),
('0545bd8a-3530-4626-8192-767e72eb1e94','elma','$2a$10$Thi41hrB.mkLoUdz6HuvgurRthN0DEdaad08rxHzypi.WsboPxyLK','9f65ab32-bfff-4f32-931e-25548ca49e32'),
('392a8352-a0f1-4bab-8c91-7aa5915b558c','sandi_aic','$2a$10$jpo3kv8GPPj7jVGjuE4vNuMvDrpHRwTVqWuUL8Xgr05YoUWZrIrLu','a2cbc857-6e37-4eec-acf0-0e4fc39bd86e'),
('4405b937-9051-4182-ba1c-d19b7075755a','asya','$2a$10$8sSiKu.jrKpObLo.RsDYfuUD7rPpTmWRevgaCNzCMCdkgB8uLz6Fy','b740c7db-83f7-47aa-a67b-1d3a468e267c'),
('4a81b6b9-3e6f-4211-ae9c-4f6bb3893806','yani','$2a$10$UawT5pZ4tdor7mj2UaGqyu9KL0jrlyVdeuULb9U0v5ksD1Z1hdTl6','ba56bfff-96b5-4054-b096-45b6b1083917'),
('4caecec7-1a8b-4edf-973f-ded12e7cb5e8','dela','$2a$10$m3fhCgC8NCQTRMNArldSpuMzjfDczj8B7FXdgAnDziNvuWvh9t.Ga','c8c99f59-7064-45a5-9d7c-6c8513f92e94'),
('7250786d-27d7-4a22-b3f9-996d1e728ad4','jafar','$2a$10$usR56VdHRuvlWGCnW63prexwDdqglbTgwqAwC6PE7bXi3oqwaMj5m','029f3a2c-e8b3-413c-b1af-41d746b64c0c'),
('8f1bd1c7-ccf0-40ed-8915-22041a95a30e','nartin','$2a$10$PxytSeGhrn8KoPaS/QzzYugyx1.q2q/xZERQp/jdPkdwlqxdh8wxu','de42991d-3a6f-4ec9-926e-da6be5d08093'),
('948f8ebb-c4a0-41a8-a650-9f0d7326c3de','yuli','$2a$10$t2u1Bdr13V4YZJmw5RHKDeRuT9GmkNLcmPbDC6GNdHS0ts1O2W2eK','be5b268d-923a-4517-b842-cec348dbb701'),
('a2e77f71-e21d-415d-9aef-1620b99564bb','airin','$2a$10$4LrsFbNBg1YfXzOpKFOdYOi5egw3317tY0Eq6LafeHCXUleciOqAK','1c18ecb9-2954-4556-ad6a-b3bae208fdc7'),
('ce107f6f-37ac-4f87-aa4a-363165acd02b','nuril','$2a$10$N3mfa.GdmPveOW/ywySqhuWstkfp.H2TseuE5sLCoM2ZV9TRt3Pgq','a404d4ef-e709-4cc1-b14b-f39e047ab611');