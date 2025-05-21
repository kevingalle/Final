// Formatear la fecha y hora
function formatDateTime(date) {
    const options = { 
        day: 'numeric', 
        month: 'short', 
        hour: '2-digit', 
        minute: '2-digit' 
    };
    return new Date(date).toLocaleDateString('es-ES', options);
}

// Evaluar el estado de los sensores
function evaluateStatus(value, type) {
    let statusElement;
    
    switch(type) {
        case 'temp':
            statusElement = document.getElementById('temp-status');
            if (value < 15) {
                statusElement.className = 'status-dot status-warning';
            } else if (value > 30) {
                statusElement.className = 'status-dot status-danger';
            } else {
                statusElement.className = 'status-dot status-optimal';
            }
            break;
        case 'humidity':
            statusElement = document.getElementById('humidity-status');
            if (value < 40) {
                statusElement.className = 'status-dot status-warning';
            } else if (value > 80) {
                statusElement.className = 'status-dot status-danger';
            } else {
                statusElement.className = 'status-dot status-optimal';
            }
            break;
        case 'soil':
            statusElement = document.getElementById('soil-status');
            if (value < 30) {
                statusElement.className = 'status-dot status-danger';
            } else if (value < 50) {
                statusElement.className = 'status-dot status-warning';
            } else {
                statusElement.className = 'status-dot status-optimal';
            }
            break;
    }
}

// Inicializar datos históricos
let tempHistory = new Array(10).fill(0);
let humidityHistory = new Array(10).fill(0);
let timeLabels = new Array(10).fill("");

// Actualizar datos desde ThingSpeak
async function actualizarDatos() {
    try {
        // Obtener los últimos 10 resultados para tener datos históricos para el histograma
        const response = await fetch('https://api.thingspeak.com/channels/2853801/feeds.json?api_key=YBEPNHCO188TOPFW&results=10');
        const data = await response.json();
        
        if (data.feeds && data.feeds.length > 0) {
            // Obtener el último registro para mostrarlo como valor actual
            const lastEntry = data.feeds[data.feeds.length - 1];
            const temp = parseFloat(lastEntry.field1);
            const humedad = parseFloat(lastEntry.field2);
            const humedadSuelo = parseInt(lastEntry.field3);
            const createdAt = lastEntry.created_at;
            const formattedTime = formatDateTime(createdAt);

            // Preparar datos históricos para los gráficos
            tempHistory = [];
            humidityHistory = [];
            timeLabels = [];
            data.feeds.forEach(feed => {
                tempHistory.push(parseFloat(feed.field1));
                humidityHistory.push(parseFloat(feed.field2));
                timeLabels.push(formatDateTime(feed.created_at));
            });
            
            // Invertir los arrays para que los datos más recientes estén a la derecha
            tempHistory.reverse();
            humidityHistory.reverse();
            timeLabels.reverse();

            // Actualizar valores en el DOM
            document.getElementById('temp-updated').textContent = formattedTime;
            document.getElementById('humidity-updated').textContent = formattedTime;
            document.getElementById('soil-updated').textContent = formattedTime;
            
            // Evaluar el estado de los sensores
            evaluateStatus(temp, 'temp');
            evaluateStatus(humedad, 'humidity');
            
            // Calcular porcentaje de humedad del suelo (asumiendo un rango de 0-1023)
            let humedadPorcentaje = Math.min(100, Math.max(0, (humedadSuelo / 1023) * 100));
            let secoPorcentaje = 100 - humedadPorcentaje;
            
            // Evaluar el estado del suelo
            evaluateStatus(humedadPorcentaje, 'soil');

            // Actualizar el gráfico de temperatura
            tempChart.data.labels = timeLabels;
            tempChart.data.datasets[0].data = tempHistory;
            tempChart.update();

            // Actualizar el gráfico de humedad del aire
            humidityChart.data.labels = timeLabels;
            humidityChart.data.datasets[0].data = humidityHistory;
            humidityChart.update();

            // Actualizar el gráfico de humedad del suelo
            soilChart.data.datasets[0].data = [humedadPorcentaje, secoPorcentaje];
            soilChart.update();
        }
    } catch (error) {
        console.error('Error al obtener datos:', error);
    }
}

