import { Player } from "../components/Player.js";
import { Platform } from "../components/Platform.js";
import { GenericObject } from "../components/GenericObject.js";
import { DialogueManager } from "../managers/DialogueManager.js";
import { createImage } from "../utils/createImage.js";

import platform from "../assets/platform.png";
import platformSmallTall from "../assets/platformSmallTall.png";
import background from "../assets/background.png";
import hills from "../assets/hills.png";
import dialogueBoxRight from "../assets/dialogueBoxRight.png";

export function createLevel(context, canvas, gravity) {
  const platformImage = createImage(platform);
  const platformSmallTallImage = createImage(platformSmallTall);

  const player = new Player({ canvas, context, gravity });

  const platforms = [
    new Platform({
      x: platformImage.width * 4 + 250,
      y: 270,
      image: platformSmallTallImage,
      context,
    }),
    new Platform({ x: 0, y: 470, image: platformImage, context }),
    new Platform({
      x: platformImage.width,
      y: 470,
      image: platformImage,
      context,
    }),
    new Platform({
      x: platformImage.width * 2,
      y: 470,
      image: platformImage,
      context,
    }),
    new Platform({
      x: platformImage.width * 3,
      y: 470,
      image: platformImage,
      context,
    }),
    new Platform({
      x: platformImage.width * 4,
      y: 470,
      image: platformImage,
      context,
    }),
    new Platform({
      x: platformImage.width * 5 + 200,
      y: 470,
      image: platformImage,
      context,
    }),
  ];

  const backgroundObjects = [
    new GenericObject({ x: 0, y: 0, image: createImage(background), context }),
    new GenericObject({ x: 0, y: 0, image: createImage(hills), context }),
  ];

  const dialogueManager = new DialogueManager(context);
  dialogueManager.addDialogue(
    dialogueBoxRight,
    750,
    60,
    "Hello there! I'm Anastasia. Welcome to my game!"
  );
  dialogueManager.addDialogue(
    dialogueBoxRight,
    1050,
    60,
    "I am passionate about programming and good looking designs"
  );

  return {
    player,
    platforms,
    backgroundObjects,
    dialogueManager,
    platformImage,
  };
}
