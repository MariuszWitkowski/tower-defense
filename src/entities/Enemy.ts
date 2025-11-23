import Phaser from "phaser";

import type GameScene from "../scenes/GameScene";
import { C_ENEMY, ENEMY_SPEED, TILE_SIZE } from "../utils/Constants";

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  private path: Phaser.Math.Vector2[] = [];
  private currentPointIndex: number = 0;
  private moveSpeed: number = ENEMY_SPEED;

  public health: number = 100;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    path: Phaser.Math.Vector2[],
  ) {
    // We need to create a texture on the fly for our "greybox" red square
    const key = "enemyTexture";
    if (!scene.textures.exists(key)) {
      const graphics = scene.make.graphics({ x: 0, y: 0, add: false });
      graphics.fillStyle(C_ENEMY, 1);
      // Make it slightly smaller than a full tile
      graphics.fillRect(0, 0, TILE_SIZE * 0.6, TILE_SIZE * 0.6);
      graphics.generateTexture(key, TILE_SIZE * 0.6, TILE_SIZE * 0.6);
    }

    super(scene, x, y, key);
    scene.add.existing(this);
    scene.physics.add.existing(this); // Enable physics body

    this.path = path;
    this.currentPointIndex = 0;

    // Start moving to the first point immediately
    this.moveToNextPoint();
  }

  private moveToNextPoint() {
    if (this.currentPointIndex < this.path.length) {
      const target = this.path[this.currentPointIndex];
      this.scene.physics.moveTo(this, target.x, target.y, this.moveSpeed);
    } else {
      // REACHED END
      // Notify the scene
      (this.scene as GameScene).onEnemyReachedEnd();

      this.destroy();
    }
  }

  // This is called every frame by the GameScene update loop
  update(time: number, delta: number) {
    if (!this.active) return;

    const target = this.path[this.currentPointIndex];

    // Calculate distance to the current target point
    const distance = Phaser.Math.Distance.Between(
      this.x,
      this.y,
      target.x,
      target.y,
    );

    // If we are very close to the target point (tolerance of 5 pixels)
    if (distance < 5) {
      // Snap to the point
      this.setPosition(target.x, target.y);
      // Stop current movement
      this.body?.reset(target.x, target.y);

      // Set next target
      this.currentPointIndex++;
      this.moveToNextPoint();
    }
  }

  public takeDamage(amount: number) {
    this.health -= amount;
    if (this.health <= 0) {
      this.destroy();
    } else {
      // Visual feedback: Flash white when hit
      this.setTint(0xffffff);
      this.scene.time.delayedCall(100, () => {
        this.clearTint();
      });
    }
  }
}
