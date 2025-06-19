
// Tab switching functionality
const tabs = document.querySelectorAll('.tab');
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
    });
});

// Bet toggle functionality
const betToggleButtons = document.querySelectorAll('.bet-toggle-button');
betToggleButtons.forEach(button => {
    button.addEventListener('click', () => {
        const parent = button.parentElement;
        parent.querySelectorAll('.bet-toggle-button').forEach(b => b.classList.remove('active'));
        button.classList.add('active');
    });
});

// Amount increment/decrement functionality
const decrementButtons = document.querySelectorAll('.amount-button:first-child');
const incrementButtons = document.querySelectorAll('.amount-button:last-child');
const amountDisplays = document.querySelectorAll('.amount-display');

decrementButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        let currentAmount = parseFloat(amountDisplays[index].textContent);
        if (currentAmount > 1) {
            currentAmount -= 1;
            amountDisplays[index].textContent = currentAmount.toFixed(2);
        }
    });
});

incrementButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        let currentAmount = parseFloat(amountDisplays[index].textContent);
        currentAmount += 1;
        amountDisplays[index].textContent = currentAmount.toFixed(2);
    });
});

// Preset amount buttons functionality
const presetButtons = document.querySelectorAll('.preset-button');
presetButtons.forEach(button => {
    button.addEventListener('click', () => {
        const panel = button.closest('.betting-panel, .betting-panel-right');
        const amountDisplay = panel.querySelector('.amount-display');
        amountDisplay.textContent = button.textContent;
    });
});

// Auto cashout checkbox functionality
document.addEventListener("DOMContentLoaded", function () {
    const allPanels = document.querySelectorAll(".betting-panel, .betting-panel-right");

    allPanels.forEach(panel => {
        const toggleButtons = panel.querySelectorAll(".bet-toggle-button");

        // Try to find auto-cashout regardless of structure
        const autoCashout = panel.querySelector(".auto-cashout");
        const checkbox = autoCashout?.querySelector(".checkbox");
        const checkboxInner = autoCashout?.querySelector(".checkbox-inner");

        if (!toggleButtons.length || !autoCashout) return;

        // Set initial visibility based on "Auto" active
        const activeToggle = panel.querySelector(".bet-toggle-button.active");
        autoCashout.style.display = (activeToggle && activeToggle.textContent.trim() === "Auto") ? "flex" : "none";

        // Handle toggle button clicks
        toggleButtons.forEach(button => {
            button.addEventListener("click", () => {
                toggleButtons.forEach(btn => btn.classList.remove("active"));
                button.classList.add("active");

                if (button.textContent.trim() === "Auto") {
                    autoCashout.style.display = "flex";
                } else {
                    autoCashout.style.display = "none";
                }
            });
        });

        // Checkbox toggle
        if (checkbox && checkboxInner) {
            checkbox.addEventListener("click", () => {
                checkbox.classList.toggle("checked");
                checkboxInner.style.display = checkbox.classList.contains("checked") ? "block" : "none";
            });

            // Initialize checkbox state
            checkboxInner.style.display = checkbox.classList.contains("checked") ? "block" : "none";
        }
    });
});



// Simulate airplane movement
//  let position = 30;
// let direction = 1;
// const airplane = document.querySelector('.airplane');

// function moveAirplane() {
//     position += 0.2 * direction;

//     if (position > 60) {
//         direction = -1;
//     } else if (position < 20) {
//         direction = 1;
//     }

//     airplane.style.left = `${position}%`;

//     requestAnimationFrame(moveAirplane);
// }

// moveAirplane();

// Simulate multiplier increase
// let multiplier = 2.64;
// const multiplierDisplay = document.querySelector('.current-multiplier span');

// function updateMultiplier() {
//     multiplier += 0.01;
//     multiplierDisplay.textContent = multiplier.toFixed(2) + 'x';

