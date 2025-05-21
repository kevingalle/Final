<?php
// Configuración de la base de datos
$servername = "localhost";  // Cambia por tu servidor
$username = "root";         // Cambia por tu usuario de base de datos
$password = "";             // Cambia por tu contraseña de base de datos
$dbname = "thingspeak_db"; // Cambia por tu nombre de base de datos

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Comprobar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Obtener datos del formulario
$name = $_POST['name'];
$email = $_POST['email'];
$suggestion = $_POST['suggestion'];

// Preparar la consulta SQL
$sql = "INSERT INTO sugerencias (name, email, suggestion) VALUES ('$name', '$email', '$suggestion')";

// Ejecutar la consulta y comprobar si se insertaron los datos
if ($conn->query($sql) === TRUE) {
    echo "Sugerencia registrada correctamente.";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

// Cerrar la conexión
$conn->close();
?>
