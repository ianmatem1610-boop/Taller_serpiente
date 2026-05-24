// 1. Capturamos el canvas y su contexto de dibujo
const canvas = document.getElementById("canvasJuego");
const ctx = canvas.getContext("2d");


const elementoPuntaje = document.getElementById("puntaje");
const elementoEstado = document.getElementById("estado");
const elementoMensaje = document.getElementById("mensaje");

const TAMANIO_CELDA = 25; // Tamaño de cada cuadrado de la cuadrícula 

// ===================================
// VARIABLES GLOBALES DEL JUEGO
// ===================================
let serpiente = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
  { x: 10, y: 13 },
  { x: 10, y: 14 }
];

// las variables 
let intervaloSerpiente = null;
let direccionActual = "arriba"; // Dirección inicial por defecto
let puntaje = 0;
let juegoTerminado = false; // Controla el GAME OVER

// Variable de  la Velocidad
let velocidad = 200; // Tiempo inicial en milisegundos

// Estructura para almacenar la posición de la comida 
let comida = { x: 0, y: 0 };

// Escuchador de eventos del teclado (Funcionalidad adicional de jugabilidad)
window.addEventListener("keydown", manejarTeclado);

// Inicializamos el juego base
generarComidaAleatoria();
dibujarTodo();

// ==========================================
// FUNCIONES DE MOVIMIENTO Y VALIDACIONES
// ==========================================

function moverDerecha() {
  const cabeza = serpiente[0];
  const nuevaCabeza = { x: cabeza.x + 1, y: cabeza.y };
  if (validarColisionBordes(nuevaCabeza) || validarColisionCuerpo(nuevaCabeza)) return;
  serpiente.unshift(nuevaCabeza);
  procesarAvanzado();
}

function moverIzquierda() {
  const cabeza = serpiente[0];
  const nuevaCabeza = { x: cabeza.x - 1, y: cabeza.y };
  if (validarColisionBordes(nuevaCabeza) || validarColisionCuerpo(nuevaCabeza)) return;
  serpiente.unshift(nuevaCabeza);
  procesarAvanzado();
}

function moverArriba() {
  const cabeza = serpiente[0];
  const nuevaCabeza = { x: cabeza.x, y: cabeza.y - 1 };
  if (validarColisionBordes(nuevaCabeza) || validarColisionCuerpo(nuevaCabeza)) return;
  serpiente.unshift(nuevaCabeza);
  procesarAvanzado();
}

function moverAbajo() {
  const cabeza = serpiente[0];
  const nuevaCabeza = { x: cabeza.x, y: cabeza.y + 1 };
  if (validarColisionBordes(nuevaCabeza) || validarColisionCuerpo(nuevaCabeza)) return;
  serpiente.unshift(nuevaCabeza);
  procesarAvanzado();
}

/** Valida si la cabeza intenta sobrepasar los límites del tablero*/
function validarColisionBordes(cabezaEvaluada) {
  const maxLineasX = canvas.width / TAMANIO_CELDA; // Límite derecho
  const maxLineasY = canvas.height / TAMANIO_CELDA; // Límite inferior

  // Si sobrepasa cualquiera de los 4 bordes (superior, inferior, izquierdo, derecho)
  if (
    cabezaEvaluada.x < 0 ||
    cabezaEvaluada.x >= maxLineasX ||
    cabezaEvaluada.y < 0 ||
    cabezaEvaluada.y >= maxLineasY
  ) {
    ejecutarGameOver();
    return true;
  }
  return false;
}


function validarColisionCuerpo(cabezaEvaluada) {
  for (let i = 1; i < serpiente.length; i++) {
    if (cabezaEvaluada.x === serpiente[i].x && cabezaEvaluada.y === serpiente[i].y) {
      ejecutarGameOver("¡GAME OVER! Has chocado contra tu propio cuerpo.");
      return true;
    }
  }
  return false;
}
/** Detiene el juego y despliega el mensaje de GAME OVER en la pantalla*/
function ejecutarGameOver() {
  pausarJuego();
  juegoTerminado = true;
  elementoEstado.textContent = "GAME OVER";
  elementoMensaje.innerHTML = "<span style='color: #ef4444;'> ¡GAME OVER! Has chocado contra el borde. Presiona Reiniciar.</span>";
}

/** Determina si la serpiente reduce su cola o crece */
function procesarAvanzado() {
  if (atrapaComida()) {
    puntaje += 10;
    elementoPuntaje.textContent = puntaje;
    generarComidaAleatoria();

    // adicional se incrementa velocidad dinámicamente cada vez que come
    if (velocidad > 70) { // Ponemos un límite mínimo
      velocidad -= 10; // Reducir los milisegundos en el que mueva más rápido
      reiniciarIntervaloVelocidad();
    }
  } else {
    serpiente.pop();
  }
}

