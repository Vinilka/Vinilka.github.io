export function setupInputHandlers(keys, player, updateLastKey) {
  window.addEventListener("keydown", ({ key }) => {
    switch (key) {
      case "a":
      case "ArrowLeft":
        keys.left.pressed = true;
        updateLastKey("left");
        break;

      case "d":
      case "ArrowRight":
        keys.right.pressed = true;
        updateLastKey("right");
        break;

      case "w":
      case "ArrowUp":
        if (player.jumpCount < 2) {
          player.jumpCount++;
          keys.up.pressed = true;
          player.velocity.y -= 18;
        }
        break;
    }
  });

  window.addEventListener("keyup", ({ key }) => {
    switch (key) {
      case "a":
      case "ArrowLeft":
        keys.left.pressed = false;
        break;

      case "d":
      case "ArrowRight":
        keys.right.pressed = false;
        break;

      case "w":
      case "ArrowUp":
        keys.up.pressed = false;
        break;
    }
  });
}