//     setTimeout(updateMultiplier, 1000);
// }
    window.addEventListener("load", function () {
  const loader = document.getElementById("loader");
  const titleScreen = document.getElementById("title-screen");
  const mainContent = document.getElementById("main-content");

  const delay = 3000; // Show loader for at least 3 seconds

  setTimeout(() => {
    loader.style.transition = "opacity 1s ease";
    loader.style.opacity = "0";

    setTimeout(() => {
      loader.style.display = "none";
      titleScreen.style.display = "flex";

      // Automatically transition to main content after short delay
      setTimeout(() => {
        titleScreen.style.display = "none";
        mainContent.style.display = "block";
      }, 2000); // Title screen shows for 2 seconds
    }, 1000); // Fade out duration
  }, delay);
});

 const allBetsTab = document.getElementById('allBetsTab');
 const topTab = document.getElementById('topTab');
 const allBetsSection = document.getElementById('allBetsSection');
 const topSection = document.getElementById('topSection');

// allBetsTab.addEventListener('click', () => {
// //     allBetsTab.classList.add('active');
//   topTab.classList.remove('active');
// //     allBetsSection.classList.remove('hidden');
//      topSection.classList.add('hidden');
// });

 topTab.addEventListener('click', () => {
   topTab.classList.add('active');
    // allBetsTab.classList.remove('hidden');
     topSection.classList.remove('active');
    //  allBetsSection.classList.add('hidden');
 });
function openSettingsPopup() {
    document.getElementById('settingsPopup').style.display = 'flex';
}

function closeSettingsPopup(event) {
    if (event.target.id === 'settingsPopup') {
        document.getElementById('settingsPopup').style.display = 'none';
    }
}
function toggleFreeBetsPopup() {
    // Hide settings popup
    const settingsPopup = document.getElementById('settingsPopup');
    if (settingsPopup) settingsPopup.style.display = 'none';

    // Toggle free bets overlay
    const overlay = document.getElementById('freeBetsOverlay');
    if (overlay) {
        overlay.classList.toggle('show');
    }
}

function closeFreeBetsPopup(event) {
    // If clicked outside popup or close button
    if (!event || event.target.id === 'freeBetsOverlay' || event.target.classList.contains('close-btn')) {
        const overlay = document.getElementById('freeBetsOverlay');
        if (overlay) overlay.classList.remove('show');
    }
}

document.querySelector('.menu-item:nth-child(1)').addEventListener('click', toggleFreeBetsPopup);

const archiveBtn = document.querySelector('.archive-btn');

archiveBtn.addEventListener('click', () => {
    archiveBtn.classList.toggle('active');
});

// Toggle bet history popup like free bets popup
function toggleBethistoryPopup() {
    // Hide settings popup
    const settingsPopup = document.getElementById('settingsPopup');
    if (settingsPopup) settingsPopup.style.display = 'none';

    // Toggle bet history overlay
    const overlay = document.getElementById('bet-history-overlay');
    if (overlay) {
        overlay.classList.toggle('show');
    }
}

// Close bet history popup if clicked outside content or on close button
function closeBetHistoryPopup(event) {
    // Make sure event.target is either overlay background or close button
    if (!event ||
        event.target.id === 'bet-history-overlay' ||
        event.target.classList.contains('close-btn')) {

        const overlay = document.getElementById('bet-history-overlay');
        if (overlay) overlay.classList.remove('show');
    }
}

// Add event listener to history button to toggle popup
const historyBtn = document.getElementById('history-btn');
if (historyBtn) {
    historyBtn.addEventListener('click', toggleBethistoryPopup);
}

// Add event listener on overlay to close when clicked outside popup content
const betHistoryOverlay = document.getElementById('bet-history-overlay');
if (betHistoryOverlay) {
    betHistoryOverlay.addEventListener('click', closeBetHistoryPopup);
}

// Add event listener on close button inside bet history popup
const closeHistoryBtn = document.querySelector('#bet-history-overlay .close-btn');
if (closeHistoryBtn) {
    closeHistoryBtn.addEventListener('click', closeBetHistoryPopup);
}

