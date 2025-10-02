<?php
// getEscena.php
$conexion = new mysqli("localhost", "root", "", "novela"); 
// cambia user y password si es necesario

if ($conexion->connect_error) {
    die("Error de conexión: " . $conexion->connect_error);
}

$escenaId = isset($_GET['id']) ? (int)$_GET['id'] : 1;

$sql = "SELECT * FROM escenas WHERE id = $escenaId";
$resultado = $conexion->query($sql);

if ($resultado->num_rows > 0) {
    $fila = $resultado->fetch_assoc();
    echo json_encode($fila); // devolvemos datos en JSON
} else {
    echo json_encode(["fondo" => "", "texto" => "Fin de la historia"]);
}

$conexion->close();
?>