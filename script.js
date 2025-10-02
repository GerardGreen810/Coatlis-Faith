// --- INICIO 1: referencias a los elementos ---
const videoFondo = document.getElementById("backgroundVideoInicio1");
const transicion = document.getElementById("transicionInicio");
const cinematica = document.getElementById("cinematica1");
const menu = document.getElementById("menuInicio1");

// --- INICIO 2: referencias a los elementos ---
const menuInicio2 = document.getElementById("menuInicio2");
const btnContinuar = document.getElementById("btnContinuar");
const btnNueva = document.getElementById("btnNueva");
const btnEpisodios = document.getElementById("btnEpisodios");
const btnSalirEsquina = document.getElementById("btnSalirEsquina");

let partidaEstado = "no_iniciada"; //'iniciada' o 'no_iniciada'

let estado = "on"; //Estado actual: "on", "transition", "off"

//Después de 10 segundos, inicia la transición de las velas a post-reposo
setTimeout(() => {
    if (estado === "on") {
    estado = "transition";
    videoFondo.loop = false; //No se repite la transición, reproducción única
    //Video de prueba para revisar funcionamiento del sistema
    videoFondo.pause();
    videoFondo.src = "videos/candles-off-transition.mp4"; //Ubicación - video de transición
    videoFondo.load();
    videoFondo.play().catch(()=>{}); //Reproducir video

    //Cuando termine la transición pasará al loop post-reposo
    videoFondo.onended = () => {
        if (estado === "transition") {
            estado = "off";
            videoFondo.loop = true;
            //Video de prueba para revisar funcionamiento del sistema
            videoFondo.pause();
            videoFondo.src = "videos/candles-off-loop.mp4"; //Ubicación - video post-reposo
            videoFondo.load();
            videoFondo.play().catch(()=>{}); //Reproducir video
            }
        };
    }
}, 10000); // 10 segundos de espera antes de apagar velas - jugador no da inicio "jugar"


//BOTONES DEL MENÚ - Inicio 1

//Botón para el inicio del juego - PENDIENTE
    
function jugar() {
    // Mostrar pantalla Inicio 2 (sector Jugar)
    menu.style.display = "none";
    menuInicio2.style.display = "block";
    btnSalirEsquina.style.display = "inline-block";

// Actualizar estado del botón Continuar según partidaEstado (se inicializa por comprobación)
  actualizarBotonesSegunEstado();
}

// Mostrar Inicio 1 (volver)
function mostrarInicio1() {
    menu.style.display = "block";
    menuInicio2.style.display = "none";
    btnSalirEsquina.style.display = "none";
}

// Actualiza UI del botón Continuar
function actualizarBotonesSegunEstado() {
    if (partidaEstado === "iniciada") {
        btnContinuar.classList.remove("inactivo");
        btnContinuar.disabled = false;
    } else {
        btnContinuar.classList.add("inactivo");
        btnContinuar.disabled = true;
    }
}

// Acción Continuar
function continuarPartida() {
  if (partidaEstado !== "iniciada") return;

  // Saltar cinemática y arrancar directamente el juego
  transicion.style.opacity = "1";
  menuInicio2.style.display = "none";
  btnSalirEsquina.style.display = "none";

  setTimeout(() => {
    transicion.style.opacity = "0";
    cinematica.style.display = "none";
    iniciarJuego(); // va directo al escenario
  }, 1000);
}

// Acción Episodios (placeholder)
function episodios() {
    alert("Selector de episodios pendiente.");
}

// Acción Nueva partida: guarda estado y reproduce la cinemática obligatoria (no skippable)
function nuevaPartida() {
    // Si ya hay partida iniciada, preguntar para sobreescribir
    if (partidaEstado === "iniciada") {
        if (!confirm("Ya existe una partida iniciada. ¿quieres sobrescribirla con una nueva partida?")) return;
    }

// Guardar en servidor (intento) y fallback a localStorage si falla
fetch("guardar_partida.php", { method: "POST" })
    .then(res => res.text())
    .then(txt => {
    // opcional: comprobar respuesta 'ok'
      partidaEstado = "iniciada";
      localStorage.setItem("partida_estado", "iniciada");
      actualizarBotonesSegunEstado();
    })
    .catch(err => {
      console.warn("No se pudo llamar guardar_partida.php, usando localStorage", err);
      partidaEstado = "iniciada";
      localStorage.setItem("partida_estado", "iniciada");
      actualizarBotonesSegunEstado();
    });

  // Mostrar cinemática obligatoria (sin controles)
  transicion.style.opacity = "1";
  menuInicio2.style.display = "none";
  btnSalirEsquina.style.display = "none";

  setTimeout(() => {
    transicion.style.opacity = "0";
    cinematica.style.display = "block";
    try { cinematica.removeAttribute("controls"); } catch(e){}
    cinematica.play().catch(()=>{ /* si autoplay bloqueado, usuario debe interactuar */ });

    // Cuando termina la cinemática, volvemos a Inicio 1 o arrancamos el juego
    cinematica.onended = () => {
      cinematica.style.display = "none";
      console.log("Cinemática terminada. Iniciando juego...");
      iniciarJuego();
    };
  }, 1500);
}

