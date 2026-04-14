-- Seed para PostgreSQL con usuarios
-- Password: admin123

INSERT INTO "Usuario" (email, password, nombre, rol, activo, "createdAt", "updatedAt") VALUES 
('admin@soderia.com', '$2b$10$bQ/6covQUszrzXrTTuPCLufJ4mC1IFixKNTJPmkbMYAQepQcSxpxq', 'Admin Principal', 'ADMIN', true, NOW(), NOW());