import { createImage } from "../utils/createImage.js";
import playerStandRight from "../assets/playerStandRight.png";
import playerStandLeft from "../assets/playerStandLeft.png";
import playerRunRight from "../assets/playerMoveRight.png";
import playerRunLeft from "../assets/playerMoveLeft.png";
import playerJumpRight from "../assets/playerJumpRight.png";
import playerJumpLeft from "../assets/playerJumpLeft.png";

export class Player {
  constructor({ canvas, context, gravity }) {
    this.canvas = canvas;
    this.context = context;
    this.speed = 10;
    this.gravity = gravity;
    this.position = {
      x: 100,
      y: 100,
    };
    this.velocity = {
      x: 0,
      y: 1,
    };
    this.width = 134;
    this.height = 150;
    this.jumpCount = 0;

    this.image = createImage(playerStandRight);
    this.frames = 0;
    this.sprites = {
      stand: {
        right: createImage(playerStandRight),
        left: createImage(playerStandLeft),
        cropWidth: 387.375,
      },
      run: {
        right: createImage(playerRunRight),
        left: createImage(playerRunLeft),
        cropWidth: 395,
      },
      jump: {
        right: createImage(playerJumpRight),
        left: createImage(playerJumpLeft),
        cropWidth: 395,
      },
    };

    this.currentSprite = this.sprites.stand.right;
    this.currentCropWidth = this.sprites.stand.cropWidth;
  }

  draw() {
    this.context.drawImage(
      this.currentSprite,
      this.currentCropWidth * this.frames,
      -5,
      this.currentCropWidth,
      454,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  updatePlayerFrame() {
    this.frames++;

    if (
      this.frames >= 16 &&
      (this.currentSprite === this.sprites.stand.right ||
        this.currentSprite === this.sprites.stand.left)
    ) {
      this.frames = 0;
    } else if (
      this.frames >= 20 &&
      (this.currentSprite === this.sprites.run.right ||
        this.currentSprite === this.sprites.run.left)
    ) {
      this.frames = 0;
    } else if (
      this.frames >= 30 &&
      (this.currentSprite === this.sprites.jump.right ||
        this.currentSprite === this.sprites.jump.left)
    ) {
      this.frames = 0;
    }
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y <= this.canvas.height) {
      this.velocity.y += this.gravity;
    }
  }
}
