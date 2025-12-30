import Phaser from "phaser";
import Enemy from "./Enemy";
import Bullet from "./Bullet";
import { TurretType } from "../utils/TurretType";
import { TURRET_RANGE, FIRE_RATE, BULLET_DAMAGE } from "../utils/Constants";

export default class Turret extends Phaser.GameObjects.Sprite {
  public level = 1;
  public damage = BULLET_DAMAGE;
  public range = TURRET_RANGE;
  public fireRate = FIRE_RATE;
  public turretType: TurretType;
  private nextFire: number = 0;
  private enemies: Phaser.Physics.Arcade.Group;
  private bullets: Phaser.Physics.Arcade.Group;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    enemies: Phaser.Physics.Arcade.Group,
    bullets: Phaser.Physics.Arcade.Group,
    turretType: TurretType,
  ) {
    super(scene, x, y, turretType);

    this.enemies = enemies;
    this.bullets = bullets;
    this.turretType = turretType;

    switch (this.turretType) {
      case TurretType.QUICK:
        this.damage = BULLET_DAMAGE * 0.7;
        this.fireRate = FIRE_RATE / 2;
        break;
      case TurretType.HEAVY:
        this.damage = BULLET_DAMAGE * 2;
        this.fireRate = FIRE_RATE * 2;
        break;
      case TurretType.SPLASH:
        this.damage = BULLET_DAMAGE * 0.9;
        this.range = TURRET_RANGE * 0.8;
        break;
    }
  }

  public initialize() {
    this.scene.add.existing(this);
    this.anims.play(`${this.turretType}_anim`);
  }

  update(time: number, _delta: number) {
    if (!this.enemies) return;
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
        const dist = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y);
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
      bullet.fire(this.x, this.y, angle, this.damage, this.turretType);
    }
  }
}
