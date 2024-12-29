let muscle1Chart, muscle2Chart, muscle3Chart;
let interval; // Intervalo global
let startTime; // Hora de inicio para las gráficas

// Referencias a los gráficos
const ctx1 = document.getElementById('muscle1').getContext('2d');
const ctx2 = document.getElementById('muscle2').getContext('2d');
const ctx3 = document.getElementById('muscle3').getContext('2d');

// Crear gráficos
function createChart(ctx, label, color) {
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: [], // Etiquetas vacías al inicio
      datasets: [
        {
          label: label,
          data: [], // Datos iniciales vacíos
          borderColor: color,
          tension: 0.3,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false, // Oculta la leyenda
        },
      },
      scales: {
        x: {
          type: 'linear',
          position: 'bottom',
          ticks: { color: '#ffffff', stepSize: 1, maxTicksLimit: 10 },
          grid: { color: '#333333' },
        },
        y: {
          min: 0,
          max: 100,
          ticks: { color: '#ffffff', stepSize: 10 },
          grid: { color: '#333333' },
        },
      },
    },
  });
}

// Inicializar gráficos
muscle1Chart = createChart(ctx1, document.getElementById('muscle1Name').value, 'rgba(0, 255, 0, 1)');
muscle2Chart = createChart(ctx2, document.getElementById('muscle2Name').value, 'rgba(255, 0, 0, 1)');
muscle3Chart = createChart(ctx3, document.getElementById('muscle3Name').value, 'rgba(0, 0, 255, 1)');

// Función para actualizar etiquetas de los gráficos
function updateChartLabels() {
  muscle1Chart.data.datasets[0].label = document.getElementById('muscle1Name').value;
  muscle2Chart.data.datasets[0].label = document.getElementById('muscle2Name').value;
  muscle3Chart.data.datasets[0].label = document.getElementById('muscle3Name').value;
  muscle1Chart.update();
  muscle2Chart.update();
  muscle3Chart.update();
}

// Guardar nombres de los músculos en el almacenamiento local
function saveMuscleNames() {
  const muscle1Name = document.getElementById('muscle1Name').value;
  const muscle2Name = document.getElementById('muscle2Name').value;
  const muscle3Name = document.getElementById('muscle3Name').value;

  localStorage.setItem('muscleNames', JSON.stringify({ muscle1Name, muscle2Name, muscle3Name }));
}

// Cargar nombres de los músculos desde el almacenamiento local
function loadMuscleNames() {
  const muscleNames = JSON.parse(localStorage.getItem('muscleNames'));
  if (muscleNames) {
    document.getElementById('muscle1Name').value = muscleNames.muscle1Name;
    document.getElementById('muscle2Name').value = muscleNames.muscle2Name;
    document.getElementById('muscle3Name').value = muscleNames.muscle3Name;
  }
}

// Cargar nombres de los músculos al cargar la página
window.addEventListener('load', loadMuscleNames);

// Función para agregar datos dinámicos al gráfico
function addData(chart, label, data) {
  chart.data.labels.push(label); // Agregar etiqueta (tiempo)
  chart.data.datasets[0].data.push(data); // Agregar valor (intensidad)

  // Limitar a los últimos 20 puntos
  if (chart.data.labels.length > 20) {
    chart.data.labels.shift(); // Eliminar el primer elemento
    chart.data.datasets[0].data.shift(); // Eliminar el primer dato
  }

  chart.update(); // Actualizar el gráfico
}

// Función para limpiar datos del gráfico y reiniciar nombres de los músculos
function clearData(chart, muscleInput, defaultName) {
  chart.data.labels = [];
  chart.data.datasets[0].data = [];
  chart.update();
  muscleInput.value = defaultName; // Reiniciar nombre del músculo
}

// Actualizar barras de intensidad
function updateIntensityBar(chart, intensityBarId) {
  const latestData = chart.data.datasets[0].data.slice(-1)[0] || 0; // Último valor o 0 si está vacío
  const maxValue = chart.options.scales.y.max; // Máximo valor del eje Y
  const intensityPercentage = (latestData / maxValue) * 100; // Porcentaje de intensidad
  const intensityFill = document.getElementById(intensityBarId);

  // Ajustar ancho y color
  intensityFill.style.width = `${intensityPercentage}%`;
  intensityFill.style.backgroundColor = chart.data.datasets[0].borderColor; // Mismo color que el gráfico
}

