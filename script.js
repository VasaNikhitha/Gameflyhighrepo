const canvas = document.getElementById("aviator-canvas");
const ctx = canvas.getContext("2d");
const multiplierDisplay = document.getElementById("multiplier");
let multiplier = 1.0;
let interval;
let crashPoint = Math.random() * 10 + 1; // Random crash

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight * 0.8;
}
resizeCanvas();
window.onresize = resizeCanvas;

function startGame() {
  multiplier = 1.0;
  crashPoint = Math.random() * 10 + 1;
  multiplierDisplay.textContent = multiplier.toFixed(2) + 'x';
  
  clearInterval(interval);
  interval = setInterval(() => {
    multiplier += 0.01 * multiplier;
    multiplierDisplay.textContent = multiplier.toFixed(2) + 'x';
    drawPlane(multiplier);
    
    if (multiplier >= crashPoint) {
      clearInterval(interval);
      multiplierDisplay.textContent = "💥 CRASHED at " + multiplier.toFixed(2) + "x";
    }
  }, 100);
}

function drawPlane(multiplier) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  const x = (multiplier / crashPoint) * canvas.width;
  const y = canvas.height - (Math.log(multiplier + 1) * 100);
  ctx.arc(x, y, 10, 0, 2 * Math.PI);
  ctx.fillStyle = "red";
  ctx.fill();
}

document.getElementById("bet-btn").addEventListener("click", startGame);
