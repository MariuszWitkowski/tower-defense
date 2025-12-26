import Phaser from "phaser";
import { injectable } from "tsyringe";
import { C_BULLET, C_ENEMY, C_TURRET, TILE_SIZE } from "../utils/Constants";

@injectable()
export default class AssetsManager {
  public preload(scene: Phaser.Scene) {
    this.createTurretTexture(scene);
    this.createEnemyTexture(scene);
    this.createBulletTexture(scene);
  }

  private createTurretTexture(scene: Phaser.Scene) {
    const key = "turretTexture";
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
  }

  private createEnemyTexture(scene: Phaser.Scene) {
    const key = "enemyTexture";
    if (!scene.textures.exists(key)) {
      const graphics = scene.make.graphics();
      graphics.fillStyle(C_ENEMY, 1);
      graphics.fillRect(0, 0, TILE_SIZE * 0.6, TILE_SIZE * 0.6);
      graphics.generateTexture(key, TILE_SIZE * 0.6, TILE_SIZE * 0.6);
    }
  }

  private createBulletTexture(scene: Phaser.Scene) {
    const key = "bulletTexture";
    if (!scene.textures.exists(key)) {
      const graphics = scene.make.graphics();
      graphics.fillStyle(C_BULLET, 1);
      graphics.fillCircle(4, 4, 4); // 8x8 yellow dot
      graphics.generateTexture(key, 8, 8);
    }
  }
}
