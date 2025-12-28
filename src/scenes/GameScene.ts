import Phaser from "phaser";
import container from "../di-container";
import AssetsManager from "../managers/AssetsManager";
import GameManager from "../managers/GameManager";

export default class GameScene extends Phaser.Scene {
  private gameManager!: GameManager;
  private assetsManager!: AssetsManager;

  constructor() {
    super("GameScene");
  }

  preload() {
    this.assetsManager = container.resolve(AssetsManager);
    this.assetsManager.preload(this);
  }

  create() {
    this.assetsManager.createAnimations(this);
    this.gameManager = container.resolve(GameManager);

    this.gameManager.setScene(this);
    this.gameManager.gridManager.setScene(this);
    this.gameManager.waveManager.setScene(this);
    this.gameManager.turretManager.setScene(this);
    this.gameManager.levelManager.setScene(this);
    this.gameManager.uiManager.setScene(
      this,
      this.gameManager.upgradeTurret.bind(this.gameManager),
      this.gameManager.nextLevel.bind(this.gameManager),
      this.gameManager.startCurrentLevel.bind(this.gameManager),
    );

    this.gameManager.initialize();
    this.gameManager.uiManager.showStartLevelButton();
  }

  update(time: number, delta: number) {
    this.gameManager.update(time, delta);
    this.gameManager.uiManager.update();
  }
}
