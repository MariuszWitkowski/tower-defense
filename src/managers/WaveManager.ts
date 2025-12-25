import Phaser from "phaser";
import Enemy from "../entities/Enemy";
import GridManager from "./GridManager";
import {
  ENEMY_DEFENSE,
  ENEMY_HEALTH,
  ENEMY_SPEED,
  SPAWN_DELAY,
} from "../utils/Constants";

export default class WaveManager {
  private scene: Phaser.Scene;
  private gridManager: GridManager;
  // We use a Phaser Group to manage all enemies efficiently
  private enemyGroup: Phaser.Physics.Arcade.Group;
  // The path converted from grid coords to world coords
  private worldPath: Phaser.Math.Vector2[] = [];
  private waveNumber = 1;
  private enemiesPerWave = 10;
  private enemiesSpawned = 0;
  private spawnTimer?: Phaser.Time.TimerEvent;
  private waveText!: Phaser.GameObjects.Text;

  constructor(
    scene: Phaser.Scene,
    gridManager: GridManager,
    gridPath: { x: number; y: number }[],
  ) {
    this.scene = scene;
    this.gridManager = gridManager;

    // Initialize the physics group for enemies
    this.enemyGroup = this.scene.physics.add.group({
      classType: Enemy,
      runChildUpdate: true, // Crucial: tells Phaser to run enemy.update() automatically
    });

    this.convertGridPathToWorldPath(gridPath);
    this.createWaveUI();
  }

  private createWaveUI() {
    this.waveText = this.scene.add.text(
      this.scene.scale.width / 2,
      20,
      `Wave: ${this.waveNumber}`,
      {
        font: "24px Arial",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 4,
      },
    );
    this.waveText.setOrigin(0.5, 0);
  }

  private convertGridPathToWorldPath(gridPath: { x: number; y: number }[]) {
    this.worldPath = gridPath.map((coord) => {
      // Get center point of the tile
      const worldPos = this.gridManager.getTileCenter(coord.x, coord.y);
      // Convert to Vector2 for physics operations
      return new Phaser.Math.Vector2(worldPos.x, worldPos.y);
    });
  }

  public startWave() {
    if (this.worldPath.length === 0) return;

    console.log(`Wave ${this.waveNumber} Started!`);
    this.enemiesSpawned = 0;
    this.waveText.setText(`Wave: ${this.waveNumber}`);

    // Create a repeating timer to spawn enemies
    this.spawnTimer = this.scene.time.addEvent({
      delay: SPAWN_DELAY,
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true,
    });
  }

  private spawnEnemy() {
    if (
      this.worldPath.length === 0 ||
      this.enemiesSpawned >= this.enemiesPerWave
    ) {
      this.spawnTimer?.remove();
      // Start a timer for the next wave
      this.scene.time.delayedCall(5000, this.nextWave, [], this);
      return;
    }

    const startPoint = this.worldPath[0];

    // --- SCALING LOGIC ---
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
    );
    this.enemyGroup.add(enemy);
    this.enemiesSpawned++;
  }

  private nextWave() {
    this.waveNumber++;
    this.enemiesPerWave += 5; // Increase enemies for the next wave
    this.startWave();
  }

  public getEnemyGroup() {
    return this.enemyGroup;
  }
}
