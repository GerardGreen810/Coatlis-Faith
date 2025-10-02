<?php
$conexion = new mysqli("localhost", "tu_usuario", "tu_contraseña", "coathli_game");
if ($conexion->connect_error) {
    http_response_code(500);
    die("Error de conexión");
}

$conexion->query("UPDATE partida SET estado = 'no_iniciada' WHERE id = 1");

echo "ok";
?>
