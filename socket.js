const betSums = { 0: 0, 1: 0 };
let gameState = null;
let animationStarted = false;
const activeBets = { 0: false, 1: false };
let currentMultiplier = 1;
const cashOutValues = { 0: 0, 1: 0 };

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

function updateBetUI(index, betAmount, multiplier, winAmount) {
  const betEl = document.querySelector(`#bet-inr-${index} strong`);
  const multEl = document.querySelector(`#multiplier-${index} .multiplier`);
  const winEl = document.querySelector(`#win-inr-${index} strong`);

  if (betEl) betEl.innerText = `₹${betAmount.toFixed(2)}`;
  if (multEl) multEl.innerText = `${multiplier.toFixed(2)}x`;
  if (winEl) winEl.innerText = `₹${winAmount.toFixed(2)}`;
}

function addTopWinCard(user, bet, multiplier, win, avatarUrl = '') {
  const container = document.getElementById("topSection");
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <div class="user-infotop">
      <img src="${avatarUrl || '../assets/images/default-avatar.png'}" class="user-img" />
      <div>
        <div class="username">${user}</div>
        <div class="bet-info">
          <div>Bet INR : <strong>₹${bet.toFixed(2)}</strong></div>
          <div>Cashed out : <span class="multiplier">${multiplier.toFixed(2)}x</span></div>
          <div>Win INR : <strong>₹${win.toFixed(2)}</strong></div>
        </div>
      </div>
    </div>`;
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
    const w = data.wallet;

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

    if (data.bet?.awaiting) {
      activeBets[i] = true;
      status.innerText = "Cashout";
      btn.classList.add("cashout");
      btn.disabled = false;

    }  else if (data.bet?.multiplier !== undefined) {
  const mult = data.bet.multiplier;
  const betAmount = betSums[i] / 100;
  const winAmount = betAmount * mult;

  console.log(`🏆 Player ${i} WON ₹${winAmount.toFixed(2)} at ${mult.toFixed(2)}x multiplier`);

  status.innerText = `🎉 Won ₹${winAmount.toFixed(2)} at ${mult.toFixed(2)}x`;

  btn.classList.remove("cashout");
  btn.classList.add("cashed");
  btn.disabled = true;

  if (multDisplay) multDisplay.style.display = "none";

  updateBetUI(i, betAmount, mult, winAmount);
  addTopWinCard(`User-${i}`, betAmount, mult, winAmount);
}
 else if (data.bet?.loss === true) {
      // ❌ Handle LOSS
      btn.classList.remove("cashout");
      btn.classList.add("cashed");
      btn.disabled = true;
      if (multDisplay) multDisplay.style.display = "none";
    }

    if (data.wallet?.balance !== undefined) {
      updateBalanceDisplay(data.wallet.balance);
    }

    return;
  }

  if (data.status === "progress" && data.k) {
    currentMultiplier = data.k;

    if (typeof data.h === "number") {
      [0, 1].forEach(i => {
        if (activeBets[i]) {
          cashOutValues[i] = data.h;
        }
      });
    }

    [0, 1].forEach(i => {
      if (activeBets[i]) {
        const el = document.getElementById(`cashout-multiplier-${i}`);
        if (el) {
          el.style.display = "inline-block";
          el.innerText = `${currentMultiplier.toFixed(2)}x`;
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
        setTimeout(() => hideKoefficientDisplay(), 50);
        [0, 1].forEach(i => updateBetUI(i, 0, 0, 0));
        break;

      case "started":
        console.log("✅ Game Started – No more bets");
        [0, 1].forEach(i => document.getElementById(`bet-button-${i}`).disabled = true);
        break;

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
        animationStarted = false;
        hideKoefficientDisplay();
        appendMultiplierToTabs(data.k);

        setTimeout(() => showCashoutUI(), 50);

        [0, 1].forEach(i => {
          activeBets[i] = data.bet_sum > 0;
          document.getElementById(`bet-status-${i}`).innerText = "Bet";
          const btn = document.getElementById(`bet-button-${i}`);
          btn.classList.remove("cashed", "cashout");
          btn.disabled = false;
          const cashoutEl = document.getElementById(`cashout-multiplier-${i}`);
          if (cashoutEl) cashoutEl.style.display = "none";
        });
        break;
    }
  }

  if (data.wallet?.balance !== undefined) {
    updateBalanceDisplay(data.wallet.balance);
  }

  if (data.error === "low balance") {
    alert("❌ Insufficient balance.");
  }
});

function handleBetClick(index) {
  const betBtn = document.getElementById(`bet-button-${index}`);
  const display = document.getElementById(`amount-display-${index}`);
  const amount = parseFloat(display.innerText);

  if (!amount || isNaN(amount)) {
    alert("Please enter a valid bet amount.");
    return;
  }

  const bet_sum = Math.round(amount * 100);
  betSums[index] = bet_sum;

  if (!gameState || gameState === "pause") {
    console.log(`🟢 Placing bet on panel ${index} for ₹${amount}`);
    betBtn.classList.remove("cashed", "cashout");
    betBtn.disabled = true;

    socket.send(JSON.stringify({ set: "options", index, bet_sum }));

    setTimeout(() => {
      socket.send(JSON.stringify({ set: "bet", index, auto: 1, cash_out: 0 }));
      activeBets[index] = true;
    }, 50);

  } else if (gameState === "progress" && activeBets[index]) {
    console.log(`💸 Cashing out bet on panel ${index}`);
    const cashOutValue = cashOutValues[index];
    if (!cashOutValue || cashOutValue <= 0) {
      console.warn("⚠️ No valid cash_out value available.");
      return;
    }

    socket.send(JSON.stringify({ set: "bet", index, cash_out: cashOutValue }));

    activeBets[index] = false;
    document.getElementById(`bet-status-${index}`).innerText = "Cashed Out";
    betBtn.classList.add("cashed");
    betBtn.classList.remove("cashout");
    betBtn.disabled = true;
  }
}

function updateBalanceDisplay(paise) {
  const rupees = (paise / 100).toFixed(2);
  const el = document.getElementById("wallet-balance");
  if (el) el.innerText = `₹${rupees}`;
}

document.getElementById("bet-button-0").addEventListener("click", () => handleBetClick(0));
document.getElementById("bet-button-1").addEventListener("click", () => handleBetClick(1));