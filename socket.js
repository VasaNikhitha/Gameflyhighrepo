const betSums = { 0: 0, 1: 0 };
let gameState = null;
let animationStarted = false;
const activeBets = { 0: false, 1: false };
let currentMultiplier = 1;
const cashOutValues = { 0: 0, 1: 0 };
let crashSoundPlayed = false;
const pendingCancel = { 0: false, 1: false };
const wonProcessed = { 0: false, 1: false };

const socket = new WebSocket("wss://wss.polishchuk.com/nonstop-ws");

socket.addEventListener("open", () => {
  console.log("✅ WebSocket connected");
  socket.send(JSON.stringify({
    set: "authentication",
    location: window.location,
    cookie: document.cookie,
    key: "ba614aC3"
  }));
});

function updateBetUI(index, betAmount, multiplier, winAmount, cashOutValue = null) {
  const betEl = document.querySelector(`#bet-inr-${index} strong`);
  const multEl = document.querySelector(`#multiplier-${index} .multiplier`);
  const winEl = document.querySelector(`#win-inr-${index} strong`);

  if (betEl) betEl.innerText = `₹${betAmount.toFixed(2)}`;
  if (multEl) {
    const cashText = cashOutValue !== null ? `${(cashOutValue / 100).toFixed(2)} ` : '';
    multEl.innerText = `${cashText}${multiplier.toFixed(2)}x`;
  }
  if (winEl) winEl.innerText = `${winAmount.toFixed(2)}`;
}

function addTopWinCard(userId, bet, multiplier, win, cashOutValue = null, avatarUrl = '') {
  const container = document.getElementById("topSection");
  const card = document.createElement("div");
  card.className = "card";

  const cashOutText = cashOutValue !== null
    ? `<strong>${(cashOutValue / 100).toFixed(2)}</strong> `
    : '';

  card.innerHTML = `
    <div class="user-infotop">
      <img src="${avatarUrl || 'assets/images/img_ellipse_72.png'}" class="user-img" />
      <div>
        <div class="bet-info">
          <div>Bet INR : <strong>₹${bet.toFixed(2)}</strong></div>
          <div>Cash out : <span class="multiplier">${cashOutText}${multiplier.toFixed(2)}x</span></div>
          <div>Win INR : <strong>₹${win.toFixed(2)}</strong></div>
        </div>
      </div>
    </div>
  `;

  container.prepend(card);
}

