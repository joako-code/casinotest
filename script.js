let dinero = 1000;
let jugadas = 5;

const dineroEl = document.getElementById("dinero");
const jugadasEl = document.getElementById("jugadas");
const resultadoEl = document.getElementById("resultado");
const spinBtn = document.getElementById("spinBtn");
const rankingEl = document.getElementById("ranking");

function actualizarUI() {
  dineroEl.textContent = `💰 Dinero: $${dinero}`;
  jugadasEl.textContent = `🎯 Jugadas restantes: ${jugadas}`;
}

function girarRuleta() {
  if (jugadas <= 0) return;

  jugadas--;
  const rand = Math.random();
  let mensaje = "";
  let cambio = 0;

  if (rand < 0.10) {
    cambio = 1000;
    mensaje = "¡Verde! Ganaste $1000";
  } else if (rand < 0.50) {
    cambio = -200;
    mensaje = "Rojo. Perdiste $200";
  } else if (rand < 0.90) {
    cambio = 400;
    mensaje = "Negro. Ganaste $400";
  } else {
    cambio = -dinero;
    mensaje = "¡Amarillo! Perdiste todo 💀";
  }

  dinero += cambio;
  if (dinero < 0) dinero = 0;

  resultadoEl.textContent = mensaje;
  actualizarUI();

  if (jugadas === 0) {
    spinBtn.disabled = true;
    subirPuntaje();
  }
}

function subirPuntaje() {
  const nombre = document.getElementById("playerName").value.trim();
  if (!nombre) return alert("Poné tu nombre antes de jugar");

  db.collection("puntajes").doc(nombre).set({
    dinero,
    timestamp: Date.now()
  });

  resultadoEl.textContent += " - Juego terminado.";
}

function cargarRanking() {
  db.collection("puntajes")
    .orderBy("dinero", "desc")
    .limit(10)
    .onSnapshot((snapshot) => {
      rankingEl.innerHTML = "";
      snapshot.forEach((doc) => {
        const data = doc.data();
        const li = document.createElement("li");
        li.textContent = `${doc.id}: $${data.dinero}`;
        rankingEl.appendChild(li);
      });
    });
}

spinBtn.addEventListener("click", girarRuleta);
actualizarUI();
cargarRanking();
