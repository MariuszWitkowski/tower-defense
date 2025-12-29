import "reflect-metadata";
import Phaser from "phaser";
import GameScene from "./scenes/GameScene";
import "./style.css"; // Optional: For basic CSS resets
import ErrorHandler from "./managers/ErrorHandler";
import container from "./di-container";

// Resolve instances from the container
const errorHandler = container.resolve(ErrorHandler);

window.onerror = (message, source, lineno, colno, error) => {
  if (error) {
    errorHandler.addError(error);
  } else {
    const syntheticError = new Error(
      `Unhandled error: ${message} at ${source}:${lineno}:${colno}`,
    );
    errorHandler.addError(syntheticError);
  }
  return true;
};

window.addEventListener("unhandledrejection", (event) => {
  if (event.reason instanceof Error) {
    errorHandler.addError(event.reason);
  } else {
    const syntheticError = new Error(
      `Unhandled promise rejection: ${event.reason}`,
    );
    errorHandler.addError(syntheticError);
  }
});

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO, // Tries WebGL first, falls back to Canvas
  width: 800,
  height: 600,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  parent: "app", // The ID of the HTML div where the game lives
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 0 }, // Top-down games have no gravity
      debug: true, // Set to false when releasing the game
    },
  },
  scene: [GameScene], // We will add more scenes (UI, GameOver) here later
  backgroundColor: "#2d2d2d", // Nice dark grey background
};

window.onload = () => {
  new Phaser.Game(config);
};
