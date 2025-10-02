CREATE DATABASE novela;
USE novela;

-- NOVELA AVANCE CON CLICK
CREATE TABLE escenas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fondo VARCHAR(100),
    texto TEXT
);

-- Insertamos 3 escenas de ejemplo
INSERT INTO escenas (fondo, texto) VALUES
('bosque.jpg', 'Era de noche en el bosque...'),
('ciudad.jpg', 'La ciudad despertaba llena de luces.'),
('castillo.jpg', 'Finalmente, llegamos al castillo misterioso.');


-- ESTADO DE PARTIDA 

CREATE DATABASE coathli_game;

USE coathli_game;

CREATE TABLE partida (
  id INT AUTO_INCREMENT PRIMARY KEY,
  estado VARCHAR(50) NOT NULL DEFAULT 'no_iniciada',
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP
);
