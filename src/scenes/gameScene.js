import { setupInputHandlers } from "../utils/inputHandler.js";
import { createLevel } from "../factories/levelFactory.js";

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

// function after dying//
function init() {
  const level = createLevel(c, canvas, gravity);
  let player;
  let platforms = [];
  let dialogueManager;
  let backgroundObjects = [];
  let platformImage;
  player = level.player;
  platforms = level.platforms;
  genericObject = level.backgroundObjects;
  dialogueManager = level.dialogueManager;
  platformImage = level.platformImage;
  scrollPlatform = 0;
  setupInputHandlers(keys, player, (key) => {
    lastKey = key;
  });
}

function animate() {
  requestAnimationFrame(animate);
  c.fillStyle = "white";
  c.fillRect(0, 0, canvas.width, canvas.height);

  backgroundObjects.forEach((backgroundObjects) => {
    backgroundObjects.draw();
  });

  dialogueManager.draw(); // draw the message bubble

  platforms.forEach((platform) => {
    platform.draw();
  });

  player.updatePlayerFrame();
  player.update();

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
      backgroundObjects.forEach((backgroundObjects) => {
        backgroundObjects.position.x -= player.speed * 0.66;
      });
      dialogueManager.updatePositions({ x: -player.speed * 0.66, y: 0 });
    } else if (keys.left.pressed && scrollPlatform > 0) {
      scrollPlatform -= player.speed;
      platforms.forEach((platform) => {
        platform.position.x += player.speed;
      });
      backgroundObjects.forEach((backgroundObjects) => {
        backgroundObjects.position.x += player.speed * 0.66;
      });
      dialogueManager.updatePositions({ x: player.speed * 0.66, y: 0 });
    }
  }

  // platfrom collision //
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

  // Check if player reaches the dialogue trigger points
  if (player.position.x > 200 && !dialogueManager.dialogues[0].shown) {
    dialogueManager.showDialogue(0); // Show the first dialogue bubble
  }
  if (player.position.x > 600 && !dialogueManager.dialogues[1].shown) {
    dialogueManager.showDialogue(1); // Show the second dialogue bubble
  }

  // sprite switch //
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

  // win condition //
  if (scrollPlatform > platformImage.width * 5 + 300) {
    console.log("you win");
  }

  // lose condition //
  if (player.position.y > canvas.height && GameState.isRunning) {
    GameState.reset();
    init();
  }
}

export function initGame() {
  init();
  animate();
}
