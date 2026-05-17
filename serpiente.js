const canvas = document.getElementById("canvasJuego"); 
const ctx = canvas.getContext("2d"); 

const TAMANIO_CELDA = 25; // Tamaño de cada cuadrado de la cuadrícula 

// ===================================
// CREACIÓN DE LA SERPIENTE 
// ==============================
// Cada objeto representa una parte. El primer elemento en el que est en 0 será la cabeza.
const serpiente = [
  { x: 0, y: 10 }, //  esta es la Cabeza
  { x: 0, y: 11 },
  { x: 0, y: 12 },
  { x: 0, y: 13 },
  { x: 0, y: 14 }
];

dibujarTodo();

// ==========================================
// FUNCIONES DEL DIBUJO
// ==========================================

function limpiarCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/*
 * Dibuja la cuadrícula del tablero usando líneas verticales y horizontales
 */
function dibujarTablero() { 
  ctx.strokeStyle = "#1e293b"; 
  ctx.lineWidth = 1;

  // --- LÍNEAS VERTICALES ---
  for (let x = 0; x <= canvas.width; x += TAMANIO_CELDA) {
    ctx.beginPath(); 
    ctx.moveTo(x, 0); 
    ctx.lineTo(x, canvas.height); 
    ctx.stroke(); 
  }

  // --- LÍNEAS HORIZONTALES ---
  for (let y = 0; y <= canvas.height; y += TAMANIO_CELDA) { 
    ctx.beginPath(); 
    ctx.moveTo(0, y); 
    ctx.lineTo(canvas.width, y); 
    ctx.stroke(); 
  }
}

/** Función para pintar un cuadrado basado en coordenadas de cuadrícula*/
function pintarParte(lineaX, lineaY, colorRelleno) { 
  // Calcular la posición de los píxeles dentro del canvas 
  const xReal = lineaX * TAMANIO_CELDA; 
  const yReal = lineaY * TAMANIO_CELDA; 

  // Configurar color de relleno y pintar el cuadrado 
  ctx.fillStyle = colorRelleno; 
  ctx.fillRect(xReal, yReal, TAMANIO_CELDA, TAMANIO_CELDA);

  // Configurar color del borde y dibujarlo 
  ctx.strokeStyle = "#020617";
  ctx.lineWidth = 2;
  ctx.strokeRect(xReal, yReal, TAMANIO_CELDA, TAMANIO_CELDA); 
}

/** Recorre el arreglo de la serpiente para dibujarla por completo*/
function pintarSerpiente() { 
  // Recoremos cada una de las partes del arreglo 
  for (let i = 0; i < serpiente.length; i++) {
    //  La cabeza (índice 0) tiene un color diferente al cuerpo 
    if (i === 0) {
      pintarParte(serpiente[i].x, serpiente[i].y, "#facc15"); // Amarillo para la Cabeza 
    } else {
      pintarParte(serpiente[i].x, serpiente[i].y, "#ef4444"); // Rojo para el Cuerpo 
    }
  }
}

function dibujarTodo() {
  limpiarCanvas(); 
  dibujarTablero(); 

  // --- SECCIÓN DE PRUEBAS OBLIGATORIAS  ---
  // descomenta esta líneas si se necesita mostrar los bloques de prueba individuales:
  /*
  pintarParte(5, 5, "#ef4444");   // PRUEBA 1: Bloque en (5,5) 
  pintarParte(10, 2, "#ef4444");  // PRUEBA 2: Bloque en (10,2) [
  pintarParte(12, 23, "#ef4444"); // PRUEBA 3: Pegado al borde inferior (En canvas de 600px, 600/25 = 24 celdas máximo, la última es 23)
  pintarParte(23, 10, "#ef4444"); // PRUEBA 4: Pegado al borde derecho 
  pintarParte(0, 15, "#ef4444");  // PRUEBA 5: Pegado al borde izquierdo
  pintarParte(23, 23, "#ef4444"); // PRUEBA 6: En una esquina (esquina inferior derecha)
  */

  // PASO 5: invocamos la función de la serpiente armada (esto borra los individuales automáticos) 
  pintarSerpiente(); 
}