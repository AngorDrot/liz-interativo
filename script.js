const btnNao = document.getElementById("btn-nao");

btnNao.addEventListener("mouseenter", () => {
  const btnWidth = btnNao.offsetWidth;
  const btnHeight = btnNao.offsetHeight;
  const padding = 10;

  const maxX = window.innerWidth - btnWidth - padding;
  const maxY = window.innerHeight - btnHeight - padding;

  const newX = Math.floor(Math.random() * maxX);
  const newY = Math.floor(Math.random() * maxY);

  btnNao.style.left = `${newX}px`;
  btnNao.style.top = `${newY}px`;
});

// ✅ BLOCO com clique e toque no botão SIM
const btnSim = document.getElementById("btn-sim");

// Clique para desktop
btnSim.addEventListener("click", () => {
  console.log("Botão SIM clicado!");
  window.cliqueConfirmado = true;
  window.location.href = "musica.html";
});

// Toque para mobile
btnSim.addEventListener("touchstart", () => {
  console.log("Botão SIM tocado!");
  window.cliqueConfirmado = true;
  window.location.href = "musica.html";
}, { passive: true });
