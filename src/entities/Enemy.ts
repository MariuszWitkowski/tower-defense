import Phaser from "phaser";
import GameManager from "../managers/GameManager";
import {
  C_ENEMY,
  ENEMY_DEFENSE,
  ENEMY_HEALTH,
  ENEMY_SPEED,
  TILE_SIZE,
} from "../utils/Constants";

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  private path: Phaser.Math.Vector2[] = [];
  private currentPointIndex: number = 0;
  private moveSpeed: number = ENEMY_SPEED;
  public health: number = ENEMY_HEALTH;
  public defense: number = ENEMY_DEFENSE;
  public speed: number = ENEMY_SPEED;
  private gameManager!: GameManager;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    path: Phaser.Math.Vector2[],
    health: number,
    speed: number,
    defense: number,
    gameManager: GameManager,
  ) {
    const key = "enemyTexture";
    if (!scene.textures.exists(key)) {
      const graphics = scene.make.graphics();
      graphics.fillStyle(C_ENEMY, 1);
      graphics.fillRect(0, 0, TILE_SIZE * 0.6, TILE_SIZE * 0.6);
      graphics.generateTexture(key, TILE_SIZE * 0.6, TILE_SIZE * 0.6);
    }

    super(scene, x, y, key);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.path = path;
    this.currentPointIndex = 0;
    this.health = health;
    this.speed = speed;
    this.defense = defense;
    this.moveSpeed = speed;
    this.gameManager = gameManager;

    this.moveToNextPoint();
  }

  private moveToNextPoint() {
    if (this.currentPointIndex < this.path.length) {
      const target = this.path[this.currentPointIndex];
      this.scene.physics.moveTo(this, target.x, target.y, this.moveSpeed);
    } else {
      this.gameManager.onEnemyReachedEnd(this);
      this.destroy();
    }
  }

  update(_time: number, _delta: number) {
    if (!this.active) return;

    const target = this.path[this.currentPointIndex];

    const distance = Phaser.Math.Distance.Between(
      this.x,
      this.y,
      target.x,
      target.y,
    );

    if (distance < 5) {
      this.setPosition(target.x, target.y);
      this.body?.reset(target.x, target.y);

      this.currentPointIndex++;
      this.moveToNextPoint();
    }
  }

  public takeDamage(amount: number) {
    const damageTaken = Math.max(1, amount - this.defense);
    this.health -= damageTaken;
    if (this.health <= 0) {
      this.destroy();
    } else {
      this.setTint(0xffffff);
      this.scene.time.delayedCall(100, () => {
        this.clearTint();
      });
    }
  }
}
