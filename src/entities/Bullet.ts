import Phaser from "phaser";
import { BULLET_SPEED, BULLET_DAMAGE } from "../utils/Constants";
import { TurretType } from "../utils/TurretType";

export default class Bullet extends Phaser.Physics.Arcade.Sprite {
  public damage = BULLET_DAMAGE;
  public turretType!: TurretType;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "bulletTexture");
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }

  public fire(
    x: number,
    y: number,
    angle: number,
    damage: number,
    turretType: TurretType,
  ) {
    this.setPosition(x, y);
    this.setActive(true);
    this.setVisible(true);
    this.damage = damage;
    this.turretType = turretType;

    // Physics magic: velocity based on angle
    this.scene.physics.velocityFromRotation(
      angle,
      BULLET_SPEED,
      this.body!.velocity,
    );
  }

  update(_time: number, _delta: number) {
    // Deactivate if it goes off screen to allow for reuse
    if (this.x < 0 || this.x > 800 || this.y < 0 || this.y > 600) {
      this.setActive(false);
      this.setVisible(false);
    }
  }
}