// Configurar el gráfico de temperatura
var tempCtx = document.getElementById('tempChart').getContext('2d');
var tempChart = new Chart(tempCtx, {
    type: 'bar',
    data: {
        labels: ["--", "--", "--", "--", "--", "--", "--", "--", "--", "--"],
        datasets: [{
            label: 'Temperatura (°C)',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            backgroundColor: function(context) {
                const value = context.dataset.data[context.dataIndex];
                if (value < 15) return 'rgba(255, 193, 7, 0.7)'; // Amarillo para frío
                if (value > 30) return 'rgba(255, 87, 51, 0.7)'; // Rojo para caliente
                return 'rgba(76, 175, 80, 0.7)'; // Verde para óptimo
            },
            borderColor: function(context) {
                const value = context.dataset.data[context.dataIndex];
                if (value < 15) return 'rgba(255, 193, 7, 1)'; // Amarillo para frío
                if (value > 30) return 'rgba(255, 87, 51, 1)'; // Rojo para caliente
                return 'rgba(76, 175, 80, 1)'; // Verde para óptimo
            },
            borderWidth: 1,
            borderRadius: 5,
            barPercentage: 0.7
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleFont: {
                    size: 16,
                    weight: 'bold'
                },
                bodyFont: {
                    size: 14
                },
                padding: 15,
                callbacks: {
                    label: function(context) {
                        return 'Temperatura: ' + context.parsed.y.toFixed(1) + '°C';
                    }
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: 'rgba(255, 255, 255, 0.7)',
                    maxRotation: 45,
                    minRotation: 45
                },
                grid: {
                    display: false,
                    drawBorder: false
                }
            },
            y: {
                min: 0,
                max: 40,
                ticks: {
                    color: 'rgba(255, 255, 255, 0.7)',
                    stepSize: 5
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            }
        },
        animation: {
            duration: 1000,
            easing: 'easeOutQuart'
        }
    }
});

// Configurar el gráfico de humedad del aire (nuevo gráfico de línea)
var humidityCtx = document.getElementById('humidityChart').getContext('2d');
var humidityChart = new Chart(humidityCtx, {
    type: 'line',
    data: {
        labels: ["--", "--", "--", "--", "--", "--", "--", "--", "--", "--"],
        datasets: [{
            label: 'Humedad (%)',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            backgroundColor: 'rgba(0, 123, 255, 0.1)',
            borderColor: function(context) {
                const value = context.chart.data.datasets[0].data[context.dataIndex];
                if (value < 40) return 'rgba(255, 193, 7, 1)'; // Amarillo para baja
                if (value > 80) return 'rgba(255, 87, 51, 1)'; // Rojo para alta
                return 'rgba(0, 123, 255, 1)'; // Azul para óptima
            },
            borderWidth: 3,
            tension: 0.3,
            fill: true,
            pointBackgroundColor: function(context) {
                const value = context.chart.data.datasets[0].data[context.dataIndex];
                if (value < 40) return 'rgba(255, 193, 7, 1)'; // Amarillo para baja
                if (value > 80) return 'rgba(255, 87, 51, 1)'; // Rojo para alta
                return 'rgba(0, 123, 255, 1)'; // Azul para óptima
            },
            pointBorderColor: '#FFFFFF',
            pointRadius: 5,
            pointHoverRadius: 7
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleFont: {
                    size: 16,
                    weight: 'bold'
                },
                bodyFont: {
                    size: 14
                },
                padding: 15,
                callbacks: {
                    label: function(context) {
                        return 'Humedad: ' + context.parsed.y.toFixed(1) + '%';
                    }
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: 'rgba(255, 255, 255, 0.7)',
                    maxRotation: 45,
                    minRotation: 45
                },
                grid: {
                    display: false,
                    drawBorder: false
                }
            },
            y: {
                min: 0,
                max: 100,
                ticks: {
                    color: 'rgba(255, 255, 255, 0.7)',
                    stepSize: 10
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            }
        },
        animation: {
            duration: 1000,
            easing: 'easeOutQuart'
        }
    }
});

// Configurar el gráfico de humedad del suelo
var ctx = document.getElementById('soilChart').getContext('2d');
var soilChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: ['Húmedo', 'Seco'],
        datasets: [{
            data: [50, 50],
            backgroundColor: ['#0066CC', '#FF5733'],
            hoverBackgroundColor: ['#0055AA', '#e54a2a'],
            borderWidth: 0,
            borderRadius: 5
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#FFFFFF',
                    font: {
                        size: 14,
                        weight: 'bold'
                    },
                    padding: 20
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleFont: {
                    size: 16,
                    weight: 'bold'
                },
                bodyFont: {
                    size: 14
                },
                padding: 15,
                callbacks: {
                    label: function(context) {
                        return context.label + ': ' + context.parsed.toFixed(1) + '%';
                    }
                }
            }
        },
        animation: {
            animateScale: true,
            animateRotate: true
        }
    }
});

// Cargar datos iniciales
document.addEventListener('DOMContentLoaded', function() {
    actualizarDatos();
    
    // Actualizar datos cada 10 segundos
    setInterval(actualizarDatos, 10000);
}); 