const openhistoryLink = document.getElementById('historyLink');
if (openhistoryLink) {
    openhistoryLink.addEventListener('click', toggleBethistoryPopup);
}
document.addEventListener('DOMContentLoaded', () => {
  // Modal elements
  const howToPlayModal = document.getElementById('howToPlayModal');
  const gameRulesModal = document.getElementById('gameRulesModal');
  const settingsPopup = document.getElementById('settingsPopup'); // define here once

  // Buttons
  const openHowToPlayBtn = document.getElementById('openModal');       // Button to open How to Play
  const openHowToPlaySpan = document.getElementById('howToPlayLink');   // Another open trigger if any
  const closeHowToPlayBtn = document.getElementById('closeModal');      // Close btn in How to Play modal
  const gameRulesBtn = document.getElementById('gameRulesModalbtn');    // Button inside How To Play modal
  const closeGameRulesBtn = gameRulesModal.querySelector('.close-btn'); // Close btn in Game Rules modal

  // Helper to pause and reset video inside a modal
  function resetVideo(modal) {
    if (!modal) return;
    const video = modal.querySelector('video');
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  }

  // Open How to Play modal
  function openHowToPlay() {
    // Close settings popup if open
   const settingsPopup = document.getElementById('settingsPopup');
  if (settingsPopup && settingsPopup.style.display !== 'none') {
    settingsPopup.style.display = 'none'; // hide settings popup
  }

  if (gameRulesModal && gameRulesModal.classList.contains('show')) {
    gameRulesModal.classList.remove('show');
    resetVideo(gameRulesModal);
  }

  if (howToPlayModal) {
    howToPlayModal.classList.add('show');
  }
  }

  // Close How to Play modal
  function closeHowToPlay() {
    if (howToPlayModal && howToPlayModal.classList.contains('show')) {
      howToPlayModal.classList.remove('show');
      resetVideo(howToPlayModal);
    }
  }

  // Open Game Rules modal
  function openGameRules() {
    // Close How to Play modal if open
    closeHowToPlay();

    // Close settings popup if open (optional, if you want)
    if (settingsPopup && settingsPopup.classList.contains('show')) {
      settingsPopup.classList.remove('show');
    }

    // Show Game Rules modal
    if (gameRulesModal) {
      gameRulesModal.classList.add('show');
    }
  }

  // Close Game Rules modal
  function closeGameRules() {
    if (gameRulesModal && gameRulesModal.classList.contains('show')) {
      gameRulesModal.classList.remove('show');
      resetVideo(gameRulesModal);
    }
  }

  // Attach event listeners
  if (openHowToPlayBtn) openHowToPlayBtn.addEventListener('click', openHowToPlay);
  if (openHowToPlaySpan) openHowToPlaySpan.addEventListener('click', openHowToPlay);

  if (closeHowToPlayBtn) closeHowToPlayBtn.addEventListener('click', closeHowToPlay);
  if (closeGameRulesBtn) closeGameRulesBtn.addEventListener('click', closeGameRules);

  if (gameRulesBtn) gameRulesBtn.addEventListener('click', openGameRules);

  // Close modals when clicking outside modal content
  window.addEventListener('click', (e) => {
    if (e.target === howToPlayModal) closeHowToPlay();
    if (e.target === gameRulesModal) closeGameRules();
  });
});

 

document.addEventListener("DOMContentLoaded", function () {
    const autoCashoutElements = document.querySelectorAll(".auto-cashout");

    autoCashoutElements.forEach(autoCashout => {
      const checkbox = autoCashout.querySelector(".checkbox");
      const multiplierValue = autoCashout.querySelector(".multiplier-value");

      checkbox.addEventListener("click", function () {
        multiplierValue.classList.toggle("highlighted");
        checkbox.classList.toggle("active");
      });
    });
  });

 document.addEventListener("DOMContentLoaded", () => {
  const musicToggle = document.getElementById("musicToggle");
  const bgMusic = document.getElementById("bgMusic");

  musicToggle.addEventListener("change", () => {
    if (musicToggle.checked) {
      bgMusic.play().catch(e => console.log("Playback prevented:", e));
    } else {
      bgMusic.pause();
      bgMusic.currentTime = 0; // reset to start
    }
  });
});



