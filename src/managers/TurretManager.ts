import Phaser from 'phaser';
import Turret from '../entities/Turret';
import Bullet from '../entities/Bullet';

export default class TurretManager {
  private scene: Phaser.Scene;
  private turrets: Phaser.GameObjects.Group;
  private enemies: Phaser.Physics.Arcade.Group;
  private bullets: Phaser.Physics.Arcade.Group;

  constructor(scene: Phaser.Scene, enemies: Phaser.Physics.Arcade.Group) {
    this.scene = scene;
    this.enemies = enemies;
    
    // 1. Create Turret Group
    this.turrets = this.scene.add.group({
      classType: Turret,
      runChildUpdate: true
    });

    // 2. Create Bullet Group
    this.bullets = this.scene.physics.add.group({
      classType: Bullet,
      runChildUpdate: true
    });
  }

  public placeTurret(x: number, y: number) {
    // Pass enemies and bullets to the new turret
    const turret = new Turret(this.scene, x, y, this.enemies, this.bullets);
    this.turrets.add(turret);
  }

  public getBulletGroup() {
    return this.bullets;
  }
}
