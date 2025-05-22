import { setupInputHandlers } from "../utils/inputHandler.js";
import { createLevel } from "../factories/levelFactory.js";
import { GameState } from "../managers/GameState.js";

let frameCount = 0;

function showLoadingScreen() {
  const existing = document.getElementById("loading-screen");
  if (existing) existing.remove();

  const loadingScreen = document.createElement("div");
  loadingScreen.id = "loading-screen";
  loadingScreen.innerHTML = `
    <p class="loading-text">Подгружаю мир Анастасии<span class="dots"></span></p>
  `;
  document.body.appendChild(loadingScreen);
}

const style = document.createElement("style");
style.innerHTML = `
  #loading-screen {
    position: fixed;
    inset: 0;
    background-color: #cceeff;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.6s ease;
    opacity: 1;
  }

  .loading-text {
    font-family: 'Patrick Hand', sans-serif;
    font-size: 26px;
    color: white;
    letter-spacing: 1px;
  }

  .dots::after {
    content: '';
    display: inline-block;
    animation: dots 1.2s infinite steps(3, end);
  }

  @keyframes dots {
    0%   { content: ''; }
    33%  { content: '.'; }
    66%  { content: '..'; }
    100% { content: '...'; }
  }
`;
document.head.appendChild(style);

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

//canvas.width = 1024
//canvas.height = 576
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

const gravity = 1.1;

let lastKey;
const keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
  up: {
    pressed: false,
  },
};

let scrollPlatform = 0;

let player;
let platforms = [];
let dialogueManager;
let backgroundObjects = [];
let platformImage;

// function after dying//
function init() {
  const level = createLevel(c, canvas, gravity);
  player = level.player;
  platforms = level.platforms;
  backgroundObjects = level.backgroundObjects;
  dialogueManager = level.dialogueManager;
  platformImage = level.platformImage;
  scrollPlatform = 0;
  setupInputHandlers(keys, player, (key) => {
    lastKey = key;
  });
}

function handlePlayerMovement() {
  if (keys.right.pressed && player.position.x < 400) {
    player.velocity.x = player.speed;
  } else if (
    (keys.left.pressed && player.position.x > 100) ||
    (keys.left.pressed && scrollPlatform === 0 && player.position.x > 0)
  ) {
    player.velocity.x = -player.speed;
  } else {
    player.velocity.x = 0;

    if (keys.right.pressed) {
      scrollPlatform += player.speed;
      platforms.forEach((platform) => {
        platform.position.x -= player.speed;
      });
      backgroundObjects.forEach((obj) => {
        obj.position.x -= player.speed * 0.66;
      });
      dialogueManager.updatePositions({ x: -player.speed * 0.66, y: 0 });
    } else if (keys.left.pressed && scrollPlatform > 0) {
      scrollPlatform -= player.speed;
      platforms.forEach((platform) => {
        platform.position.x += player.speed;
      });
      backgroundObjects.forEach((obj) => {
        obj.position.x += player.speed * 0.66;
      });
      dialogueManager.updatePositions({ x: player.speed * 0.66, y: 0 });
    }
  }
}

function handleCollisions() {
  platforms.forEach((platform) => {
    if (
      player.position.y + player.height <= platform.position.y &&
      player.position.y + player.height + player.velocity.y >=
        platform.position.y &&
      player.position.x + player.width >= platform.position.x &&
      player.position.x <= platform.position.x + platform.width
    ) {
      player.velocity.y = 0;
      player.jumpCount = 0;
    }
  });
}

function handleDialogues() {
  if (player.position.x > 200 && !dialogueManager.dialogues[0].shown) {
    dialogueManager.showDialogue(0);
  }
  if (player.position.x > 600 && !dialogueManager.dialogues[1].shown) {
    dialogueManager.showDialogue(1);
  }
}

function handleSpriteSwitch() {
  if (keys.up.pressed) {
    player.frames = 1;
    if (lastKey === "right") {
      player.currentSprite = player.sprites.jump.right;
      player.currentCropWidth = player.sprites.jump.cropWidth;
    } else if (lastKey === "left") {
      player.currentSprite = player.sprites.jump.left;
      player.currentCropWidth = player.sprites.jump.cropWidth;
    }
  } else if (
    keys.right.pressed &&
    lastKey === "right" &&
    player.currentSprite !== player.sprites.run.right
  ) {
    player.frames = 1;
    player.currentSprite = player.sprites.run.right;
    player.currentCropWidth = player.sprites.run.cropWidth;
  } else if (
    keys.left.pressed &&
    lastKey === "left" &&
    player.currentSprite !== player.sprites.run.left
  ) {
    player.frames = 1;
    player.currentSprite = player.sprites.run.left;
    player.currentCropWidth = player.sprites.run.cropWidth;
  } else if (
    !keys.left.pressed &&
    lastKey === "left" &&
    player.currentSprite !== player.sprites.stand.left
  ) {
    player.frames = 1;
    player.currentSprite = player.sprites.stand.left;
    player.currentCropWidth = player.sprites.stand.cropWidth;
  } else if (
    !keys.right.pressed &&
    lastKey === "right" &&
    player.currentSprite !== player.sprites.stand.right
  ) {
    player.frames = 1;
    player.currentSprite = player.sprites.stand.right;
    player.currentCropWidth = player.sprites.stand.cropWidth;
  }
}

function checkWinLoseConditions() {
  if (scrollPlatform > platformImage.width * 5 + 300) {
    console.log("🎉 You win");
  }

  if (player.position.y > canvas.height) {
    GameState.reset();
    init();
  }
}

function animate() {
  requestAnimationFrame(animate);

  frameCount++;
  if (frameCount === 2) {
    const loadingScreen = document.getElementById("loading-screen");
    if (loadingScreen) {
      loadingScreen.style.opacity = "0";
      setTimeout(() => loadingScreen.remove(), 600);
    }
  }

  c.fillStyle = "white";
  c.fillRect(0, 0, canvas.width, canvas.height);

  backgroundObjects.forEach((obj) => {
    obj.draw();
  });

  dialogueManager.draw(); // draw the message bubble

  platforms.forEach((platform) => {
    platform.draw();
  });

  player.updatePlayerFrame();
  player.update();

  handlePlayerMovement();
  handleCollisions();
  handleDialogues();
  handleSpriteSwitch();
  checkWinLoseConditions();
}

export function initGame() {
  showLoadingScreen();
  frameCount = 0;
  setTimeout(() => {
    init();
    animate();
  }, 0);
}
