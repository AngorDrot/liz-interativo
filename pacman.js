// Seleciona o elemento do Pacman e os três fantasmas
const pacman = document.getElementById("pacman");
const ghosts = [
  document.getElementById("ghost1"),
  document.getElementById("ghost2"),
  document.getElementById("ghost3")
];

// Carrega o som do Pacman andando (waka waka) em loop
const waka = new Audio("sounds/waka.mp3");
waka.loop = true;

// Define a posição inicial do cursor/Pacman (centro da tela)
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let lastX = mouseX;
let lastY = mouseY;

let isMoving = false;
let moveTimeout;

/**
 * Atualiza a posição visual do Pacman na tela
 */
function updatePacmanPosition(x, y) {
  pacman.style.left = `${x - 20}px`; // Centraliza o Pacman horizontalmente
  pacman.style.top = `${y - 20}px`;  // Centraliza o Pacman verticalmente
}

/**
 * Atualiza a direção visual do Pacman com base no movimento
 */
function updatePacmanDirection(x, y) {
  const dx = x - lastX;  // Diferença horizontal
  const dy = y - lastY;  // Diferença vertical

  // Verifica se o movimento é predominantemente horizontal ou vertical
  if (Math.abs(dx) > Math.abs(dy)) {
    pacman.style.transform = dx > 0 ? "rotate(0deg)" : "scaleX(-1)"; // Direita ou Esquerda
  } else {
    pacman.style.transform = dy > 0 ? "rotate(90deg)" : "rotate(-90deg)"; // Baixo ou Cima
  }
}

/**
 * Controla o som e a movimentação do Pacman e, em dispositivos touch, verifica colisão com o botão "NÃO"
 */
function handleMovement(x, y) {
  if (!isMoving) {
    isMoving = true;
    waka.play(); // Toca o som ao iniciar o movimento
  }

  // Reinicia o temporizador: após 200ms sem movimento, o som para
  clearTimeout(moveTimeout);
  moveTimeout = setTimeout(() => {
    isMoving = false;
    waka.pause();
    waka.currentTime = 0;
  }, 200);

  // Atualiza a direção e posição do Pacman
  updatePacmanDirection(x, y);
  updatePacmanPosition(x, y);

  // Armazena as últimas posições para o próximo cálculo de direção
  lastX = x;
  lastY = y;

  // Se o dispositivo for touch, verifica colisão entre o Pacman e o botão "NÃO"
  if ('ontouchstart' in window) {
    checkCollisionWithBtnNao();
  }
}

/**
 * Configura os eventos para movimento do mouse (desktop)
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
 * Configura os eventos para toque e arraste contínuo (mobile)
 */
function setupTouchMovement() {
  document.addEventListener("touchstart", (e) => {
    e.preventDefault(); // Impede comportamento padrão (como a rolagem)
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      mouseX = touch.clientX;
      mouseY = touch.clientY;
      handleMovement(mouseX, mouseY);
    }
  }, { passive: false });

  document.addEventListener("touchmove", (e) => {
    e.preventDefault(); // Impede a rolagem enquanto arrasta
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      mouseX = touch.clientX;
      mouseY = touch.clientY;
      handleMovement(mouseX, mouseY);
    }
  }, { passive: false });

  document.addEventListener("touchend", () => {
    // Ao levantar o dedo, para o som e o movimento
    waka.pause();
    waka.currentTime = 0;
    isMoving = false;
  });
}

/**
 * Verifica se o Pacman está colidindo com o botão "NÃO"
 * Em caso afirmativo, reposiciona o botão aleatoriamente na tela.
 */
function checkCollisionWithBtnNao() {
  const btnNao = document.getElementById("btn-nao");
  if (!btnNao) return;

  // Obtém as dimensões e posição do Pacman e do botão
  const pacmanRect = pacman.getBoundingClientRect();
  const btnRect = btnNao.getBoundingClientRect();

  // Checa se há interseção entre os elementos
  if (
    pacmanRect.right > btnRect.left &&
    pacmanRect.left < btnRect.right &&
    pacmanRect.bottom > btnRect.top &&
    pacmanRect.top < btnRect.bottom
  ) {
    // Calcula uma nova posição aleatória para o botão "NÃO"
    const btnWidth = btnNao.offsetWidth;
    const btnHeight = btnNao.offsetHeight;
    const padding = 10;

    const maxX = window.innerWidth - btnWidth - padding;
    const maxY = window.innerHeight - btnHeight - padding;

    const newX = Math.floor(Math.random() * maxX);
    const newY = Math.floor(Math.random() * maxY);

    btnNao.style.left = `${newX}px`;
    btnNao.style.top = `${newY}px`;
  }
}

/**
 * Configura os fantasmas para perseguir o cursor/ toque
 */
function setupGhosts() {
  ghosts.forEach((ghost, index) => {
    let x, y;
    // Garante que o fantasma comece longe do Pacman (não perto do cursor inicial)
    do {
      x = Math.random() * window.innerWidth;
      y = Math.random() * window.innerHeight;
    } while (Math.abs(x - mouseX) < 200 && Math.abs(y - mouseY) < 200);

    /**
     * Movimento contínuo do fantasma em direção ao Pacman
     */
    function moveGhost() {
      const speed = 0.03 + index * 0.02;
      x += (mouseX - x) * speed;
      y += (mouseY - y) * speed;

      ghost.style.transform = `translate(${x}px, ${y}px)`;

      const dist = Math.hypot(mouseX - x, mouseY - y);
      if (dist < 30 && !window.cliqueConfirmado && !window.pegou) {
        window.pegou = true;

        // Toca som de erro e exibe mensagem de game over
        const audio = new Audio("https://www.myinstants.com/media/sounds/windows-error.mp3");
        audio.play();

        createGameOverMessage();
        setTimeout(() => location.reload(), 3000);
      }

      requestAnimationFrame(moveGhost);
    }

    moveGhost(); // Inicia o movimento do fantasma
  });
}

/**
 * Cria e exibe a mensagem de "Game Over" na tela
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
 * Inicia o jogo quando o DOM estiver totalmente carregado:
 * - Define a posição inicial do Pacman.
 * - Ativa os eventos para mouse e touch.
 * - Inicializa os fantasmas.
 */
document.addEventListener("DOMContentLoaded", () => {
  updatePacmanPosition(mouseX, mouseY);
  setupMouseMovement();
  setupTouchMovement();
  setupGhosts();
});
