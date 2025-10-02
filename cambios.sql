CREATE DATABASE coathli_game;
USE coathli_game;

CREATE TABLE partida (
  id INT PRIMARY KEY,
  estado ENUM('iniciada','no_iniciada') NOT NULL DEFAULT 'no_iniciada'
);

-- Insertar partida por defecto
INSERT INTO partida (id, estado) VALUES (1, 'no_iniciada');