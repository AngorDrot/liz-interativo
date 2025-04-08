// 🎮 Seleciona Pacman e os fantasmas
const pacman = document.getElementById("pacman");
const fantasmas = [
  document.getElementById("ghost1"),
  document.getElementById("ghost2"),
  document.getElementById("ghost3")
];

// 🔊 Som do Pacman (loop contínuo)
const waka = new Audio("sounds/waka.mp3");
waka.loop = true;

// 🎯 Define posição inicial do Pacman
let posX = window.innerWidth / 2;
let posY = window.innerHeight / 2;
let ultimaX = posX;
let ultimaY = posY;

let emMovimento = false;
let tempoInatividade;

// 📍 Atualiza a posição visual do Pacman
function atualizarPacmanPosicao(x, y) {
  pacman.style.left = `${x - 20}px`;
  pacman.style.top = `${y - 20}px`;
}

// 🔄 Altera a direção visual com base no movimento
function atualizarDirecao(x, y) {
  const dx = x - ultimaX;
  const dy = y - ultimaY;

  if (Math.abs(dx) > Math.abs(dy)) {
    pacman.style.transform = dx > 0 ? "rotate(0deg)" : "scaleX(-1)";
  } else {
    pacman.style.transform = dy > 0 ? "rotate(90deg)" : "rotate(-90deg)";
  }
}

// 🧠 Controla movimento e som do Pacman
function moverPacman(x, y) {
  if (!emMovimento) {
    emMovimento = true;
    waka.play();
  }

  clearTimeout(tempoInatividade);
  tempoInatividade = setTimeout(() => {
    emMovimento = false;
    waka.pause();
    waka.currentTime = 0;
  }, 200);

  atualizarDirecao(x, y);
  atualizarPacmanPosicao(x, y);
  ultimaX = x;
  ultimaY = y;

  if ('ontouchstart' in window) {
    verificarColisaoComBotao();
  }
}

// 🖱️ Detecta movimento com mouse
function configurarMouse() {
  document.addEventListener("mousemove", (e) => {
    posX = e.clientX;
    posY = e.clientY;
    moverPacman(posX, posY);
  });

  document.addEventListener("mouseenter", (e) => {
    posX = e.clientX;
    posY = e.clientY;
    ultimaX = posX;
    ultimaY = posY;
    atualizarPacmanPosicao(posX, posY);
  });
}

// 🤲 Detecta toque em dispositivos móveis
function configurarToque() {
  document.addEventListener("touchstart", (e) => {
    e.preventDefault();
    if (e.touches.length > 0) {
      const toque = e.touches[0];
      posX = toque.clientX;
      posY = toque.clientY;
      moverPacman(posX, posY);
    }
  }, { passive: false });

  document.addEventListener("touchmove", (e) => {
    e.preventDefault();
    if (e.touches.length > 0) {
      const toque = e.touches[0];
      posX = toque.clientX;
      posY = toque.clientY;
      moverPacman(posX, posY);
    }
  }, { passive: false });

  document.addEventListener("touchend", () => {
    waka.pause();
    waka.currentTime = 0;
    emMovimento = false;
  });
}

// 🔄 Detecta colisão com botão "NÃO" e move aleatoriamente
function verificarColisaoComBotao() {
  const botaoNao = document.getElementById("btn-nao");
  if (!botaoNao) return;

  const areaPacman = pacman.getBoundingClientRect();
  const areaBotao = botaoNao.getBoundingClientRect();

  if (
    areaPacman.right > areaBotao.left &&
    areaPacman.left < areaBotao.right &&
    areaPacman.bottom > areaBotao.top &&
    areaPacman.top < areaBotao.bottom
  ) {
    const larguraBotao = botaoNao.offsetWidth;
    const alturaBotao = botaoNao.offsetHeight;
    const margem = 10;
    const maxX = window.innerWidth - larguraBotao - margem;
    const maxY = window.innerHeight - alturaBotao - margem;

    const novoX = Math.floor(Math.random() * maxX);
    const novoY = Math.floor(Math.random() * maxY);

    botaoNao.style.left = `${novoX}px`;
    botaoNao.style.top = `${novoY}px`;
  }
}

// 👻 Move os fantasmas em direção ao Pacman e detecta colisão
function configurarFantasmas() {
  fantasmas.forEach((fantasma, indice) => {
    let x, y;
    do {
      x = Math.random() * window.innerWidth;
      y = Math.random() * window.innerHeight;
    } while (Math.abs(x - posX) < 200 && Math.abs(y - posY) < 200);

    function moverFantasma() {
      const velocidade = 0.03 + indice * 0.02;
      x += (posX - x) * velocidade;
      y += (posY - y) * velocidade;

      fantasma.style.transform = `translate(${x}px, ${y}px)`;

      const distancia = Math.hypot(posX - x, posY - y);
      if (distancia < 30 && !window.cliqueConfirmado && !window.pegou) {
        window.pegou = true;
        const somErro = new Audio("https://www.myinstants.com/media/sounds/windows-error.mp3");
        somErro.play();
        mostrarMensagemGameOver();
        setTimeout(() => location.reload(), 3000);
      }

      requestAnimationFrame(moverFantasma);
    }

    moverFantasma();
  });
}

// ❌ Exibe mensagem de fim de jogo
function mostrarMensagemGameOver() {
  const aviso = document.createElement("div");
  aviso.innerText = "💀 O fantasma te pegou antes de clicar em SIM!";
  Object.assign(aviso.style, {
    position: "fixed",
    top: "40%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: "rgba(0,0,0,0.85)",
    color: "white",
    padding: "20px 30px",
    fontSize: "1.5rem",
    borderRadius: "15px",
    zIndex: "9999",
    textAlign: "center",
    boxShadow: "0 0 10px red",
    opacity: "0",
    transition: "opacity 1s ease-in"
  });
  document.body.appendChild(aviso);
  setTimeout(() => aviso.style.opacity = "1", 10);
}

// ✅ Redirecionamento ao clicar no botão SIM (inclusive no mobile)
function configurarBotaoSim() {
  const botaoSim = document.getElementById("btn-sim");
  if (!botaoSim) return;

  botaoSim.addEventListener("click", () => {
    window.cliqueConfirmado = true;
    window.location.href = "musica.html";
  });

  // Suporte a toque (mobile)
  botaoSim.addEventListener("touchstart", () => {
    window.cliqueConfirmado = true;
    window.location.href = "musica.html";
  }, { passive: true });
}

// 🚀 Inicializa o jogo quando a página carregar
document.addEventListener("DOMContentLoaded", () => {
  atualizarPacmanPosicao(posX, posY);
  configurarMouse();
  configurarToque();
  configurarFantasmas();
  configurarBotaoSim(); // 🎯 Redirecionamento garantido
});
