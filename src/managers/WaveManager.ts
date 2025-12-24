import Phaser from "phaser";
import Enemy from "../entities/Enemy";
import GridManager from "./GridManager";
import { WaveConfig } from "../configs/level-config";

export default class WaveManager {
  private scene: Phaser.Scene;
  private gridManager: GridManager;
  private enemyGroup: Phaser.Physics.Arcade.Group;
  private worldPath: Phaser.Math.Vector2[] = [];
  private spawnTimer?: Phaser.Time.TimerEvent;
  private enemiesToSpawn = 0;
  private onWaveComplete: () => void;
  private isWaveActive = false;

  constructor(
    scene: Phaser.Scene,
    gridManager: GridManager,
    gridPath: { x: number; y: number }[],
    onWaveComplete: () => void,
  ) {
    this.scene = scene;
    this.gridManager = gridManager;
    this.onWaveComplete = onWaveComplete;

    this.enemyGroup = this.scene.physics.add.group({
      classType: Enemy,
      runChildUpdate: true,
    });

    this.convertGridPathToWorldPath(gridPath);
  }

  private convertGridPathToWorldPath(gridPath: { x: number; y: number }[]) {
    this.worldPath = gridPath.map((coord) => {
      const worldPos = this.gridManager.getTileCenter(coord.x, coord.y);
      return new Phaser.Math.Vector2(worldPos.x, worldPos.y);
    });
  }

  public startWave(waveConfig: WaveConfig) {
    if (this.worldPath.length === 0) return;

    console.log(`Wave Started with ${waveConfig.enemyCount} enemies.`);
    this.enemiesToSpawn = waveConfig.enemyCount;
    this.isWaveActive = true;

    this.spawnTimer = this.scene.time.addEvent({
      delay: waveConfig.spawnDelay,
      callback: this.spawnEnemy,
      callbackScope: this,
      repeat: this.enemiesToSpawn - 1,
    });
  }

  private spawnEnemy() {
    if (this.worldPath.length === 0) return;

    const startPoint = this.worldPath[0];

    // Create the enemy at the first point of the path
    // Note: We don't need to manually add it to the scene,
    // the Enemy constructor handles that.
    const enemy = new Enemy(
      this.scene,
      startPoint.x,
      startPoint.y,
      this.worldPath,
    );
    // Add to our tracking group
    this.enemyGroup.add(enemy);
  }

  public getEnemyGroup() {
    return this.enemyGroup;
  }

  public update() {
    if (
      this.isWaveActive &&
      this.spawnTimer?.getOverallProgress() === 1 &&
      this.enemyGroup.countActive(true) === 0
    ) {
      console.log("Wave Complete!");
      this.isWaveActive = false;
      this.onWaveComplete();
    }
  }
}