socket.addEventListener("message", (event) => {
  console.log("📨 Raw message:", event.data);
  let data;
  try {
    data = JSON.parse(event.data);
  } catch (e) {
    console.error("❌ JSON parse failed", e);
    return;
  }
  console.log(">>> MESSAGE RECEIVED:", data);

  if (data.wallet?.balance !== undefined) {
    updateBalanceDisplay(data.wallet.balance);
  }

  if (data.authentication === true) {
    socket.send(JSON.stringify({ get: "game_list" }));
    return;
  }

  if (data.get === "game_list" || data.game_list) {
    const crackGame = data.game_list.find(g => g.tag === "crs1");
    if (crackGame) {
      socket.send(JSON.stringify({ set: "game", game: "crs1" }));
    }
    return;
  }

  if (data.on?.set === "join" && data.on.game === "crs1") {
    socket.send(JSON.stringify({ get: "options", index: 0 }));
    socket.send(JSON.stringify({ get: "options", index: 1 }));
    return;
  }

  if (data.on?.get === "options") {
    const i = data.on.index;
    const opt = data.options;
    if (!opt || typeof opt.bet_sum !== "number") return;
    activeBets[i] = opt.bet_sum;

    if (opt.bets?.length) {
      const container = document.getElementById(`preset-buttons-${i}`);
      if (container) {
        container.innerHTML = "";
        opt.bets.forEach(val => {
          const btn = document.createElement("div");
          btn.className = "preset-button";
          btn.innerText = val.toFixed(2);
          btn.addEventListener("click", () => {
            document.getElementById(`amount-display-${i}`).innerText = val.toFixed(2);
          });
          container.appendChild(btn);
        });
      }
    }
    return;
  }

  if (data.on?.set === "bet") {
    const i = data.on.index;
    const btn = document.getElementById(`bet-button-${i}`);
    const status = document.getElementById(`bet-status-${i}`);
    const multDisplay = document.getElementById(`cashout-multiplier-${i}`);

    if (data.bet?.cancel === true) {
      console.log(`✅ Bet on panel ${i} canceled.`);
      activeBets[i] = false;
      pendingCancel[i] = false;
      status.innerText = "Bet";
      btn.className = "action-button bet";
      btn.disabled = false;
      if (multDisplay) multDisplay.style.display = "none";
      updateBetUI(i, 0, 0, 0);
      if (data.wallet?.balance !== undefined) updateBalanceDisplay(data.wallet.balance);
      return;
    }

    if (data.bet?.awaiting === true) {
      console.log(`📩 Bet confirmed on panel ${i}`);
      activeBets[i] = true;
      setTimeout(() => {
        pendingCancel[i] = true;
      }, 200);
      status.innerText = "Cancel";
      btn.className = "action-button cancel";
      btn.disabled = false;
      return;
    }

    if (data.bet?.multiplier !== undefined) {
      if (wonProcessed[i]) return;
      wonProcessed[i] = true;

      const mult = data.bet.multiplier;
      const betAmount = betSums[i] / 100;
      const winAmount = betAmount * mult;
      console.log(`🏆 Player ${i} WON ₹${winAmount.toFixed(2)} at ${mult.toFixed(2)}x multiplier`);
      const cashOutValue = data.on?.cash_out ?? null;

      status.innerText = `🎉 Won ₹${winAmount.toFixed(2)} at ${mult.toFixed(2)}x`;
      btn.className = "action-button cashed";
      btn.disabled = true;
      if (multDisplay) multDisplay.style.display = "none";

      updateBetUI(i, betAmount, mult, winAmount, cashOutValue);
      addTopWinCard(`User-${i}`, betAmount, mult, winAmount, cashOutValue);

      const cashoutSound = document.getElementById("cashoutSound");
      if (cashoutSound && isSoundEnabled()) {
        cashoutSound.currentTime = 0;
        cashoutSound.play().catch(err => console.warn("Cashout sound error:", err));
      }

      return;
    }
  }

  if (data.status === "progress" && data.k) {
    currentMultiplier = data.k;
    if (typeof data.h === "number") {
      [0, 1].forEach(i => {
        if (activeBets[i]) cashOutValues[i] = data.h;
      });
    }
   [0, 1].forEach(i => {
  const el = document.getElementById(`cashout-multiplier-${i}`);
  if (activeBets[i] && el) {
    el.style.display = "inline-block";
    el.innerText = `${currentMultiplier.toFixed(2)}x`;

    const btn = document.getElementById(`bet-button-${i}`);
    if (btn && !btn.classList.contains("cashout") && !btn.classList.contains("cashed")) {
      btn.className = "action-button cancel cashout";
    }
  }
});

  }

  if (data.status) {
    gameState = data.status;
    const statusEl = document.getElementById("game-status");
    if (statusEl) statusEl.innerText = `Status: ${gameState}`;

    switch (gameState) {
      case "pause":
        console.log("⏸️ Game Paused – Accepting bets");
        animationStarted = false;
        crashSoundPlayed = false;
        [0, 1].forEach(i => {
          updateBetUI(i, 0, 0, 0);
          wonProcessed[i] = false;
        });
        setTimeout(() => hideKoefficientDisplay(), 50);
        break;

      case "started":
        console.log("✅ Game Started – No more bets");
        [0, 1].forEach(i => {
          const btn = document.getElementById(`bet-button-${i}`);
          if (pendingCancel[i]) btn.disabled = true;
        });

      case "progress":
        console.log("✈️ Plane flying – Multiplier:", data.k);
        if (!animationStarted) {
          animationStarted = true;
          startPlaneAnimation(data.k ? 5 + data.k * 0.2 : 8);
        }
        updateKoefficientDisplay(data.k);
        break;

      case "crash":
        console.log("💥 Plane crashed at", data.k);
        stopPlaneAnimation();
        const planeSound = document.getElementById("planeSound");
        if (planeSound) {
          planeSound.pause();
          planeSound.currentTime = 0;
        }
        const crashSound = document.getElementById("crashSound");
        if (!crashSoundPlayed && crashSound && isSoundEnabled()) {
          crashSoundPlayed = true;
          crashSound.currentTime = 0;
          crashSound.play().catch(err => console.warn("Crash sound error:", err));
        }
        animationStarted = false;
        hideKoefficientDisplay();
        appendMultiplierToTabs(data.k);
        setTimeout(() => showCashoutUI(), 50);
        [0, 1].forEach(i => {
          activeBets[i] = data.bet_sum > 0;
          document.getElementById(`bet-status-${i}`).innerText = "Bet";
          const btn = document.getElementById(`bet-button-${i}`);
          btn.className = "action-button bet";
          btn.disabled = false;
          wonProcessed[i] = false;
          const cashoutEl = document.getElementById(`cashout-multiplier-${i}`);
          if (cashoutEl) cashoutEl.style.display = "none";
        });
        break;
    }
  }

  if (data.error === "low balance") {
    alert("❌ Insufficient balance.");
  }
});

