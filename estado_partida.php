<?php
header("Content-Type: application/json");

// Conexión
$conexion = new mysqli("localhost", "tu_usuario", "tu_contraseña", "coathli_game");
if ($conexion->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Conexión fallida"]);
    exit;
}

$resultado = $conexion->query("SELECT estado FROM partida WHERE id = 1");
if ($fila = $resultado->fetch_assoc()) {
    echo json_encode(["estado" => $fila["estado"]]);
} else {
    echo json_encode(["estado" => "no_iniciada"]);
}
?>