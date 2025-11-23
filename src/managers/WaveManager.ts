import Phaser from 'phaser';
import Enemy from '../entities/Enemy';
import GridManager from './GridManager';
import { SPAWN_DELAY } from '../utils/Constants';

export default class WaveManager {
  private scene: Phaser.Scene;
  private gridManager: GridManager;
  // We use a Phaser Group to manage all enemies efficiently
  private enemyGroup: Phaser.Physics.Arcade.Group;
  // The path converted from grid coords to world coords
  private worldPath: Phaser.Math.Vector2[] = [];
  private spawnTimer?: Phaser.Time.TimerEvent;

  constructor(scene: Phaser.Scene, gridManager: GridManager, gridPath: {x:number, y:number}[]) {
    this.scene = scene;
    this.gridManager = gridManager;
    
    // Initialize the physics group for enemies
    this.enemyGroup = this.scene.physics.add.group({
        classType: Enemy,
        runChildUpdate: true // Crucial: tells Phaser to run enemy.update() automatically
    });

    this.convertGridPathToWorldPath(gridPath);
  }

  private convertGridPathToWorldPath(gridPath: {x:number, y:number}[]) {
    this.worldPath = gridPath.map(coord => {
        // Get center point of the tile
        const worldPos = this.gridManager.getTileCenter(coord.x, coord.y);
        // Convert to Vector2 for physics operations
        return new Phaser.Math.Vector2(worldPos.x, worldPos.y);
    });
  }

  public startWave() {
    if (this.worldPath.length === 0) return;

    console.log("Wave Started!");

    // Create a repeating timer to spawn enemies
    this.spawnTimer = this.scene.time.addEvent({
      delay: SPAWN_DELAY,
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true
    });
  }

  private spawnEnemy() {
    if (this.worldPath.length === 0) return;

    const startPoint = this.worldPath[0];
    
    // Create the enemy at the first point of the path
    // Note: We don't need to manually add it to the scene, 
    // the Enemy constructor handles that.
    const enemy = new Enemy(this.scene, startPoint.x, startPoint.y, this.worldPath);
    // Add to our tracking group
    this.enemyGroup.add(enemy);
  }

  public getEnemyGroup() {
    return this.enemyGroup;
  }
}
