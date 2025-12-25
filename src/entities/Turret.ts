import Phaser from "phaser";
import Enemy from "./Enemy";
import Bullet from "./Bullet";
import {
  C_TURRET,
  TILE_SIZE,
  TURRET_RANGE,
  FIRE_RATE,
  BULLET_DAMAGE,
} from "../utils/Constants";

export default class Turret extends Phaser.GameObjects.Sprite {
  public level = 1;
  public damage = BULLET_DAMAGE;
  public range = TURRET_RANGE;
  public fireRate = FIRE_RATE;
  private nextFire: number = 0;
  private enemies: Phaser.Physics.Arcade.Group;
  private bullets: Phaser.Physics.Arcade.Group;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    enemies: Phaser.Physics.Arcade.Group,
    bullets: Phaser.Physics.Arcade.Group,
  ) {
    // ... (Keep existing texture generation code from Milestone 4) ...
    const key = "turretTexture";

    // Generate texture if it doesn't exist
    if (!scene.textures.exists(key)) {
      const graphics = scene.make.graphics();
      graphics.fillStyle(C_TURRET, 1);
      // Draw a circle for the turret
      graphics.fillCircle(TILE_SIZE / 2, TILE_SIZE / 2, TILE_SIZE * 0.4);
      // Draw a little "barrel" indicating direction (visual only for now)
      graphics.fillStyle(0xffffff, 1);
      graphics.fillRect(TILE_SIZE / 2, TILE_SIZE / 2 - 5, TILE_SIZE * 0.4, 10);

      graphics.generateTexture(key, TILE_SIZE, TILE_SIZE);
    }

    super(scene, x, y, key);
    scene.add.existing(this);

    this.enemies = enemies;
    this.bullets = bullets;
  }

  update(time: number, _delta: number) {
    // 1. Cooldown Check
    if (time < this.nextFire) return;

    // 2. Find nearest enemy
    const enemy = this.findNearestEnemy();

    if (enemy) {
      // 3. Rotate turret to face enemy
      const angle = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);
      this.setRotation(angle);

      // 4. Fire!
      this.fireBullet(angle);
      this.nextFire = time + this.fireRate;
    }
  }

  public upgrade() {
    this.level++;
    this.damage += 15;
    this.range += 20;
    this.fireRate = Math.max(100, this.fireRate - 100);
  }

  private findNearestEnemy(): Enemy | null {
    let closestEnemy: Enemy | null = null;
    let closestDistance = this.range;

    // Iterate through active enemies
    this.enemies.getChildren().forEach((child) => {
      const enemy = child as Enemy;
      if (enemy.active) {
        const dist = Phaser.Math.Distance.Between(
          this.x,
          this.y,
          enemy.x,
          enemy.y,
        );
        if (dist < closestDistance) {
          closestDistance = dist;
          closestEnemy = enemy;
        }
      }
    });

    return closestEnemy;
  }

  private fireBullet(angle: number) {
    // Create bullet from the bullets group
    const bullet = this.bullets.get(this.x, this.y) as Bullet;
    if (bullet) {
      bullet.fire(this.x, this.y, angle, this.damage);
    }
  }
}
