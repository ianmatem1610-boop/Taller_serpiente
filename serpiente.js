// 1.capturamos el canvas y lo del dibujo
const canvas = document.getElementById("canvasJuego"); 
const ctx = canvas.getContext("2d"); 

// 2. Constantes del juego
const TAMANIO_CELDA = 25; // Tamaño de cada cuadrado de la cuadrícula 

// primera pintura del juego al cargar la página
dibujarTodo();

// ===================
// FUNCIONES DEL DIBUJO
// =========================

function limpiarCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/*
 * dibujar la cuadrícula del tablero usando líneas verticales y horizontales
 */
function dibujarTablero() { 
  // definimos eñ color suave para las líneas de la cuadrícula
  ctx.strokeStyle = "#1e293b"; 
  ctx.lineWidth = 1;

  // --- LINEAS VERTICALES: Paso 9 ---
  // incrementamos la posición en X de 25 en 25 (TAMAÑO_CELDA) hasta el ancho del canvas
  for (let x = 0; x <= canvas.width; x += TAMANIO_CELDA) {
    ctx.beginPath(); 
    ctx.moveTo(x, 0); // Inicio de la parte de arriba: (X actual, Y = 0) 
    ctx.lineTo(x, canvas.height); // Fin  de la parte de abajo: (X actual, Y = alto total) 
    ctx.stroke(); // Dibuja la línea horizontal
  }


  // --- LÍNEAS HORIZONTALES: Paso 10 ---

  //icrementamos la posición en Y de 25 en 25 (TAMANIO_CELDA) hasta el alto del estilo de canvas
  for (let y = 0; y <= canvas.height; y += TAMANIO_CELDA) { 
    ctx.beginPath(); // [cite: 71]
    ctx.moveTo(0, y); // Inicio de la  izquierda  (X = 0, Y actual)
    ctx.lineTo(canvas.width, y); // Fin  de la parte derecha (X = ancho total, Y actual) 
    ctx.stroke(); // dibuja la línea vertical 
  }
}

function dibujarTodo() {
  limpiarCanvas(); 
  dibujarTablero(); // Llamamos a la función para pintar el tablero del paso 7
}