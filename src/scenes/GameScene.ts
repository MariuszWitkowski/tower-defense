import Phaser from "phaser";
import GridManager from "../managers/GridManager";
import WaveManager from "../managers/WaveManager";
import TurretManager from "../managers/TurretManager";
import UIManager from "../managers/UIManager";
import LevelManager from "../managers/LevelManager";
import { LevelConfig } from "../configs/level-config";
import {
  STARTING_MONEY,
  STARTING_LIVES,
  ENEMY_REWARD,
  BULLET_DAMAGE,
} from "../utils/Constants";
import Bullet from "../entities/Bullet";
import Enemy from "../entities/Enemy";

export default class GameScene extends Phaser.Scene {
  // Managers
  private gridManager!: GridManager;
  private waveManager!: WaveManager;
  private turretManager!: TurretManager;
  private uiManager!: UIManager;
  private levelManager!: LevelManager;

  // Game State
  private money: number = STARTING_MONEY;
  private lives: number = STARTING_LIVES;
  private currentLevelIndex = 0;
  private currentWaveIndex = 0;
  private levelConfig?: LevelConfig;

  constructor() {
    super("GameScene");
  }

  create() {
    // Init Managers
    this.levelManager = new LevelManager();
    this.uiManager = new UIManager(this);
    this.gridManager = new GridManager(this);

    this.updateUI(); // Set initial money/lives text

    // Start the first level
    this.startLevel(this.currentLevelIndex);
  }

  update() {
    // The wave manager needs to be updated to check for wave completion
    if (this.waveManager) {
      this.waveManager.update();
    }
  }

  private startLevel(levelIndex: number) {
    this.levelConfig = this.levelManager.getLevel(levelIndex);
    if (!this.levelConfig) {
      console.log("YOU WON!");
      // Later: this.scene.start('GameWonScene');
      this.scene.pause();
      return;
    }

    this.currentLevelIndex = levelIndex;
    this.currentWaveIndex = 0;
    this.uiManager.updateLevel(this.currentLevelIndex + 1);

    // Set up the grid and path for the new level
    this.gridManager.setupPath(this.levelConfig.path);

    // Create a new WaveManager for this level
    this.waveManager = new WaveManager(
      this,
      this.gridManager,
      this.levelConfig.path,
      this.onWaveComplete.bind(this), // Pass callback
    );

    // The TurretManager needs to know about the new enemy group
    // If it exists, we just update its target; otherwise, create it.
    if (this.turretManager) {
      this.turretManager.setEnemyGroup(this.waveManager.getEnemyGroup());
    } else {
      this.turretManager = new TurretManager(
        this,
        this.waveManager.getEnemyGroup(),
      );
      this.gridManager.setTurretManager(this.turretManager);

      // We only need to set up collision once
      this.physics.add.overlap(
        this.turretManager.getBulletGroup(),
        this.waveManager.getEnemyGroup(),
        (bullet, enemy) =>
          this.handleBulletHit(bullet as Bullet, enemy as Enemy),
      );
    }

    this.startWave();
  }

  private startWave() {
    if (!this.levelConfig) return;

    const waveConfig = this.levelConfig.waves[this.currentWaveIndex];
    if (waveConfig) {
      this.uiManager.updateWave(
        this.currentWaveIndex + 1,
        this.levelConfig.waves.length,
      );
      this.waveManager.startWave(waveConfig);
    }
  }

  private onWaveComplete() {
    this.currentWaveIndex++;
    if (this.levelConfig && this.currentWaveIndex < this.levelConfig.waves.length) {
      // Start next wave
      this.startWave();
    } else {
      // Level complete
      this.onLevelComplete();
    }
  }

  private onLevelComplete() {
    console.log(`Level ${this.currentLevelIndex + 1} complete!`);
    this.currentLevelIndex++;
    // Optional: Give player money bonus for completing a level
    this.earnMoney(100);
    this.startLevel(this.currentLevelIndex);
  }

  private updateUI() {
    this.uiManager.updateMoney(this.money);
    this.uiManager.updateLives(this.lives);
    if (this.levelConfig) {
      this.uiManager.updateLevel(this.currentLevelIndex + 1);
      this.uiManager.updateWave(
        this.currentWaveIndex + 1,
        this.levelConfig.waves.length,
      );
    }
  }

  public canAfford(cost: number): boolean {
    return this.money >= cost;
  }

  public spendMoney(amount: number) {
    this.money -= amount;
    this.updateUI();
  }

  public earnMoney(amount: number) {
    this.money += amount;
    this.updateUI();
  }

  public onEnemyReachedEnd() {
    this.lives--;
    this.updateUI();
    this.cameras.main.shake(200, 0.01);

    if (this.lives <= 0) {
      this.scene.pause();
      console.log("GAME OVER");
      // Later: this.scene.start('GameOverScene');
    }
  }

  private handleBulletHit(bullet: Bullet, enemy: Enemy) {
    bullet.setActive(false);
    bullet.setVisible(false);
    enemy.takeDamage(BULLET_DAMAGE);

    if (!enemy.active) {
      this.earnMoney(ENEMY_REWARD);
    }
  }
}