// document.addEventListener('DOMContentLoaded', () => {
//   const changeAvatarBtn = document.querySelector('.change-avatar');
//   const avatarModal = document.getElementById('avatarSelectionModal');
//   const closeBtn = document.getElementById('closeAvatarModal');

//   // Open modal on button click
//   changeAvatarBtn.addEventListener('click', () => {
//     avatarModal.style.display = 'flex';
//   });

//   // Close modal on close button click
//   closeBtn.addEventListener('click', () => {
//     avatarModal.style.display = 'none';
//   });

//   // Close modal on clicking outside modal-content (the backdrop)
//   avatarModal.addEventListener('click', (e) => {
//     if (e.target.classList.contains('modal-backdrop')) {
//       avatarModal.style.display = 'none';
//     }
//   });

//   // Avatar selection logic
//   avatarModal.querySelector('.avatars').addEventListener('click', (e) => {
//     if (e.target.classList.contains('avatar')) {
//       const selectedAvatar = e.target.src;
//       console.log('Selected avatar:', selectedAvatar);
//       // TODO: do something with the selected avatar, e.g., update UI or send to server
//       avatarModal.style.display = 'none';
//     }
//   });
// });

// document.querySelectorAll('.action-button span:first-child').forEach(button => {
//   button.addEventListener('click', () => {
//     const plane = document.getElementById('planeAnimation');
//     plane.classList.remove('animate-flight'); // Reset if already animated
//     void plane.offsetWidth; // Force reflow
//     plane.classList.add('animate-flight');
//   });
// });

// Uncomment to enable multiplier animation
// updateMultiplier();
let sky, center

function dot(i) {
   const size = Math.round(Math.random() + 1)
   const root = document.createElement('span')
   root.style.top = center.y + 'px'
   root.style.left = center.x + 'px'
   root.classList.add('star', `size-${size}`, `axis-${i}`)
   return root
}

function clear() {
   sky.innerHTML = ''
}

function init() {
   sky = document.querySelector('#sky')
   center = {
      x: sky.clientWidth / 2,
      y: sky.clientHeight / 2,
   }
   clear()
   for (let i = 0; i < 360; i++) sky.appendChild(dot(i))
}

window.onload = init
gsap.registerPlugin(MotionPathPlugin);

gsap.registerPlugin(MotionPathPlugin);

let planeTimeline;

// -------------------------
// PLANE ANIMATION
// -------------------------
document.getElementById("animationToggle").addEventListener("change", (e) => {
  if (!e.target.checked) {
    // Hide airplane and trajectory immediately
    document.getElementById("airplane").style.display = "none";
    document.getElementById("trajectory-path").style.display = "none";

    // Stop animations if any
    if (planeAnimAirplane) planeAnimAirplane.kill();
    if (planeAnimTrajectory) planeAnimTrajectory.kill();
  }
});

let planeAnimAirplane, planeAnimTrajectory;

function startPlaneAnimation() {
  const toggle = document.getElementById("animationToggle");
  const airplane = document.getElementById("airplane");
  const trajectoryPath = document.getElementById("trajectory-path");

  if (!toggle || !toggle.checked) {
    console.log("🚫 Animation toggle is OFF. Hiding airplane and trajectory.");
    if (airplane) airplane.style.display = 'none';
    if (trajectoryPath) trajectoryPath.style.display = 'none';
    return;
  }

  if (!airplane || !trajectoryPath) {
    console.error("❌ Airplane or trajectory path element missing.");
    return;
  }

  // Show and reset
  gsap.set(airplane, { x: 0, y: 264, display: 'block' });
  gsap.set(trajectoryPath, { x: 0, y: 264, display: 'block' });

  // Animate airplane
  planeAnimAirplane = gsap.to(airplane, {
    motionPath: [
      { x: 236, y: 202 },
      { x: 400, y: 128 },
      { x: 527, y: 0 }
    ],
    duration: 10,
    ease: "power1.inOut"
  });

  // Animate trajectory
  planeAnimTrajectory = gsap.to(trajectoryPath, {
    motionPath: [
      { x: 236, y: 202 },
      { x: 400, y: 128 },
      { x: 527, y: 0 }
    ],
    duration: 10,
    ease: "power1.inOut"
  });
}

