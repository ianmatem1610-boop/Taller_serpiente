const canvas = document.getElementById("canvasJuego"); 
const ctx = canvas.getContext("2d"); 


const elementoPuntaje = document.getElementById("puntaje");
const elementoEstado = document.getElementById("estado");
const elementoMensaje = document.getElementById("mensaje");

const TAMANIO_CELDA = 25; // Tamaño de cada cuadrado de la cuadrícula 

// ===================================
// VARIABLES GLOBALES DEL JUEGO
// ===================================
// cada objeto representa una parte. El primer elemento [0] es la cabeza.
let serpiente = [
  { x: 10, y: 10 }, 
  { x: 10, y: 11 },
  { x: 10, y: 12 },
  { x: 10, y: 13 },
  { x: 10, y: 14 }
];

// Variables de Control Automática
let intervaloSerpiente = null; 
let direccionActual = "arriba"; // Dirección inicial por defecto
let puntaje = 0;

// la estructura para almacenar la posición de la comida 
let comida = { x: 0, y: 0 };


generarComidaAleatoria();
dibujarTodo();

// =========
// FUNCIONES DE MOVIMIENTO 
// ==========

function moverDerecha() {
  const cabeza = serpiente[0]; 
  const nuevaCabeza = { x: cabeza.x + 1, y: cabeza.y }; 
  serpiente.unshift(nuevaCabeza); 
  procesarAvanzado();
}

function moverIzquierda() { 
  const cabeza = serpiente[0];
  const nuevaCabeza = { x: cabeza.x - 1, y: cabeza.y };
  serpiente.unshift(nuevaCabeza);
  procesarAvanzado();
}

function moverArriba() { 
  const cabeza = serpiente[0];
  const nuevaCabeza = { x: cabeza.x, y: cabeza.y - 1 };
  serpiente.unshift(nuevaCabeza);
  procesarAvanzado();
}

function moverAbajo() {
  const cabeza = serpiente[0];
  const nuevaCabeza = { x: cabeza.x, y: cabeza.y + 1 };
  serpiente.unshift(nuevaCabeza);
  procesarAvanzado();
}

/**esto es  para determinar si la serpiente reduce su cola o crece*/
function procesarAvanzado() {
  // la cabeza coincide con la posición de la comida
  if (atrapaComida()) { 
    puntaje += 10; 
    elementoPuntaje.textContent = puntaje;
    generarComidaAleatoria(); // Generamos una nueva comida en otra posición
  } else {
    // Si no come, se elimina el último elemento 
    serpiente.pop(); 
  }
}

// ====================================
// DIRECCIÓN Y FLUIDO 
// ======================

function cambiarDireccion(nuevaDireccion) { 
  // Evitamos que la serpiente se mate sola cuando gira a 180 grados 
  if (nuevaDireccion === "derecha" && direccionActual !== "izquierda") direccionActual = "derecha";
  if (nuevaDireccion === "izquierda" && direccionActual !== "derecha") direccionActual = "izquierda";
  if (nuevaDireccion === "arriba" && direccionActual !== "abajo") direccionActual = "arriba";
  if (nuevaDireccion === "abajo" && direccionActual !== "arriba") direccionActual = "abajo";
}

function moverSerpiente() { 
  console.log("moviendo"); // Validación en consola requerida 

  // Dependiendo de la variable de direccion se ejecuta el movimiento 
  if (direccionActual === "derecha") moverDerecha(); 
  else if (direccionActual === "izquierda") moverIzquierda(); 
  else if (direccionActual === "arriba") moverArriba(); 
  else if (direccionActual === "abajo") moverAbajo();

  dibujarTodo(); 
}

function iniciarJuego() { 
  if (intervaloSerpiente === null) { // Evita duplicar los intervalos si  se presionam muchas veces
    intervaloSerpiente = setInterval(moverSerpiente, 200); 
    elementoEstado.textContent = "Jugando";
    elementoMensaje.textContent = "¡Juego en marcha! Utiliza las flechas para guiar a la serpiente.";
  }
}

