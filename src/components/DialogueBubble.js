import { createImage } from "../src/utils/createImage";

export class DialogueBubble {
  constructor(imageSrc, x, y, context) {
    this.context = context;
    this.image = createImage(imageSrc);
    this.position = {
      x,
      y,
    };
    this.width = 280;
    this.height = 180;
    this.padding = 10;
    this.horizontalPadding = 26;
    this.messageText = "";
    this.messageIndex = 0;
    this.messageVisible = false;
    this.typingSpeed = 50;

    this.scale = 0;
    this.scaleIncrement = 0.03;
    this.textStartDelay = 1000;
  }

  showMessage(text) {
    this.messageText = text;
    this.messageIndex = 0;
    this.messageVisible = true;
    setTimeout(() => this.typeMessage(), this.textStartDelay);
  }

  typeMessage() {
    if (this.messageIndex < this.messageText.length) {
      this.messageIndex++;
      setTimeout(() => this.typeMessage(), this.typingSpeed);
    }
  }

  draw() {
    if (this.messageVisible) {
      if (this.scale < 1) {
        this.scale += this.scaleIncrement;
      }

      this.context.save();
      this.context.translate(
        this.position.x + this.width / 2,
        this.position.y + this.height / 2
      );
      this.context.scale(this.scale, this.scale);
      this.context.translate(
        -(this.position.x + this.width / 2),
        -(this.position.y + this.height / 2)
      );
      this.context.drawImage(
        this.image,
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );
      this.context.restore();

      this.context.fillStyle = "#1d6c7a";
      this.context.font = "18px PatrickHand";
      this.wrapText(
        this.messageText.slice(0, this.messageIndex),
        this.position.x + this.horizontalPadding,
        this.position.y + this.padding,
        this.width - this.horizontalPadding * 2,
        20
      );
    }
  }

  wrapText(text, x, y, maxWidth, lineHeight) {
    const words = text.split(" ");
    let line = "";
    let lines = [];
    let testLine = "";
    let metrics = null;
    let testWidth = 0;

    for (let i = 0; i < words.length; i++) {
      testLine = line + words[i] + " ";
      metrics = this.context.measureText(testLine);
      testWidth = metrics.width;
      if (testWidth > maxWidth && i > 0) {
        lines.push(line);
        line = words[i] + " ";
      } else {
        line = testLine;
      }
    }
    lines.push(line);

    const totalHeight = lines.length * lineHeight;
    let offsetY = y + (this.height - totalHeight) / 2 + lineHeight;

    for (let i = 0; i < lines.length; i++) {
      this.context.fillText(lines[i], x, offsetY);
      offsetY += lineHeight;
    }
  }

  isVisible() {
    return this.messageVisible;
  }
}