function stopPlaneAnimation() {
  if (planeAnimAirplane) planeAnimAirplane.kill();
  if (planeAnimTrajectory) planeAnimTrajectory.kill();
}

/* function startPlaneAnimation(k = 1.0) {
  const flightGroup = document.querySelector(".flight-group");
  const airplane = document.getElementById("airplane");
  const trajectory = document.getElementById("trajectoryImage");

  if (!flightGroup || !airplane || !trajectory) {
    console.error("❌ Animation elements missing");
    return;
  }

  gsap.killTweensOf(flightGroup);
  gsap.set([airplane, trajectory], { opacity: 1 });
  gsap.set(flightGroup, { x: 0, y: 0, scale: 1, opacity: 1 });

  planeTimeline = gsap.timeline();

  planeTimeline.to(flightGroup, {
    duration: 1.5,
    x: 300,
    y: -200,
    scale: 1.5,
    ease: "power2.out"
  });

  planeTimeline.to(trajectory, {
    duration: 1,
    opacity: 0
  }, "<+1");

  const travelDistance = Math.min(300 + k * 60, 800);
  const travelDuration = Math.min(2 + k * 0.3, 6);

  planeTimeline.to(flightGroup, {
    duration: travelDuration,
    x: travelDistance,
    y: -250,
    scale: 1.6,
    ease: "power1.inOut"
  });
} */

/* function stopPlaneAnimation() {
  gsap.to(".flight-group", {
    delay: 2,
    duration: 0.5,
    opacity: 0,
    ease: "power1.in"
  });
} */
function resetPlaneAnimation() {
  const flightGroup = document.querySelector(".flight-group");
  const airplane = document.getElementById("airplane");
  const trajectory = document.getElementById("trajectory");

  if (flightGroup && airplane && trajectory) {
    gsap.set([airplane, trajectory], { opacity: 1 });
    gsap.set(flightGroup, { x: 0, y: 0, scale: 1, opacity: 1 });
  }
}

function updateKoefficientDisplay(k) {
  const currentDisplay = document.getElementById("currentMultiplier");
  if (!currentDisplay) return;

  currentDisplay.style.display = "block";
  currentDisplay.querySelector("span").innerText = `${k.toFixed(2)}x`;
}
function hideKoefficientDisplay(delay = 0) {
  const currentDisplay = document.getElementById("currentMultiplier");
  if (!currentDisplay) return;
  setTimeout(() => {
    currentDisplay.style.display = "none";
  }, delay);
}


function appendMultiplierToTabs(k) {
  const tabsContainer = document.getElementById("multiplierTabs");
  if (!tabsContainer) return;

  const div = document.createElement("div");
  div.className = "multiplier-tab";
  div.innerText = `${k.toFixed(2)}x`;

  const historyBtn = tabsContainer.querySelector(".history-button");
  tabsContainer.insertBefore(div, historyBtn);

  const tabs = tabsContainer.querySelectorAll(".multiplier-tab:not(.history-button)");
  if (tabs.length > 10) tabs[0].remove();
}




window.addEventListener("DOMContentLoaded", () => {
  // Amount +/- logic
  document.querySelectorAll(".amount-button").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = parseInt(btn.getAttribute("data-index"));
      const display = document.getElementById(`amount-display-${index}`);
      let current = parseFloat(display.innerText) * 100 || 0;
      const step = 100; // 1.00 in paise

      if (btn.innerText === "+") current += step;
      if (btn.innerText === "-" && current >= step) current -= step;

      display.innerText = (current / 100).toFixed(2);
    });
  });

  // Preset click
  document.querySelectorAll(".preset-button").forEach(preset => {
    preset.addEventListener("click", () => {
      const index = parseInt(preset.getAttribute("data-index"));
      const value = parseFloat(preset.innerText);
      document.getElementById(`amount-display-${index}`).innerText = value.toFixed(2);
    });
  });
});