function handleBetClick(index) {
  const betBtn = document.getElementById(`bet-button-${index}`);
  const status = document.getElementById(`bet-status-${index}`);
  const display = document.getElementById(`amount-display-${index}`);
  const amount = parseFloat(display.innerText);

  if (!amount || isNaN(amount)) {
    alert("Please enter a valid bet amount.");
    return;
  }

  const bet_sum = Math.round(amount * 100);

  if (gameState === "pause" && pendingCancel[index]) {
    if (!activeBets[index]) {
      console.warn("⛔ Cancel not allowed yet – awaiting not confirmed");
      return;
    }
    console.log(`❌ Canceling bet on panel ${index}`);
    socket.send(JSON.stringify({ set: "bet", index, cancel: true }));
    pendingCancel[index] = false;
    return;
  } else if (gameState !== "pause") {
    console.warn("⚠️ Cancel ignored — not in pause state");
  }

  if (!gameState || gameState === "pause") {
    console.log(`🟢 Placing bet on panel ${index} for ₹${amount}`);
    betSums[index] = bet_sum;
    pendingCancel[index] = true;
    activeBets[index] = false;
    betBtn.disabled = true;
    status.innerText = "Placing...";
    betBtn.className = "action-button bet";
    socket.send(JSON.stringify({ set: "options", index, bet_sum }));
    return;
  }

  if (gameState === "progress" && activeBets[index]) {
    console.log(`💸 Cashing out bet on panel ${index}`);
    const cashOutValue = cashOutValues[index];
    if (!cashOutValue || cashOutValue <= 0) {
      console.warn("⚠️ No valid cash_out value available.");
      return;
    }
    socket.send(JSON.stringify({ set: "bet", index, cash_out: cashOutValue }));
    activeBets[index] = false;
    pendingCancel[index] = false;
    status.innerText = "Cashed Out";
    betBtn.className = "action-button cashed";
    betBtn.disabled = true;
  }
}

function updateBalanceDisplay(paise) {
  const rupees = (paise / 100).toFixed(2);
  const el = document.getElementById("wallet-balance");
  if (el) el.innerText = `₹${rupees}`;
  console.log("wallet:", paise);
}

document.getElementById("bet-button-0").addEventListener("click", () => handleBetClick(0));
document.getElementById("bet-button-1").addEventListener("click", () => handleBetClick(1));
