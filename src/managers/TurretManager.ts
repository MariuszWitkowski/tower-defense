import Phaser from "phaser";
import { injectable } from "tsyringe";
import Turret from "../entities/Turret";
import Bullet from "../entities/Bullet";

@injectable()
export default class TurretManager {
  private scene!: Phaser.Scene;
  private turrets: Phaser.GameObjects.Group;
  private enemies!: Phaser.Physics.Arcade.Group;
  private bullets: Phaser.Physics.Arcade.Group;

  constructor() {
    // Groups will be initialized in setScene
  }

  public setScene(scene: Phaser.Scene) {
    this.scene = scene;
    this.turrets = this.scene.add.group({
      classType: Turret,
      runChildUpdate: true,
    });
    this.bullets = this.scene.physics.add.group({
      classType: Bullet,
      runChildUpdate: true,
    });
  }

  public placeTurret(x: number, y: number) {
    const turret = new Turret(this.scene, x, y, this.enemies, this.bullets);
    this.turrets.add(turret);
  }

  public getBulletGroup() {
    return this.bullets;
  }

  public setEnemyGroup(enemies: Phaser.Physics.Arcade.Group) {
    this.enemies = enemies;
  }

  public getTurretAt(x: number, y: number): Turret | null {
    let foundTurret: Turret | null = null;
    this.turrets.getChildren().forEach((turretChild) => {
      const turret = turretChild as Turret;
      if (Phaser.Math.Distance.Between(turret.x, turret.y, x, y) < 1) {
        foundTurret = turret;
      }
    });
    return foundTurret;
  }

  public upgradeTurret(turret: Turret) {
    turret.upgrade();
    const graphics = this.scene.add.graphics();
    graphics.lineStyle(2, 0x00ff00, 1);
    graphics.strokeCircle(turret.x, turret.y, turret.range);
    this.scene.time.delayedCall(200, () => {
      graphics.destroy();
    });
  }
}
