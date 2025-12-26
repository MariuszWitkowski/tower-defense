import Phaser from "phaser";
import { injectable, inject } from "tsyringe";
import Enemy from "../entities/Enemy";
import GridManager from "./GridManager";
import GameManager from "./GameManager";
import { WaveConfig } from "../configs/level-config";
import { ENEMY_DEFENSE, ENEMY_HEALTH, ENEMY_SPEED } from "../utils/Constants";

@injectable()
export default class WaveManager {
  private scene!: Phaser.Scene;
  private enemyGroup!: Phaser.Physics.Arcade.Group;
  private worldPath: Phaser.Math.Vector2[] = [];
  private spawnTimer?: Phaser.Time.TimerEvent;
  private enemiesToSpawn = 0;
  private onWaveComplete!: () => void;
  private isWaveActive = false;
  private waveNumber = 1;

  constructor(@inject("GridManager") private gridManager: GridManager) {}

  public setScene(scene: Phaser.Scene) {
    this.scene = scene;
    this.enemyGroup = this.scene.physics.add.group({
      classType: Enemy,
      runChildUpdate: true,
    });
  }

  public convertGridPathToWorldPath(gridPath: { x: number; y: number }[]) {
    this.worldPath = gridPath.map((coord) => {
      const worldPos = this.gridManager.getTileCenter(coord.x, coord.y);
      return new Phaser.Math.Vector2(worldPos.x, worldPos.y);
    });
  }

  public startWave(
    waveConfig: WaveConfig,
    waveNumber: number,
    gameManager: GameManager,
    onWaveComplete: () => void,
  ) {
    if (this.worldPath.length === 0) return;

    this.waveNumber = waveNumber;
    this.enemiesToSpawn = waveConfig.enemyCount;
    this.isWaveActive = true;
    this.onWaveComplete = onWaveComplete;

    this.spawnTimer = this.scene.time.addEvent({
      delay: waveConfig.spawnDelay,
      callback: () => this.spawnEnemy(gameManager),
      callbackScope: this,
      repeat: this.enemiesToSpawn - 1,
    });
  }

  private spawnEnemy(gameManager: GameManager) {
    if (this.worldPath.length === 0) return;

    const startPoint = this.worldPath[0];

    const health = ENEMY_HEALTH + this.waveNumber * 10;
    const speed = ENEMY_SPEED + this.waveNumber * 2;
    const defense = ENEMY_DEFENSE + this.waveNumber * 0.5;

    const enemy = new Enemy(
      this.scene,
      startPoint.x,
      startPoint.y,
      this.worldPath,
      health,
      speed,
      defense,
      gameManager,
    );
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
      this.isWaveActive = false;
      this.onWaveComplete();
    }
  }
}
