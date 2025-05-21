<?php
$conn = new mysqli("localhost", "root", "", "thingspeak_db");
if ($conn->connect_error) { die("Error de conexión: " . $conn->connect_error); }

// Obtener el último registro
$sql = "SELECT temperatura, humedad_aire, humedad_suelo FROM datos_sensor ORDER BY id DESC LIMIT 1";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    echo json_encode($result->fetch_assoc());
} else {
    echo json_encode(["temperatura" => "--", "humedad_aire" => "--", "humedad_suelo" => "--"]);
}

$conn->close();
?>
