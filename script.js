// SkillCraft Stopwatch Engine with 3D Confetti & Flip Digits
const display = document.getElementById("display");
const startStopBtn = document.getElementById("startStop");
const resetBtn = document.getElementById("reset");
const lapBtn = document.getElementById("lap");
const lapList = document.getElementById("lapList");
const statusDot = document.getElementById("statusDot");
const confettiCanvas = document.getElementById("confetti");

let startTime = 0;
let elapsedTime = 0;
let timerInterval = null;
let laps = [];
let lapCount = 0;
let isRunning = false;

function formatTime(ms) {
  const milliseconds = ms % 1000;
  const seconds = Math.floor(ms / 1000) % 60;
  const minutes = Math.floor(ms / 60000) % 60;
  const hours = Math.floor(ms / 3600000);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(milliseconds).padStart(3, "0")}`;
}

function updateDisplay() {
  const formatted = formatTime(elapsedTime);
  const container = display;

  if (container.children.length === 0) {
    for (let i = 0; i < formatted.length; i++) {
      const box = document.createElement("div");
      box.className = "digit-box";
      const digit = document.createElement("div");
      digit.className = "digit";
      digit.textContent = formatted[i];
      box.appendChild(digit);
      container.appendChild(box);
    }
  } else {
    for (let i = 0; i < formatted.length; i++) {
      const digitEl = container.children[i].firstChild;
      if (digitEl.textContent !== formatted[i]) {
        digitEl.classList.remove("flip");
        void digitEl.offsetWidth;
        digitEl.textContent = formatted[i];
        digitEl.classList.add("flip");
      }
    }
  }
}

function startTimer() {
  startTime = Date.now() - elapsedTime;
  timerInterval = setInterval(() => {
    elapsedTime = Date.now() - startTime;
    updateDisplay();
  }, 10);
  isRunning = true;
  updateUI();
}

function pauseTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  updateUI();
}

function resetTimer() {
  pauseTimer();
  elapsedTime = 0;
  updateDisplay();
  laps = [];
  lapCount = 0;
  lapList.innerHTML = "";
  hideConfetti();
}

function recordLap() {
  if (!isRunning) return;
  lapCount++;
  const lapTime = elapsedTime;
  const delta = lapCount > 1 ? lapTime - laps[laps.length - 1].time : lapTime;
  laps.push({ number: lapCount, time: lapTime, delta });
  renderLaps();
  if (lapCount === 1) showConfetti();
}

function renderLaps() {
  lapList.innerHTML = "";
  laps.slice().reverse().forEach((lap) => {
    const li = document.createElement("li");
    li.innerHTML = `<span>Lap ${lap.number}</span><span>${formatTime(lap.delta)}</span>`;
    lapList.appendChild(li);
  });
}

function updateUI() {
  startStopBtn.textContent = isRunning ? "Pause" : "Start";
  statusDot.style.background = isRunning ? "#8b5cf6" : "#e11d48";
  statusDot.style.boxShadow = `0 0 10px ${isRunning ? "#8b5cf6" : "#e11d48"}`;
}

// 🎯 Keyboard Shortcuts
document.addEventListener("keydown", (e) => {
  if (e.key === " " || e.code === "Space") startStopBtn.click();
  if (e.key === "l" || e.key === "L") lapBtn.click();
  if (e.key === "r" || e.key === "R") resetBtn.click();
});


// ⏯️ Button Events
startStopBtn.addEventListener("click", () => {
  isRunning ? pauseTimer() : startTimer();
});
resetBtn.addEventListener("click", resetTimer);
lapBtn.addEventListener("click", recordLap);
