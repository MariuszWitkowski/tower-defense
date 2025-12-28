import Phaser from "phaser";
import { injectable } from "tsyringe";
import { LEVELS, LevelConfig } from "../configs/level-config";

@injectable()
export default class LevelManager {
  private levels: LevelConfig[];

  constructor() {
    this.levels = LEVELS;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public setScene(_scene: Phaser.Scene) {}

  public getLevel(levelIndex: number): LevelConfig | undefined {
    return this.levels[levelIndex];
  }

  public getTotalLevels(): number {
    return this.levels.length;
  }
}
