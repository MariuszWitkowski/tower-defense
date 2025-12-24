import { LEVELS, LevelConfig } from "../configs/level-config";

export default class LevelManager {
  private levels: LevelConfig[];

  constructor() {
    this.levels = LEVELS;
  }

  public getLevel(levelIndex: number): LevelConfig | undefined {
    return this.levels[levelIndex];
  }

  public getTotalLevels(): number {
    return this.levels.length;
  }
}
