
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

document.getElementById("btn-sim").addEventListener("click", () => {
  window.cliqueConfirmado = true;
  window.location.href = "musica.html";
});


  //msg.innerText = "Eu te amo mais ainda! 💛🌻";
  //msg.style.position = "fixed";
  //msg.style.bottom = "40px";
  //msg.style.left = "50%";
  //msg.style.transform = "translateX(-50%)";
  //msg.style.fontSize = "2em";
  //msg.style.color = "white";
  //msg.style.textShadow = "2px 2px 5px black";
  //document.body.appendChild(msg);
//});
