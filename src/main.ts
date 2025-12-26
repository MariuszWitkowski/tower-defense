import "reflect-metadata";
import Phaser from "phaser";
import GameScene from "./scenes/GameScene";
import "./style.css"; // Optional: For basic CSS resets

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
