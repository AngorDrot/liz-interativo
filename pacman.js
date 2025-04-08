
// Seleciona o elemento do Pacman e os três fantasmas na tela
const pacman = document.getElementById("pacman");
const ghosts = [
  document.getElementById("ghost1"),
  document.getElementById("ghost2"),
  document.getElementById("ghost3")
];

// Carrega o som do Pacman andando
const waka = new Audio("sounds/waka.mp3");
waka.loop = true;

// Posição inicial no centro da tela
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let lastX = mouseX;
let lastY = mouseY;

let isMoving = false;
let moveTimeout;

/**
 * Atualiza posição do Pacman na tela
 */
function updatePacmanPosition(x, y) {
  pacman.style.left = `${x - 20}px`;
  pacman.style.top = `${y - 20}px`;
}

/**
 * Atualiza direção visual do Pacman
 */
function updatePacmanDirection(x, y) {
  const dx = x - lastX;
  const dy = y - lastY;

  if (Math.abs(dx) > Math.abs(dy)) {
    pacman.style.transform = dx > 0 ? "rotate(0deg)" : "scaleX(-1)";
  } else {
    pacman.style.transform = dy > 0 ? "rotate(90deg)" : "rotate(-90deg)";
  }
}

/**
 * Controla o som e a movimentação do Pacman
 */
function handleMovement(x, y) {
  if (!isMoving) {
    isMoving = true;
    waka.play();
  }

  clearTimeout(moveTimeout);
  moveTimeout = setTimeout(() => {
    isMoving = false;
    waka.pause();
    waka.currentTime = 0;
  }, 200);

  updatePacmanDirection(x, y);
  updatePacmanPosition(x, y);

  lastX = x;
  lastY = y;
}

/**
 * Eventos de movimento para mouse (desktop)
 */
function setupMouseMovement() {
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    handleMovement(mouseX, mouseY);
  });

  document.addEventListener("mouseenter", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    lastX = mouseX;
    lastY = mouseY;
    updatePacmanPosition(mouseX, mouseY);
  });
}

/**
 * Eventos de toque contínuo para dispositivos móveis
 */
function setupTouchMovement() {
  document.addEventListener("touchstart", (e) => {
    e.preventDefault(); // Impede a rolagem
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      mouseX = touch.clientX;
      mouseY = touch.clientY;
      handleMovement(mouseX, mouseY);
    }
  }, { passive: false });

  document.addEventListener("touchmove", (e) => {
    e.preventDefault(); // Impede a rolagem
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      mouseX = touch.clientX;
      mouseY = touch.clientY;
      handleMovement(mouseX, mouseY);
    }
  }, { passive: false });

  document.addEventListener("touchend", () => {
    waka.pause();
    waka.currentTime = 0;
    isMoving = false;
  });
}

/**
 * Cria uma mensagem na tela quando o fantasma pega o jogador
 */
function createGameOverMessage() {
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

/**
 * Fantasmas perseguem o cursor/touch e detectam colisão
 */
function setupGhosts() {
  ghosts.forEach((ghost, index) => {
    let x, y;
    do {
      x = Math.random() * window.innerWidth;
      y = Math.random() * window.innerHeight;
    } while (Math.abs(x - mouseX) < 200 && Math.abs(y - mouseY) < 200);

    function moveGhost() {
      const speed = 0.03 + index * 0.02;
      x += (mouseX - x) * speed;
      y += (mouseY - y) * speed;

      ghost.style.transform = `translate(${x}px, ${y}px)`;

      const dist = Math.hypot(mouseX - x, mouseY - y);
      if (dist < 30 && !window.cliqueConfirmado && !window.pegou) {
        window.pegou = true;

        const audio = new Audio("https://www.myinstants.com/media/sounds/windows-error.mp3");
        audio.play();

        createGameOverMessage();
        setTimeout(() => location.reload(), 3000);
      }

      requestAnimationFrame(moveGhost);
    }

    moveGhost();
  });
}

/**
 * Início do jogo
 */
document.addEventListener("DOMContentLoaded", () => {
  updatePacmanPosition(mouseX, mouseY);
  setupMouseMovement();
  setupTouchMovement();
  setupGhosts();
});