// Botón Iniciar
document.getElementById('startBtn').addEventListener('click', () => {
  updateChartLabels(); // Actualizar etiquetas al iniciar
  saveMuscleNames(); // Guardar nombres de los músculos
  document.querySelectorAll('.muscle-name').forEach(input => {
    input.classList.add('muscle-name-active');
    input.setAttribute('readonly', true); // Hacer que los campos sean de solo lectura
  });
  if (!interval) {
    startTime = Date.now(); // Guardar tiempo inicial
    interval = setInterval(() => {
      const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(1); // Tiempo transcurrido en segundos
      const value1 = Math.random() * 100; // Generar valor aleatorio para músculo 1
      const value2 = Math.random() * 100; // Generar valor aleatorio para músculo 2
      const value3 = Math.random() * 100; // Generar valor aleatorio para músculo 3

      // Agregar datos a los gráficos
      addData(muscle1Chart, elapsedTime, value1);
      addData(muscle2Chart, elapsedTime, value2);
      addData(muscle3Chart, elapsedTime, value3);

      // Actualizar barras de intensidad
      updateIntensityBar(muscle1Chart, 'intensity1');
      updateIntensityBar(muscle2Chart, 'intensity2');
      updateIntensityBar(muscle3Chart, 'intensity3');
    }, 500); // Actualizar cada 500 ms
  }
});

// Botón Detener
document.getElementById('stopBtn').addEventListener('click', () => {
  clearInterval(interval); // Detener intervalo
  interval = null;
});

// Botón Borrar
document.getElementById('clearBtn').addEventListener('click', () => {
  clearInterval(interval); // Detener intervalo
  interval = null;
  clearData(muscle1Chart, document.getElementById('muscle1Name'), 'Músculo 1');
  clearData(muscle2Chart, document.getElementById('muscle2Name'), 'Músculo 2');
  clearData(muscle3Chart, document.getElementById('muscle3Name'), 'Músculo 3');
  document.querySelectorAll('.muscle-name').forEach(input => {
    input.classList.remove('muscle-name-active');
    input.removeAttribute('readonly'); // Permitir la edición nuevamente
  });
  saveMuscleNames(); // Guardar los nombres por defecto en el almacenamiento local
});

// Botón Guardar (Abrir ventana emergente)
document.getElementById('saveBtn').addEventListener('click', () => {
  const popup = document.getElementById('popup');
  popup.classList.remove('hidden');
  document.querySelectorAll('.muscle-name').forEach(input => {
    input.removeAttribute('readonly'); // Permitir la edición nuevamente
  });
});

// Botón Compartir en la ventana emergente
document.getElementById('shareBtn').addEventListener('click', () => {
  if (navigator.share) {
    navigator.share({
      title: 'MuscleScanDK',
      text: '¡Revisa mis datos de intensidad muscular!',
      url: window.location.href, // URL actual de la página
    })
      .then(() => alert('¡Contenido compartido exitosamente!'))
      .catch((error) => alert('Error al compartir: ' + error));
  } else {
    alert('La funcionalidad de compartir no está disponible en este dispositivo.');
  }
});

// Botón Guardar en Dispositivo en la ventana emergente
document.getElementById('saveDeviceBtn').addEventListener('click', () => {
  generatePDF(); // Llamar a la función para generar el PDF
  alert('El informe se ha descargado exitosamente.');
});

// Botón Cerrar ventana emergente
document.getElementById('closePopupBtn').addEventListener('click', () => {
  const popup = document.getElementById('popup');
  popup.classList.add('hidden');
});

// Función para generar el PDF
function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Agregar título y secciones para cada gráfico
  doc.setFontSize(20);
  doc.text('Informe de MuscleScanDK', 10, 10);

  doc.setFontSize(16);
  doc.text(document.getElementById('muscle1Name').value, 10, 30);
  doc.addImage(muscle1Chart.toBase64Image(), 'PNG', 10, 40, 180, 60);

  doc.text(document.getElementById('muscle2Name').value, 10, 110);
  doc.addImage(muscle2Chart.toBase64Image(), 'PNG', 10, 120, 180, 60);

  doc.text(document.getElementById('muscle3Name').value, 10, 190);
  doc.addImage(muscle3Chart.toBase64Image(), 'PNG', 10, 200, 180, 60);

  // Guardar el PDF
  doc.save('MuscleScanDK_Report.pdf');
}

// Función para actualizar el estado de conexión
function updateConnectionStatus(status) {
  const ledIndicator = document.getElementById('led-indicator');
  const connectionStatus = document.getElementById('connection-status');

  if (status === 'online') {
    ledIndicator.style.backgroundColor = 'green';
    connectionStatus.textContent = 'Conectado';
  } else if (status === 'offline') {
    ledIndicator.style.backgroundColor = 'red';
    connectionStatus.textContent = 'Desconectado';
  } else if (status === 'problem') {
    ledIndicator.style.backgroundColor = 'yellow';
    connectionStatus.textContent = 'Problemas de conexión';
  }
}

// Abrir ventana emergente de información del dispositivo
document.querySelector('.connection-status').addEventListener('click', () => {
  document.getElementById('deviceInfoPopup').classList.remove('hidden');
});

// Cerrar ventana emergente de información del dispositivo
document.getElementById('closeDeviceInfoPopupBtn').addEventListener('click', () => {
  document.getElementById('deviceInfoPopup').classList.add('hidden');
});

// Ejemplo de cómo actualizar el estado
// Llama a esta función según el estado real de tu dispositivo Arduino
updateConnectionStatus('online'); // o 'offline' o 'problem'