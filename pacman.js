
const ghosts = [
  document.getElementById("ghost1"),
  document.getElementById("ghost2"),
  document.getElementById("ghost3")
];

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let lastX = mouseX;
let lastY = mouseY;

function getCursorPosition() {
    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      lastX = mouseX;
      lastY = mouseY;
  
      pacman.style.left = `${mouseX - 20}px`;
      pacman.style.top = `${mouseY - 20}px`;
    });
  }
  
const pacman = document.getElementById("pacman");
const waka = new Audio("sounds/waka.mp3");
waka.loop = true; // toca continuamente enquanto se move

document.addEventListener("DOMContentLoaded", () => {
    document.body.focus();
    getCursorPosition(); // ativa rastreamento inicial forçado
  });
  
document.addEventListener("mouseenter", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    lastX = mouseX;
    lastY = mouseY;
  
    pacman.style.left = `${mouseX - 20}px`;
    pacman.style.top = `${mouseY - 20}px`;
  });
  
  let isMoving = false;
  let moveTimeout;
  
document.addEventListener("mousemove", (e) => {
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

  mouseX = e.clientX;
  mouseY = e.clientY;
  const dx = mouseX - lastX;
  const dy = mouseY - lastY;
  
  if (Math.abs(dx) > Math.abs(dy)) {
    // Movimento horizontal
    if (dx > 0) {
      pacman.style.transform = "rotate(0deg)"; // Direita
    } else {
      pacman.style.transform = "scaleX(-1)"; // Esquerda
    }
  } else {
    // Movimento vertical
    if (dy > 0) {
      pacman.style.transform = "rotate(90deg)"; // Baixo
    } else {
      pacman.style.transform = "rotate(-90deg)"; // Cima
    }
  }
  
  lastX = mouseX;
  lastY = mouseY;
  
  pacman.style.left = `${mouseX - 20}px`;
  pacman.style.top = `${mouseY - 20}px`;
});

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

    // Detectar colisão entre fantasma e cursor
    const dist = Math.hypot(mouseX - x, mouseY - y);
    if (dist < 30 && !window.cliqueConfirmado && !window.pegou) {
        window.pegou = true;
      
        // Áudio de erro
        const audio = new Audio("https://www.myinstants.com/media/sounds/windows-error.mp3");
        audio.play();
      
        // Texto animado
        const aviso = document.createElement("div");
        aviso.innerText = "💀 O fantasma te pegou antes de clicar em SIM!";
        aviso.style.position = "fixed";
        aviso.style.top = "40%";
        aviso.style.left = "50%";
        aviso.style.transform = "translate(-50%, -50%)";
        aviso.style.background = "rgba(0,0,0,0.85)";
        aviso.style.color = "white";
        aviso.style.padding = "20px 30px";
        aviso.style.fontSize = "1.5rem";
        aviso.style.borderRadius = "15px";
        aviso.style.zIndex = "9999";
        aviso.style.textAlign = "center";
        aviso.style.boxShadow = "0 0 10px red";
        aviso.style.opacity = "0";
        aviso.style.transition = "opacity 1s ease-in";
      
        document.body.appendChild(aviso);
        setTimeout(() => { aviso.style.opacity = "1"; }, 10);
      
        setTimeout(() => {
          location.reload();
        }, 3000);
      }
      
      
    requestAnimationFrame(moveGhost);
  }

  moveGhost();
});
