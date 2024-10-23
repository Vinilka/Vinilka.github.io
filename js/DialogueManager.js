import { DialogueBubble } from './DialogueBubble';

export class DialogueManager {
  constructor(context) {
    this.context = context;
    this.dialogues = [];
  }

  addDialogue(imageSrc, x, y, text) {
    const dialogueBubble = new DialogueBubble(imageSrc, x, y, this.context);
    this.dialogues.push({ bubble: dialogueBubble, text: text, shown: false });
  }

  showDialogue(index) {
    if (index < this.dialogues.length && !this.dialogues[index].shown) {
      this.dialogues[index].bubble.showMessage(this.dialogues[index].text);
      this.dialogues[index].shown = true;
    }
  }

  resetDialogues() {
    this.dialogues.forEach(dialogue => {
      dialogue.shown = false;
      dialogue.bubble.messageVisible = false;
      dialogue.bubble.messageIndex = 0;
      dialogue.bubble.scale = 0;
    });
  }

  updatePositions(offset) {
    this.dialogues.forEach(dialogue => {
      dialogue.bubble.position.x += offset.x;
      dialogue.bubble.position.y += offset.y;
    });
  }

  draw() {
    this.dialogues.forEach(dialogue => {
      if (dialogue.shown) {
        dialogue.bubble.draw();
      }
    });
  }
}
