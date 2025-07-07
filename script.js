let saldo = 1000;
let apuestaSeleccionada = null;

const saldoEl = document.getElementById("saldo");
const resultadoEl = document.getElementById("resultado");
const montoInput = document.getElementById("monto");

document.querySelectorAll(".apuesta-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    // Marcar selección
    document.querySelectorAll(".apuesta-btn").forEach(b => b.classList.remove("seleccionada"));
    btn.classList.add("seleccionada");

    // Guardar apuesta
    apuestaSeleccionada = {
      tipo: btn.dataset.tipo,
      valor: btn.dataset.valor
    };
  });
});

document.getElementById("girarBtn").addEventListener("click", () => {
  const monto = parseInt(montoInput.value);

  if (!apuestaSeleccionada) return alert("Elegí una apuesta primero.");
  if (isNaN(monto) || monto <= 0) return alert("Ingresá un monto válido.");
  if (monto > saldo) return alert("No tenés suficiente saldo.");

  // Restar saldo
  saldo -= monto;

  // Resultado ruleta
  const numero = Math.floor(Math.random() * 37); // 0 a 36
  const color = numero === 0 ? "verde" : (esRojo(numero) ? "rojo" : "negro");
  const paridad = numero === 0 ? "ninguna" : (numero % 2 === 0 ? "par" : "impar");

  // Evaluar
  let ganancia = 0;

  if (apuestaSeleccionada.tipo === "color" && apuestaSeleccionada.valor === color) {
    ganancia = monto * 2;
  } else if (apuestaSeleccionada.tipo === "paridad" && apuestaSeleccionada.valor === paridad) {
    ganancia = monto * 2;
  } else if (apuestaSeleccionada.tipo === "numero" && parseInt(apuestaSeleccionada.valor) === numero) {
    ganancia = monto * 36;
  }

  saldo += ganancia;

  resultadoEl.textContent = `🎡 Salió el ${numero} (${color}, ${paridad}). ${ganancia > 0 ? "Ganaste $" + ganancia + "!" : "Perdiste."}`;
  saldoEl.textContent = `Saldo: $${saldo}`;
});

function esRojo(n) {
  const rojos = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
  return rojos.includes(n);
}
