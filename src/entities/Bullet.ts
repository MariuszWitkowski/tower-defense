import Phaser from "phaser";
import { C_BULLET, BULLET_SPEED } from "../utils/Constants";

export default class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    const key = "bulletTexture";
    if (!scene.textures.exists(key)) {
      const graphics = scene.make.graphics();
      graphics.fillStyle(C_BULLET, 1);
      graphics.fillCircle(4, 4, 4); // 8x8 yellow dot
      graphics.generateTexture(key, 8, 8);
    }

    super(scene, x, y, key);
  }

  public fire(x: number, y: number, angle: number) {
    this.setPosition(x, y);
    this.setActive(true);
    this.setVisible(true);

    // Physics magic: velocity based on angle
    this.scene.physics.velocityFromRotation(
      angle,
      BULLET_SPEED,
      this.body!.velocity,
    );
  }

  update(_time: number, _delta: number) {
    // Destroy if it goes off screen to save memory
    if (this.x < 0 || this.x > 800 || this.y < 0 || this.y > 600) {
      this.destroy();
    }
  }
}
