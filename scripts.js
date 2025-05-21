document.addEventListener('DOMContentLoaded', function() {
    const suggestionForm = document.getElementById('suggestionForm');
    const submitBtn = document.getElementById('submitBtn');
    const originalButtonContent = submitBtn.innerHTML;
    
    // Agregar validación de formulario
    function validateForm() {
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const suggestion = document.getElementById('suggestion').value.trim();
        
        // Validar que los campos no estén vacíos
        if (!name || !email || !suggestion) {
            return false;
        }
        
        // Validación simple de email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            return false;
        }
        
        return true;
    }
    
    // Manejar errores de validación
    function showValidationError(inputId, message) {
        const inputElement = document.getElementById(inputId);
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.color = '#e74c3c';
        errorElement.style.fontSize = '14px';
        errorElement.style.marginTop = '5px';
        
        // Eliminar mensajes de error previos
        const existingError = inputElement.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Añadir estilo de error al input
        inputElement.style.borderColor = '#e74c3c';
        
        // Añadir mensaje de error
        inputElement.parentNode.appendChild(errorElement);
    }
    
    // Limpiar errores
    function clearValidationErrors() {
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.remove());
        
        // Restaurar estilos de los campos
        const inputs = document.querySelectorAll('#suggestionForm input, #suggestionForm textarea');
        inputs.forEach(input => {
            input.style.borderColor = '#ddd';
        });
    }
    
    // Añadir eventos de input para validación en tiempo real
    ['name', 'email', 'suggestion'].forEach(fieldId => {
        const field = document.getElementById(fieldId);
        field.addEventListener('input', function() {
            // Eliminar mensaje de error cuando el usuario empieza a escribir
            const existingError = field.parentNode.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
                field.style.borderColor = '#ddd';
            }
        });
    });
    
    // Manejar el envío del formulario
    suggestionForm.addEventListener('submit', function(e) {
        e.preventDefault();
        clearValidationErrors();
        
        // Obtener valores del formulario
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const suggestion = document.getElementById('suggestion').value.trim();
        
        // Validar campos
        if (!name) {
            showValidationError('name', 'Por favor ingresa tu nombre');
            return;
        }
        
        if (!email) {
            showValidationError('email', 'Por favor ingresa tu correo electrónico');
            return;
        }
        
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            showValidationError('email', 'Por favor ingresa un correo electrónico válido');
            return;
        }
        
        if (!suggestion) {
            showValidationError('suggestion', 'Por favor ingresa tu sugerencia');
            return;
        }
        
        // Cambiar estado del botón
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner"></span> Enviando...';
        submitBtn.classList.add('processing');
        
        // Preparar mensaje para WhatsApp
        const message = encodeURIComponent(`Nombre: ${name}\nCorreo Electrónico: ${email}\n\nSugerencia: ${suggestion}`);
        const whatsappUrl = `https://wa.me/4492639169?text=${message}`;
        
        // Simular una pequeña demora para mejorar la UX
        setTimeout(function() {
            try {
                // Abrir WhatsApp en una nueva pestaña
                window.open(whatsappUrl, "_blank");
                
                // Mostrar mensaje de éxito
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.textContent = '¡Gracias! Tu sugerencia ha sido enviada correctamente.';
                successMessage.style.backgroundColor = '#4CAF50';
                successMessage.style.color = 'white';
                successMessage.style.padding = '10px';
                successMessage.style.borderRadius = '8px';
                successMessage.style.marginTop = '20px';
                successMessage.style.textAlign = 'center';
                
                // Añadir mensaje de éxito al formulario
                suggestionForm.appendChild(successMessage);
                
                // Limpiar el formulario
                suggestionForm.reset();
                
                // Eliminar el mensaje de éxito después de unos segundos
                setTimeout(() => {
                    successMessage.style.opacity = '0';
                    successMessage.style.transition = 'opacity 0.5s ease';
                    
                    setTimeout(() => {
                        successMessage.remove();
                    }, 500);
                }, 3000);
            } catch (error) {
                console.error('Error al abrir WhatsApp:', error);
                alert('Hubo un problema al intentar abrir WhatsApp. Por favor intenta nuevamente.');
            } finally {
                // Restaurar el botón
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalButtonContent;
                submitBtn.classList.remove('processing');
            }
        }, 1000);
    });
    
    // Añadir estilos para el spinner
    const style = document.createElement('style');
    style.textContent = `
        .processing {
            opacity: 0.8;
            cursor: not-allowed;
        }
        
        .spinner {
            display: inline-block;
            width: 18px;
            height: 18px;
            border: 2px solid rgba(255,255,255,0.3);
            border-radius: 50%;
            border-top-color: #fff;
            animation: spin 0.8s linear infinite;
            margin-right: 8px;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
});