function pausarJuego() { 
  if (intervaloSerpiente !== null) {
    clearInterval(intervaloSerpiente); // Parte 6: Detiene el bucle 
    intervaloSerpiente = null;
    elementoEstado.textContent = "Pausado";
    elementoMensaje.textContent = "Juego pausado. Presiona Iniciar para continuar.";
  }
}

function reiniciarJuego() {
  pausarJuego();
  serpiente = [
    { x: 10, y: 10 }, 
    { x: 10, y: 11 },
    { x: 10, y: 12 },
    { x: 10, y: 13 },
    { x: 10, y: 14 }
  ];
  direccionActual = "arriba";
  puntaje = 0;
  elementoPuntaje.textContent = puntaje;
  elementoEstado.textContent = "Listo";
  elementoMensaje.textContent = "Presiona iniciar para comenzar.";
  generarComidaAleatoria();
  dibujarTodo();
}

// ==========================================
// CONTROL DE LA COMIDA Y COLISIÓN
// ==========================================

/**
 * Calcula coordenadas aleatorias lógicas para posicionar la manzana (
 */
function generarComidaAleatoria() {
  // nos da la cantidad máxima de cuadros en X y en Y basada en el tamaño del Canvas 
  const maxLineasX = canvas.width / TAMANIO_CELDA; // 600 / 25 = 24 celdas 
  const maxLineasY = canvas.height / TAMANIO_CELDA; 

  // esto de aqui nos da un número entero entre 0 y el límite 
  comida.x = Math.floor(Math.random() * maxLineasX); 
  comida.y = Math.floor(Math.random() * maxLineasY); 
}

/**
 * Evalúa si la cabeza de la serpiente está tocando el ítem
 */
function atrapaComida() { 
  const cabeza = serpiente[0];
  return cabeza.x === comida.x && cabeza.y === comida.y; 
}

// ==========================================
// FUNCIONES GENERALES DEL RENDERIZADO
// ==========================================

function limpiarCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function dibujarTablero() { 
  ctx.strokeStyle = "#1e293b"; 
  ctx.lineWidth = 1;

  for (let x = 0; x <= canvas.width; x += TAMANIO_CELDA) {
    ctx.beginPath(); 
    ctx.moveTo(x, 0); 
    ctx.lineTo(x, canvas.height); 
    ctx.stroke(); 
  }

  for (let y = 0; y <= canvas.height; y += TAMANIO_CELDA) { 
    ctx.beginPath(); 
    ctx.moveTo(0, y); 
    ctx.lineTo(canvas.width, y); 
    ctx.stroke(); 
  }
}

function pintarParte(lineaX, lineaY, colorRelleno) { 
  const xReal = lineaX * TAMANIO_CELDA; 
  const yReal = lineaY * TAMANIO_CELDA; 

  ctx.fillStyle = colorRelleno; 
  ctx.fillRect(xReal, yReal, TAMANIO_CELDA, TAMANIO_CELDA);

  ctx.strokeStyle = "#020617";
  ctx.lineWidth = 2;
  ctx.strokeRect(xReal, yReal, TAMANIO_CELDA, TAMANIO_CELDA); 
}

function pintarSerpiente() { 
  for (let i = 0; i < serpiente.length; i++) {
    if (i === 0) {
      pintarParte(serpiente[i].x, serpiente[i].y, "#facc15"); // Cabeza Amarilla 
    } else {
      pintarParte(serpiente[i].x, serpiente[i].y, "#ef4444"); // Cuerpo Rojo
    }
  }
}

/**
 * Pinta la comida en su posicion generad
 */
function pintarComida() { 
  pintarParte(comida.x, comida.y, "#22c55e"); 
}

function dibujarTodo() {
  limpiarCanvas(); 
  dibujarTablero(); 
  pintarComida(); 
  pintarSerpiente(); 
}