// Botón Salir (esquina) — volver a Inicio 1
btnSalirEsquina.addEventListener("click", () => {
  mostrarInicio1();
});

// Comprobar estado de partida con PHP (si falla, usar localStorage)
(function comprobarEstadoPartida() {
  fetch("estado_partida.php", { cache: "no-store" })
    .then(res => res.json())
    .then(data => {
      if (data && data.estado === "iniciada") {
        partidaEstado = "iniciada";
      } else {
        partidaEstado = "no_iniciada";
      }
      actualizarBotonesSegunEstado();
    })
    .catch(err => {
      // fallback local para pruebas sin servidor
      const local = localStorage.getItem("partida_estado");
      partidaEstado = (local === "iniciada") ? "iniciada" : "no_iniciada";
      actualizarBotonesSegunEstado();
      console.warn("No se pudo consultar estado_partida.php; usando localStorage.", err);
    });
})();


//BOTONES DE MENÚ - INICIO

//Botón para los créditos del juego - PENDIENTE
function creditos() {
    console.log("Pantalla de Créditos pendientes");
}

//Botón para el salir del juego - PENDIENTE
function salir() {
    console.log("Juego cerrado (simulación, en navegador no se puede cerrar)");
}

//Eliminar datos de partida - EN PRUEBA
function reiniciarPartida() {
    fetch("reiniciar_partida.php", { method: "POST" })
    .then(res => res.text())
    .then(msg => alert(msg));
}

//Comprobar si hay partida guardada - EN PRUEBA
fetch("estado_partida.php")
    .then(res => res.json())
    .then(data => {
    if (data.estado === "iniciada") {
        console.log("Partida guardada detectada.");
    } else {
        console.log("No hay partida guardada.");
    }
});


//JUGABILIDAD - MOVIMIENTO DE PERSONAJE

// Referencias
const escenario = document.getElementById("escenario");

const personaje = document.getElementById("personaje");
const personajeCamina = document.getElementById("personajeCamina");
const personajeContenedor = document.getElementById("personaje-contenedor");

const limitePersonajeIzq = 45; 
const limitePersonajeDer = 55;

// Variables de control
let fondoX = 0;            // posición horizontal del fondo
let limiteIzq = 0;         // límite del mundo (izquierda)
let limiteDer = -1000;     // límite del mundo (derecha, valor negativo)

// Velocidad de movimiento
const velocidad = 4;

let posPersonaje = 50;          // % (50 = centro de pantalla)
const minPercent = 5;           // % mínimo permitido cuando personaje se mueve en extremo
const maxPercent = 95;          // % máximo permitido cuando personaje se mueve en extremo
const centerPercent = 50;       // centro
const velocidadPersonaje = 0.5; // % por frame cuando personaje se mueve solo
const retornoSpeed = 1.2;       // % por frame para que el personaje "vuelva" al centro cuando el fondo se mueva

// Función que arranca el juego tras la cinemática
function iniciarJuego() {
  // detener cinemática
  cinematica.pause();
  cinematica.currentTime = 0;
  cinematica.style.display = "none";

  // detener video de fondo si existe
  if (videoFondo) {
    videoFondo.pause();
    videoFondo.currentTime = 0;
    videoFondo.style.display = "none";
  }

  // detener transiciones
  if (transicion) {
    transicion.style.display = "none";
  }
  
  // mostrar escenario
  escenario.style.display = "block"; 
  fondoX = 0;
  escenario.style.backgroundPosition = "0px 0";
  console.log("Juego iniciado 🚀");
}

// SISTEMA DE MOVIMIETNO - Escuchar teclas
let teclas = { a: false, d: false };

