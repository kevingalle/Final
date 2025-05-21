<?php
// Conexión a la base de datos
$conn = new mysqli("localhost", "root", "", "thingspeak_db");
if ($conn->connect_error) { die("Error de conexión: " . $conn->connect_error); }

// Obtener datos de ThingSpeak
$channelID = "2853801";  // Reemplaza con tu Channel ID
$apiKey = "YBEPNHCO188TOPFW";  // Reemplaza con tu API Key
$url = "https://api.thingspeak.com/channels/$channelID/feeds.json?api_key=$apiKey&results=1"; // Solo 1 dato reciente

$data = json_decode(file_get_contents($url), true);

// Verificar si hay datos
if (!empty($data['feeds'])) {
    $feed = $data['feeds'][0]; // Solo el más reciente
    $entry_id = $feed['entry_id'];
    $temperatura = isset($feed['field1']) ? $feed['field1'] : 0;
    $humedad_aire = isset($feed['field2']) ? $feed['field2'] : 0;
    $humedad_suelo = isset($feed['field3']) ? $feed['field3'] : 0;
    $created_at = $feed['created_at'];

    // Insertar en la base de datos (evitando duplicados)
    $sql = "INSERT INTO datos_sensor (entry_id, temperatura, humedad_aire, humedad_suelo, created_at) 
            VALUES ('$entry_id', '$temperatura', '$humedad_aire', '$humedad_suelo', '$created_at') 
            ON DUPLICATE KEY UPDATE 
                temperatura = '$temperatura', 
                humedad_aire = '$humedad_aire', 
                humedad_suelo = '$humedad_suelo',
                created_at = '$created_at'";

    if ($conn->query($sql) === TRUE) {
        echo "Datos guardados correctamente.";
    } else {
        echo "Error al guardar datos: " . $conn->error;
    }
} else {
    echo "No hay datos disponibles.";
}

// Cerrar conexión
$conn->close();
?>
