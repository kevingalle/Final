// Gráfica profesional para humedad del suelo
document.addEventListener('DOMContentLoaded', function() {
    Chart.defaults.color = '#ffffff';
    Chart.defaults.font.family = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
    
    const ctx = document.getElementById('humedadChart').getContext('2d');
    
    // Definir gradiente para el área bajo la línea
    const gradientFill = ctx.createLinearGradient(0, 0, 0, 400);
    gradientFill.addColorStop(0, 'rgba(76, 175, 80, 0.6)');
    gradientFill.addColorStop(1, 'rgba(76, 175, 80, 0.1)');
    
    // Datos de ejemplo con más precisión
    const datos = [65, 59, 80, 45, 56, 77, 60];
    
    // Configurar anotaciones para valores críticos
    const annotations = {};
    if (Math.min(...datos) < 50) {
        annotations.lowMoisture = {
            type: 'line',
            yMin: 50,
            yMax: 50,
            borderColor: 'rgba(255, 99, 132, 0.7)',
            borderWidth: 2,
            borderDash: [5, 5],
            label: {
                content: 'Nivel crítico',
                enabled: true,
                position: 'start',
                backgroundColor: 'rgba(255, 99, 132, 0.7)',
                font: {
                    weight: 'bold'
                }
            }
        };
    }
    
    // Crear la gráfica mejorada
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
            datasets: [{
                label: 'Nivel de Humedad (%)',
                data: datos,
                backgroundColor: gradientFill,
                borderColor: 'rgba(129, 199, 132, 1)',  // Usando el color de acento
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#ffffff',
                pointBorderColor: 'rgba(76, 175, 80, 1)',
                pointRadius: 6,
                pointHoverRadius: 8,
                pointHoverBackgroundColor: 'rgba(76, 175, 80, 1)',
                pointHoverBorderColor: '#ffffff',
                pointHoverBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    padding: 12,
                    cornerRadius: 8,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += context.parsed.y + '%';
                            return label;
                        }
                    }
                },
                legend: {
                    labels: {
                        color: '#ffffff',
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        padding: 20,
                        boxWidth: 40,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                title: {
                    display: true,
                    text: 'Monitoreo Semanal de Humedad del Suelo',
                    color: 'rgba(129, 199, 132, 1)',
                    font: {
                        size: 18,
                        weight: 'bold'
                    },
                    padding: {
                        top: 10,
                        bottom: 20
                    }
                },
                annotation: {
                    annotations: annotations
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    suggestedMax: 100,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                        lineWidth: 1
                    },
                    border: {
                        color: 'rgba(255, 255, 255, 0.3)',
                        width: 1
                    },
                    ticks: {
                        color: '#ffffff',
                        font: {
                            size: 12
                        },
                        padding: 10,
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    title: {
                        display: true,
                        text: 'Humedad (%)',
                        color: '#ffffff',
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        padding: {
                            top: 0,
                            bottom: 10
                        }
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                        lineWidth: 1,
                        display: true
                    },
                    border: {
                        color: 'rgba(255, 255, 255, 0.3)',
                        width: 1
                    },
                    ticks: {
                        color: '#ffffff',
                        font: {
                            size: 12
                        },
                        padding: 10
                    },
                    title: {
                        display: true,
                        text: 'Días de la Semana',
                        color: '#ffffff',
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        padding: {
                            top: 10,
                            bottom: 0
                        }
                    }
                }
            },
            animations: {
                tension: {
                    duration: 1000,
                    easing: 'linear'
                },
                radius: {
                    duration: 500,
                    easing: 'linear'
                }
            }
        }
    });
    
    // Añadir evento hover para resaltar puntos
    const chartArea = document.getElementById('humedadChart');
    chartArea.addEventListener('mousemove', () => {
        document.body.style.cursor = 'pointer';
    });
    chartArea.addEventListener('mouseleave', () => {
        document.body.style.cursor = 'default';
    });
});