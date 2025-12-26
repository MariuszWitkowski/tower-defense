import Phaser from "phaser";
import container from "../di-container";
import GameManager from "../managers/GameManager";

export default class GameScene extends Phaser.Scene {
  private gameManager!: GameManager;

  constructor() {
    super("GameScene");
  }

  create() {
    this.gameManager = container.resolve(GameManager);

    this.gameManager.setScene(this);
    this.gameManager.gridManager.setScene(this);
    this.gameManager.waveManager.setScene(this);
    this.gameManager.turretManager.setScene(this);
    this.gameManager.uiManager.setScene(this, this.gameManager);

    this.gameManager.start();
  }

  update(time: number, delta: number) {
    this.gameManager.update(time, delta);
  }
}
