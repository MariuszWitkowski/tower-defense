import Phaser from 'phaser';
import TurretManager from './TurretManager'; // <--- Import this
import type GameScene from '../scenes/GameScene'; 
import { TILE_SIZE, ROWS, COLS, C_TILE_DEFAULT, C_TILE_HOVER, C_GRID_LINE, C_PATH, TURRET_COST } from '../utils/Constants';

export default class GridManager {
  private scene: Phaser.Scene;
  private turretManager?: TurretManager; // <--- Optional reference
  private logicGrid: number[][] = []; 
  private graphicsGrid: Phaser.GameObjects.Rectangle[][] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.initializeGrid();
    this.drawGrid();
  }
  
  // New method to link the systems
  public setTurretManager(tm: TurretManager) {
    this.turretManager = tm;
  }

  // ... (initializeGrid and drawGrid methods stay the same) ...
  // RE-PASTE initializeGrid and drawGrid from previous step if you are rewriting the file,
  // OR just ensure you only modify the handleTileClick below.
  
  // Make sure you have the initializeGrid and drawGrid code from Milestone 2 here.
  // I will just show the updated handleTileClick for brevity.

  private handleTileClick(x: number, y: number) {
    const tileType = this.logicGrid[y][x];
    // Cast the scene so we can access specific methods
    const gameScene = this.scene as GameScene;

    if (tileType === 1) return; // Path
    if (tileType === 2) return; // Existing Tower

    if (this.turretManager) {
        // CHECK: Can we afford it?
        if (gameScene.canAfford(TURRET_COST)) {
            
            const worldPos = this.getTileCenter(x, y);
            this.turretManager.placeTurret(worldPos.x, worldPos.y);
            
            this.logicGrid[y][x] = 2;
            
            // DEDUCT MONEY
            gameScene.spendMoney(TURRET_COST);
            console.log(`Built turret. Remaining: ${gameScene.canAfford(0)}`); // Just logging remaining money logic
        } else {
            console.log("Not enough cash!");
            // Optional: Add visual feedback like a red flash
            this.graphicsGrid[y][x].setFillStyle(0xff0000);
            this.scene.time.delayedCall(200, () => {
                this.graphicsGrid[y][x].setFillStyle(0x222222); // Reset to default color
            });
        }
    }
  }

  // Keep the Helper method
  public getTileCenter(col: number, row: number) {
    const startX = (this.scene.scale.width - (COLS * TILE_SIZE)) / 2;
    const startY = (this.scene.scale.height - (ROWS * TILE_SIZE)) / 2;
    
    return {
      x: startX + col * TILE_SIZE + TILE_SIZE / 2,
      y: startY + row * TILE_SIZE + TILE_SIZE / 2
    };
  }
  
  // --- RE-ADD THESE IF YOU OVERWRITE THE FILE ---
  private initializeGrid() {
      for (let y = 0; y < ROWS; y++) {
          this.logicGrid[y] = [];
          this.graphicsGrid[y] = [];
          for (let x = 0; x < COLS; x++) {
              this.logicGrid[y][x] = 0;
          }
      }
  }

  private drawGrid() {
      const startX = (this.scene.scale.width - (COLS * TILE_SIZE)) / 2;
      const startY = (this.scene.scale.height - (ROWS * TILE_SIZE)) / 2;

      for (let y = 0; y < ROWS; y++) {
          for (let x = 0; x < COLS; x++) {
              const worldX = startX + (x * TILE_SIZE);
              const worldY = startY + (y * TILE_SIZE);

              const tile = this.scene.add.rectangle(worldX, worldY, TILE_SIZE, TILE_SIZE, C_TILE_DEFAULT)
                  .setOrigin(0, 0)
                  .setStrokeStyle(1, C_GRID_LINE)
                  .setInteractive();

              this.graphicsGrid[y][x] = tile;

              tile.on('pointerover', () => { if (this.logicGrid[y][x] === 0) tile.setFillStyle(C_TILE_HOVER); });
              tile.on('pointerout', () => { 
                  if (this.logicGrid[y][x] === 0) tile.setFillStyle(C_TILE_DEFAULT);
                  else if (this.logicGrid[y][x] === 1) tile.setFillStyle(C_PATH);
              });
              tile.on('pointerdown', () => { this.handleTileClick(x, y); });
          }
      }
  }
  
  public setupPath(pathCoords: {x: number, y: number}[]) {
      pathCoords.forEach(coord => {
          if (this.graphicsGrid[coord.y] && this.graphicsGrid[coord.y][coord.x]) {
              this.logicGrid[coord.y][coord.x] = 1;
              this.graphicsGrid[coord.y][coord.x].setFillStyle(C_PATH);
          }
      });
  }
}
