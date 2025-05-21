document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("suggestionForm").addEventListener("submit", function(event) {
        event.preventDefault(); // Evita el envío normal del formulario

        let formData = new FormData(this);

        fetch("guardar_sugerencia.php", {
            method: "POST",
            body: formData
        })
        .then(response => response.text()) // Convertir respuesta a texto
        .then(data => {
            console.log("Respuesta del servidor:", data);
            alert("Respuesta del servidor: " + data);
        })
        .catch(error => {
            console.error("Error en la solicitud:", error);
            alert("Error en la conexión con el servidor.");
        });
    });
});