/**
 * Actualiza el temporizador de forma fluida cuando cambia la velocidad
 */
function reiniciarIntervaloVelocidad() {
  if (intervaloSerpiente !== null) {
    clearInterval(intervaloSerpiente);
    intervaloSerpiente = setInterval(moverSerpiente, velocidad);
  }
}

// ====================================
// DIRECCIÓN Y FLUIDO 
// ====================================

function cambiarDireccion(nuevaDireccion) {
  if (juegoTerminado) return;
  // Si el juego terminó (no permite cambiar direcció)
  // Evitamos que la serpiente retroceda sobre sí misma (Mejora clásica de control)
  if (nuevaDireccion === "derecha" && direccionActual !== "izquierda") direccionActual = "derecha";
  if (nuevaDireccion === "izquierda" && direccionActual !== "derecha") direccionActual = "izquierda";
  if (nuevaDireccion === "arriba" && direccionActual !== "abajo") direccionActual = "arriba";
  if (nuevaDireccion === "abajo" && direccionActual !== "arriba") direccionActual = "abajo";
}

/**Captura las teclas del teclado para controlar el juego de forma cómoda*/
function manejarTeclado(evento) {
  if (evento.key === "ArrowUp" || evento.key === "w" || evento.key === "W") cambiarDireccion("arriba");
  else if (evento.key === "ArrowDown" || evento.key === "s" || evento.key === "S") cambiarDireccion("abajo");
  else if (evento.key === "ArrowLeft" || evento.key === "a" || evento.key === "A") cambiarDireccion("izquierda");
  else if (evento.key === "ArrowRight" || evento.key === "d" || evento.key === "D") cambiarDireccion("derecha");
}

function moverSerpiente() {
  if (juegoTerminado) return;
  console.log("moviendo");

  if (direccionActual === "derecha") moverDerecha();
  else if (direccionActual === "izquierda") moverIzquierda();
  else if (direccionActual === "arriba") moverArriba();
  else if (direccionActual === "abajo") moverAbajo();

  // Solo redibuja si el movimiento no provocó un Game Over instantáneo
  if (!juegoTerminado) {
    dibujarTodo();
  }
}

function iniciarJuego() {
  if (juegoTerminado) return; // No iniciar si está en Game Over

  if (intervaloSerpiente === null) {
    intervaloSerpiente = setInterval(moverSerpiente, velocidad); // se usa la variable de velocidad
    elementoEstado.textContent = "Jugando";
    elementoMensaje.textContent = "¡Juego en marcha! Utiliza las flechas del teclado o los botones.";
  }
}

function pausarJuego() {
  if (intervaloSerpiente !== null) {
    clearInterval(intervaloSerpiente);
    intervaloSerpiente = null;
    if (!juegoTerminado) {
      elementoEstado.textContent = "Pausado";
      elementoMensaje.textContent = "Juego pausado. Presiona Iniciar para continuar.";
    }
  }
}

/**Reinicia por completo todos los parámetros del juego*/
function reiniciarJuego() {
  pausarJuego(); // detiene cualquier bucle  que este activo

  // Reposicionar valores por defecto
  serpiente = [
    { x: 10, y: 10 },
    { x: 10, y: 11 },
    { x: 10, y: 12 },
    { x: 10, y: 13 },
    { x: 10, y: 14 }
  ];
  direccionActual = "arriba";
  puntaje = 0;
  velocidad = 200; // Reiniciar velocidad original
  juegoTerminado = false; // Quitar el estado de GAME OVER

  // actualizar la interfaz visual
  elementoPuntaje.textContent = puntaje;
  elementoEstado.textContent = "Listo";
  elementoMensaje.textContent = "Presiona iniciar para comenzar la nueva partida.";

  generarComidaAleatoria();
  dibujarTodo(); // Limpia y vuelve a pintar el tablero inicial
}

// ==========================================
// CONTROL DE LA COMIDA Y  LA COLISIÓN
// ==========================================

function generarComidaAleatoria() {
  const maxLineasX = canvas.width / TAMANIO_CELDA;
  const maxLineasY = canvas.height / TAMANIO_CELDA;

  comida.x = Math.floor(Math.random() * maxLineasX);
  comida.y = Math.floor(Math.random() * maxLineasY);
  // se evita que la comida aparezca encima del cuerpo de la serpiente
  for (let i = 0; i < serpiente.length; i++) {
    if (serpiente[i].x === comida.x && serpiente[i].y === comida.y) {
      generarComidaAleatoria();
      break;
    }
  }
}

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

function pintarComida() {
  pintarParte(comida.x, comida.y, "#22c55e");
}

function dibujarTodo() {
  limpiarCanvas();
  dibujarTablero();
  pintarComida();
  pintarSerpiente();
}