import Phaser from "phaser";
import GridManager from "../managers/GridManager";
import WaveManager from "../managers/WaveManager";
import TurretManager from "../managers/TurretManager";
import UIManager from "../managers/UIManager";
import {
  STARTING_MONEY,
  STARTING_LIVES,
  ENEMY_REWARD,
  TURRET_UPGRADE_COST,
} from "../utils/Constants";
import Bullet from "../entities/Bullet";
import Enemy from "../entities/Enemy";
import Turret from "../entities/Turret";

export default class GameScene extends Phaser.Scene {
  // Managers
  private gridManager!: GridManager;
  private waveManager!: WaveManager;
  private turretManager!: TurretManager;
  private uiManager!: UIManager;

  // Game State
  private money: number = STARTING_MONEY;
  private lives: number = STARTING_LIVES;

  // Level Path
  private readonly levelPath = [
    { x: 0, y: 2 },
    { x: 1, y: 2 },
    { x: 2, y: 2 },
    { x: 2, y: 3 },
    { x: 2, y: 4 },
    { x: 3, y: 4 },
    { x: 4, y: 4 },
    { x: 5, y: 4 },
    { x: 5, y: 3 },
    { x: 5, y: 2 },
    { x: 5, y: 1 },
    { x: 6, y: 1 },
    { x: 7, y: 1 },
    { x: 8, y: 1 },
    { x: 9, y: 1 },
  ];

  constructor() {
    super("GameScene");
  }

  create() {
    // 1. Init UI
    this.uiManager = new UIManager(this);
    this.updateUI();

    // 2. Init Managers
    this.gridManager = new GridManager(this);
    this.gridManager.setupPath(this.levelPath);

    this.waveManager = new WaveManager(this, this.gridManager, this.levelPath);
    this.waveManager.startWave();

    this.turretManager = new TurretManager(
      this,
      this.waveManager.getEnemyGroup(),
    );
    this.gridManager.setTurretManager(this.turretManager);
    this.gridManager.setUIManager(this.uiManager);

    // 3. Collision Logic (Updated with Money Reward)
    this.physics.add.overlap(
      this.turretManager.getBulletGroup(),
      this.waveManager.getEnemyGroup(),
      (bullet, enemy) => this.handleBulletHit(bullet as Bullet, enemy as Enemy),
    );
  }

  private updateUI() {
    this.uiManager.updateMoney(this.money);
    this.uiManager.updateLives(this.lives);
  }

  // --- Public Methods for Managers to Call ---

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
    this.cameras.main.shake(200, 0.01); // Visual feedback

    if (this.lives <= 0) {
      this.scene.pause();
      console.log("GAME OVER");
      // Later: this.scene.start('GameOverScene');
    }
  }

  public upgradeTurret(turret: Turret) {
    const cost = TURRET_UPGRADE_COST * turret.level;
    if (this.canAfford(cost)) {
      this.spendMoney(cost);
      this.turretManager.upgradeTurret(turret);
    } else {
      console.log("Not enough money to upgrade!");
    }
  }

  private handleBulletHit(bullet: Bullet, enemy: Enemy) {
    bullet.setActive(false);
    bullet.setVisible(false);
    enemy.takeDamage(bullet.damage);

    // Check if enemy died to give money
    if (!enemy.active) {
      // active is false if destroy() was called in takeDamage
      this.earnMoney(ENEMY_REWARD);
    }
  }
}
