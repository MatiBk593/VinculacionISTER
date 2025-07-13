CREATE DATABASE IF NOT EXISTS la_toglla;
USE la_toglla;

-- Tabla usuarios
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Usuario admin por defecto
INSERT IGNORE INTO users (username, password)
VALUES ('admin', 'admin123'); -- contraseña: admin123

-- Tabla emprendimientos
CREATE TABLE IF NOT EXISTS emprendimientos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    categoria VARCHAR(50),
    descripcion TEXT,
    contacto VARCHAR(100),
    imagen_url VARCHAR(255)
);

-- Tabla noticias
CREATE TABLE IF NOT EXISTS noticias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    contenido TEXT NOT NULL,
    imagen_url VARCHAR(255),
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP
);
