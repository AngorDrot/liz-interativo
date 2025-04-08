// Seleciona o elemento do Pacman e os três fantasmas na tela
const pacman = document.getElementById("pacman");
const ghosts = [
  document.getElementById("ghost1"),
  document.getElementById("ghost2"),
  document.getElementById("ghost3")
];

// Carrega o som do Pacman (efeito "waka waka") e configura para repetir continuamente
const waka = new Audio("sounds/waka.mp3");
waka.loop = true;

// Define a posição inicial do Pacman (centro da tela)
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let lastX = mouseX;
let lastY = mouseY;

let isMoving = false; // Indica se o Pacman está em movimento
let moveTimeout;      // Armazena o temporizador para pausar o som após inatividade

/**
 * Atualiza a posição visual do Pacman na tela
 */
function updatePacmanPosition(x, y) {
  pacman.style.left = `${x - 20}px`; // Centraliza o Pacman horizontalmente
  pacman.style.top = `${y - 20}px`;  // Centraliza o Pacman verticalmente
}

/**
 * Atualiza a orientação visual do Pacman com base no movimento
 */
function updatePacmanDirection(x, y) {
  const dx = x - lastX; // Diferença horizontal em relação à última posição
  const dy = y - lastY; // Diferença vertical em relação à última posição

  // Se o movimento for mais horizontal, inverte a imagem se for à esquerda
  if (Math.abs(dx) > Math.abs(dy)) {
    pacman.style.transform = dx > 0 ? "rotate(0deg)" : "scaleX(-1)";
  } else {
    // Se o movimento for mais vertical, rotaciona a imagem conforme a direção
    pacman.style.transform = dy > 0 ? "rotate(90deg)" : "rotate(-90deg)";
  }
}

/**
 * Controla a movimentação, som e atualiza a posição e direção do Pacman
 */
function handleMovement(x, y) {
  if (!isMoving) {
    isMoving = true;
    waka.play(); // Toca o som assim que o movimento inicia
  }

  // Reinicia o temporizador: se não houver movimento por 200ms, para o som
  clearTimeout(moveTimeout);
  moveTimeout = setTimeout(() => {
    isMoving = false;
    waka.pause();
    waka.currentTime = 0;
  }, 200);

  updatePacmanDirection(x, y); // Atualiza a direção visual do Pacman
  updatePacmanPosition(x, y);  // Atualiza a posição na tela

  // Salva as posições atuais para o cálculo na próxima atualização
  lastX = x;
  lastY = y;

  // Em dispositivos com suporte a toque, verifica a colisão com o botão "NÃO"
  if ('ontouchstart' in window) {
    checkCollisionWithBtnNao();
  }
}

/**
 * Configura os eventos para movimento com o mouse (desktop)
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
 * Configura os eventos para toque (touch) e arraste contínuo (mobile)
 */
function setupTouchMovement() {
  document.addEventListener("touchstart", (e) => {
    e.preventDefault(); // Impede comportamentos padrão, como rolagem
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      mouseX = touch.clientX;
      mouseY = touch.clientY;
      handleMovement(mouseX, mouseY);
    }
  }, { passive: false });

  document.addEventListener("touchmove", (e) => {
    e.preventDefault(); // Impede a rolagem enquanto o dedo está sendo arrastado
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      mouseX = touch.clientX;
      mouseY = touch.clientY;
      handleMovement(mouseX, mouseY);
    }
  }, { passive: false });

  document.addEventListener("touchend", () => {
    // Quando o toque termina, para o som e o movimento
    waka.pause();
    waka.currentTime = 0;
    isMoving = false;
  });
}

/**
 * Verifica se há colisão entre o Pacman e o botão "NÃO".
 * Se houver, reposiciona aleatoriamente o botão "NÃO" na tela.
 */
function checkCollisionWithBtnNao() {
  const btnNao = document.getElementById("btn-nao");
  if (!btnNao) return;

  // Obtém as dimensões e posição do Pacman e do botão "NÃO"
  const pacmanRect = pacman.getBoundingClientRect();
  const btnRect = btnNao.getBoundingClientRect();

  // Checa se há interseção entre os retângulos dos elementos
  if (
    pacmanRect.right > btnRect.left &&
    pacmanRect.left < btnRect.right &&
    pacmanRect.bottom > btnRect.top &&
    pacmanRect.top < btnRect.bottom
  ) {
    // Calcula uma nova posição aleatória para o botão "NÃO" dentro dos limites da tela
    const btnWidth = btnNao.offsetWidth;
    const btnHeight = btnNao.offsetHeight;
    const padding = 10;
    const maxX = window.innerWidth - btnWidth - padding;
    const maxY = window.innerHeight - btnHeight - padding;
    const newX = Math.floor(Math.random() * maxX);
    const newY = Math.floor(Math.random() * maxY);

    // Atualiza a posição do botão "NÃO"
    btnNao.style.left = `${newX}px`;
    btnNao.style.top = `${newY}px`;
  }
}

/**
 * Configura os fantasmas para perseguir o Pacman e detectar colisões
 */
function setupGhosts() {
  ghosts.forEach((ghost, index) => {
    let x, y;
    // Gera uma posição inicial para o fantasma longe do Pacman
    do {
      x = Math.random() * window.innerWidth;
      y = Math.random() * window.innerHeight;
    } while (Math.abs(x - mouseX) < 200 && Math.abs(y - mouseY) < 200);

    /**
     * Função recursiva para movimentar o fantasma em direção ao Pacman
     */
    function moveGhost() {
      const speed = 0.03 + index * 0.02; // Velocidade variável para cada fantasma
      x += (mouseX - x) * speed;
      y += (mouseY - y) * speed;

      // Atualiza a posição visual do fantasma
      ghost.style.transform = `translate(${x}px, ${y}px)`;

      const dist = Math.hypot(mouseX - x, mouseY - y);
      // Se a distância for menor que 30px e não houver clique confirmado, encerra o jogo
      if (dist < 30 && !window.cliqueConfirmado && !window.pegou) {
        window.pegou = true;
        const audio = new Audio("https://www.myinstants.com/media/sounds/windows-error.mp3");
        audio.play();
        createGameOverMessage();
        setTimeout(() => location.reload(), 3000);
      }
      requestAnimationFrame(moveGhost); // Continua a animação em loop
    }

    moveGhost();
  });
}

/**
 * Cria e exibe uma mensagem de "Game Over" na tela
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
 * Inicia o jogo assim que todo o conteúdo do DOM estiver carregado:
 * - Atualiza a posição inicial do Pacman
 * - Configura os eventos para mouse e toque
 * - Inicializa os fantasmas
 */
document.addEventListener("DOMContentLoaded", () => {
  updatePacmanPosition(mouseX, mouseY);
  setupMouseMovement();
  setupTouchMovement();
  setupGhosts();
});
