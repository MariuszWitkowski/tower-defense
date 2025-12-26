import Phaser from "phaser";
import { injectable, inject } from "tsyringe";
import TurretManager from "./TurretManager";
import UIManager from "./UIManager";
import { useGameStore } from "../state/gameStore";
import {
  TILE_SIZE,
  ROWS,
  COLS,
  C_TILE_DEFAULT,
  C_TILE_HOVER,
  C_GRID_LINE,
  C_PATH,
  TURRET_COST,
} from "../utils/Constants";

@injectable()
export default class GridManager {
  private scene!: Phaser.Scene;
  private logicGrid: number[][] = [];
  private graphicsGrid: Phaser.GameObjects.Rectangle[][] = [];

  constructor(
    @inject("TurretManager") private turretManager: TurretManager,
    @inject("UIManager") private uiManager: UIManager,
  ) {}

  public setScene(scene: Phaser.Scene) {
    this.scene = scene;
    this.initializeGrid();
    this.drawGrid();
  }

  private handleTileClick(x: number, y: number) {
    const tileType = this.logicGrid[y][x];
    const worldPos = this.getTileCenter(x, y);

    if (tileType === 1) {
      this.uiManager.hideTurretUI();
      return;
    }

    if (tileType === 2) {
      const existingTurret = this.turretManager.getTurretAt(
        worldPos.x,
        worldPos.y,
      );
      if (existingTurret) {
        this.uiManager.showTurretUI(existingTurret);
      }
      return;
    }

    const { money, actions } = useGameStore.getState();
    if (money >= TURRET_COST) {
      this.turretManager.placeTurret(worldPos.x, worldPos.y);
      this.logicGrid[y][x] = 2;
      actions.spendMoney(TURRET_COST);
      this.uiManager.hideTurretUI();
    } else {
      console.log("Not enough cash!");
      this.graphicsGrid[y][x].setFillStyle(0xff0000);
      this.scene.time.delayedCall(200, () => {
        this.graphicsGrid[y][x].setFillStyle(C_TILE_DEFAULT);
      });
    }
  }

  public getTileCenter(col: number, row: number) {
    const startX = (this.scene.scale.width - COLS * TILE_SIZE) / 2;
    const startY = (this.scene.scale.height - ROWS * TILE_SIZE) / 2;

    return {
      x: startX + col * TILE_SIZE + TILE_SIZE / 2,
      y: startY + row * TILE_SIZE + TILE_SIZE / 2,
    };
  }

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
    const startX = (this.scene.scale.width - COLS * TILE_SIZE) / 2;
    const startY = (this.scene.scale.height - ROWS * TILE_SIZE) / 2;

    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const worldX = startX + x * TILE_SIZE;
        const worldY = startY + y * TILE_SIZE;

        const tile = this.scene.add
          .rectangle(worldX, worldY, TILE_SIZE, TILE_SIZE, C_TILE_DEFAULT)
          .setOrigin(0, 0)
          .setStrokeStyle(1, C_GRID_LINE)
          .setInteractive();

        this.graphicsGrid[y][x] = tile;

        tile.on("pointerover", () => {
          if (this.logicGrid[y][x] === 0) tile.setFillStyle(C_TILE_HOVER);
        });
        tile.on("pointerout", () => {
          if (this.logicGrid[y][x] === 0) tile.setFillStyle(C_TILE_DEFAULT);
          else if (this.logicGrid[y][x] === 1) tile.setFillStyle(C_PATH);
        });
        tile.on("pointerdown", () => this.handleTileClick(x, y));
      }
    }
  }

  public setupPath(pathCoords: { x: number; y: number }[]) {
    pathCoords.forEach((coord) => {
      if (this.graphicsGrid[coord.y] && this.graphicsGrid[coord.y][coord.x]) {
        this.logicGrid[coord.y][coord.x] = 1;
        this.graphicsGrid[coord.y][coord.x].setFillStyle(C_PATH);
      }
    });
  }
}
