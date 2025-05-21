function mostrarNotificacion(mensaje, tipo) {
    const notificacion = document.getElementById('notification');
    notificacion.textContent = mensaje;
    notificacion.className = 'notification ' + tipo;
    notificacion.style.display = 'block';
    
    setTimeout(() => {
        notificacion.style.opacity = '0';
        setTimeout(() => {
            notificacion.style.display = 'none';
            notificacion.style.opacity = '1';
        }, 300);
    }, 3000);
}

function validarLogin() {
    var usuario = document.getElementById("usuario").value;
    var contrasena = document.getElementById("contrasena").value;
    
    // Simular verificación con la base de datos
    if (usuario === "admin" && contrasena === "1234") {
        mostrarNotificacion('Acceso concedido. Redirigiendo...', 'success');
        
        // Simula tiempo de carga antes de redireccionar
        setTimeout(() => {
            window.location.href = "login.html"; // Redirige a la página de inicio
        }, 1500);
        return false; // Previene el comportamiento por defecto
    } else {
        mostrarNotificacion('Usuario o contraseña incorrectos', 'error');
        // Agita ligeramente el formulario para una mejor retroalimentación
        const form = document.getElementById('loginForm');
        form.classList.add('shake');
        setTimeout(() => form.classList.remove('shake'), 500);
        return false; // Previene el comportamiento por defecto
    }
}

// Pequeña animación para los campos de entrada
const inputs = document.querySelectorAll('input');
inputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.parentNode.style.transform = 'translateY(-3px)';
    });
    
    input.addEventListener('blur', function() {
        this.parentNode.style.transform = 'translateY(0)';
    });
});