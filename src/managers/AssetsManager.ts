import Phaser from "phaser";
import { injectable } from "tsyringe";
import { C_BULLET } from "../utils/Constants";

// Import the frames for the animations
import enemy1Frame1 from "../assets/enemy-1_frame-1.png";
import enemy1Frame2 from "../assets/enemy-1_frame-2.png";
import enemy2Frame1 from "../assets/enemy-2_frame-1.png";
import enemy2Frame2 from "../assets/enemy-2_frame-2.png";
import enemy3Frame1 from "../assets/enemy-3_frame-1.png";
import enemy3Frame2 from "../assets/enemy-3_frame-2.png";
import turret1Frame1 from "../assets/turret-1_frame-1.png";
import turret1Frame2 from "../assets/turret-1_frame-2.png";
import turret2Frame1 from "../assets/turret-2_frame-1.png";
import turret2Frame2 from "../assets/turret-2_frame-2.png";
import turret3Frame1 from "../assets/turret-3_frame-1.png";
import turret3Frame2 from "../assets/turret-3_frame-2.png";

@injectable()
export default class AssetsManager {
  public preload(scene: Phaser.Scene) {
    // Load the frames as individual images
    scene.load.image("enemy-1-1", enemy1Frame1);
    scene.load.image("enemy-1-2", enemy1Frame2);
    scene.load.image("enemy-2-1", enemy2Frame1);
    scene.load.image("enemy-2-2", enemy2Frame2);
    scene.load.image("enemy-3-1", enemy3Frame1);
    scene.load.image("enemy-3-2", enemy3Frame2);
    scene.load.image("turret-1-1", turret1Frame1);
    scene.load.image("turret-1-2", turret1Frame2);
    scene.load.image("turret-2-1", turret2Frame1);
    scene.load.image("turret-2-2", turret2Frame2);
    scene.load.image("turret-3-1", turret3Frame1);
    scene.load.image("turret-3-2", turret3Frame2);

    this.createBulletTexture(scene);
  }

  public createAnimations(scene: Phaser.Scene) {
    scene.anims.create({
      key: "enemy-1_anim",
      frames: [{ key: "enemy-1-1" }, { key: "enemy-1-2" }],
      frameRate: 2,
      repeat: -1,
    });

    scene.anims.create({
      key: "enemy-2_anim",
      frames: [{ key: "enemy-2-1" }, { key: "enemy-2-2" }],
      frameRate: 2,
      repeat: -1,
    });

    scene.anims.create({
      key: "enemy-3_anim",
      frames: [{ key: "enemy-3-1" }, { key: "enemy-3-2" }],
      frameRate: 2,
      repeat: -1,
    });

    scene.anims.create({
      key: "turret-1_anim",
      frames: [{ key: "turret-1-1" }, { key: "turret-1-2" }],
      frameRate: 2,
      repeat: -1,
    });

    scene.anims.create({
      key: "turret-2_anim",
      frames: [{ key: "turret-2-1" }, { key: "turret-2-2" }],
      frameRate: 2,
      repeat: -1,
    });

    scene.anims.create({
      key: "turret-3_anim",
      frames: [{ key: "turret-3-1" }, { key: "turret-3-2" }],
      frameRate: 2,
      repeat: -1,
    });
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