function showCashoutUI(index, multiplier, cashoutAmount) {
  const el = document.getElementById(`cashout-display-${index}`);
  if (el) {
    el.innerHTML = `💰 Cashed out at <strong>${multiplier}x</strong><br>Won: ₹${cashoutAmount}`;
    el.style.display = "block";
    setTimeout(() => el.style.display = "none", 300);
  }
}

function showLossUI(index) {
  const el = document.getElementById(`cashout-display-${index}`);
  if (el) {
    el.innerHTML = `💀 Bet Lost`;
    el.style.display = "block";
    setTimeout(() => el.style.display = "none", 3000);
  }
}



function updateKoefficientDisplay(k) {
  const el = document.getElementById("current-multiplier");
  if (!el) return;
  el.style.display = "block";
  el.querySelector("span").innerText = `${parseFloat(k).toFixed(2)}x`;
}

function hideKoefficientDisplay(delay = 0) {
  const el = document.getElementById("current-multiplier");
  if (!el) return;
  setTimeout(() => el.style.display = "none", delay);
}

function appendMultiplierToTabs(k) {
  const tabs = document.getElementById("multiplierTabs");
  if (!tabs) return;

  const pill = document.createElement("div");
  pill.className = "multiplier-tab " + (k >= 2 ? "green" : "red");
  pill.innerText = `${parseFloat(k).toFixed(2)}x`;

  tabs.insertBefore(pill, tabs.firstElementChild); // insert before history button

  // Limit history to 10 entries
  const pills = tabs.querySelectorAll(".multiplier-tab:not(.history-button)");
  if (pills.length > 10) {
    tabs.removeChild(pills[pills.length - 1]);
  }
}

// Action button functionality

const actionButtons = document.querySelectorAll('.action-button');

actionButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    const statusEl = document.getElementById(`bet-status-${index}`);
    const display = document.getElementById(`amount-display-${index}`);
    if (!display) return console.warn(`No amount display for index ${index}`);

    const amountText = display.innerText.trim();
    const amountValue = parseFloat(amountText);

    // If button is in "Cashout" state
    if (activeBets[index]) {
      console.log(`💸 Cashing out from panel ${index}`);
      socket.send(JSON.stringify({
        set: "cashout",
        index: index
      }));

      button.disabled = true; // prevent double-click
      return;
    }

    // Validate amount before placing bet
    if (isNaN(amountValue) || amountValue <= 0) {
      alert("Invalid bet amount!");
      return;
    }

    const betAmount = Math.round(amountValue * 100); // ₹ to paise
    console.log(`🟢 Placing bet on panel ${index} for ₹${amountValue.toFixed(2)} (paise: ${betAmount})`);

    // Send bet to server
    socket.send(JSON.stringify({
      set: "bet",
      index: index,
      value: betAmount
    }));

    // Mark as active bet
    activeBets[index] = true;
    button.classList.remove("red");
    button.classList.add("green");
    statusEl.innerText = "Cash Out";

    // Optional: re-fetch options
    setTimeout(() => {
      socket.send(JSON.stringify({ get: "options", index }));
    }, 300);
  });
});
function updateCashoutMultiplier(index, h) {
  if (activeBets[index]) {
    document.getElementById(`bet-status-${index}`).innerText = `${h.toFixed(2)}x`;
  }
}
function resetBetUI() {
  [0, 1].forEach(i => {
    activeBets[i] = false;

    const button = document.getElementById(`bet-button-${i}`);
    const status = document.getElementById(`bet-status-${i}`);

    button.classList.remove("green");
    button.classList.add("red");
    button.disabled = false;
    status.innerText = "Place Bet";
  });
}