// Escuchar teclas
document.addEventListener("keydown", (e) => {
  if (e.key === "a" || e.key === "A") teclas.a = true;
  if (e.key === "d" || e.key === "D") teclas.d = true;
});

document.addEventListener("keyup", (e) => {
  if (e.key === "a" || e.key === "A") teclas.a = false;
  if (e.key === "d" || e.key === "D") teclas.d = false;

  // Volver a personaje estático
  personaje.style.display = "block";
  personajeCamina.style.display = "none";
  personajeCamina.pause();
});


let fondoImagen = new Image();
fondoImagen.src = "../novela/img/Fondo-prueba.jpg";
fondoImagen.onload = () => {
  calcularLimites();
};

function calcularLimites() {
  const ventanaAncho = window.innerWidth;
  const ventanaAlto = window.innerHeight;

  // Escala del fondo = (alto del viewport) / (alto original de la imagen)
  const escala = ventanaAlto / fondoImagen.height;

  // Ancho real renderizado de la imagen
  const anchoRenderizado = fondoImagen.width * escala;

  limiteIzq = 0;
  limiteDer = -(anchoRenderizado - ventanaAncho);
}

window.addEventListener("resize", calcularLimites);

const rangoMax = 5;    // % margen en extremos


function enExtremo() {
  return (
    (posPersonaje <= minPercent && fondoX === limiteIzq) ||
    (posPersonaje >= maxPercent && fondoX === limiteDer)
  );
}

// Loop de animación para mover fondo
function animarMovimiento() {
  // mostrar/ocultar sprites de caminar
  if ((teclas.a || teclas.d) && !enExtremo()) {
    // Mostrar animación de caminar
    personaje.style.display = "none";
    personajeCamina.style.display = "block";
    if (personajeCamina.paused) {
      personajeCamina.currentTime = 0;
      personajeCamina.play().catch(() => {});
    }
  } else {
    // Mostrar sprite estático
    personaje.style.display = "block";
    personajeCamina.style.display = "none";
    personajeCamina.pause();
  }

  // MOVIMIENTO: izquierda = tecla 'a' (mover mundo a la derecha), derecha = 'd' (mundo a la izquierda)
  if (teclas.a) {
    // mirar a la izquierda (ojo: aquí el flip era al revés antes)
    personajeContenedor.style.transform = "translateX(-50%) scaleX(1)";
  
    // ¿queda fondo por mover a la derecha?
    if (fondoX < limiteIzq && posPersonaje <= centerPercent) {
      // mover el fondo
      fondoX = Math.min(limiteIzq, fondoX + velocidad);
    } else {
      // mover personaje hacia la izquierda
      if (posPersonaje > minPercent) {
        posPersonaje = Math.max(minPercent, posPersonaje - velocidadPersonaje);
      }
      // si ya llegaste al extremo, no mover el fondo hasta que vuelvas al centro
      else if (posPersonaje < centerPercent) {
        posPersonaje = Math.min(centerPercent, posPersonaje + retornoSpeed);
      }
    }
  
  } else if (teclas.d) {
    // mirar a la derecha
    personajeContenedor.style.transform = "translateX(-50%) scaleX(-1)";
  
    // ¿queda fondo por mover a la izquierda?
    if (fondoX > limiteDer && posPersonaje >= centerPercent) {
      // mover el fondo
      fondoX = Math.max(limiteDer, fondoX - velocidad);
    } else {
      // mover personaje hacia la derecha
      if (posPersonaje < maxPercent) {
        posPersonaje = Math.min(maxPercent, posPersonaje + velocidadPersonaje);
      }
      // si ya llegaste al extremo, no mover el fondo hasta que vuelvas al centro
      else if (posPersonaje > centerPercent) {
        posPersonaje = Math.max(centerPercent, posPersonaje - retornoSpeed);
      }
    }
  }  

  // Asegurar que fondoX y posPersonaje estén dentro de sus límites (clamp)
  fondoX = Math.max(limiteDer, Math.min(limiteIzq, fondoX));
  posPersonaje = Math.max(minPercent, Math.min(maxPercent, posPersonaje));

  // Aplicar cambio visual
  escenario.style.backgroundPosition = `${fondoX}px 0`;
  personajeContenedor.style.left = `${posPersonaje}%`;

  requestAnimationFrame(animarMovimiento);
}

animarMovimiento();