export interface WaveConfig {
  enemyCount: number;
  spawnDelay: number; // ms between each enemy in the wave
}

export interface LevelConfig {
  path: { x: number; y: number }[];
  waves: WaveConfig[];
  enemyTexture: string;
}

export const LEVELS: LevelConfig[] = [
  // Level 1
  {
    path: [
      { x: 0, y: 2 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
      { x: 2, y: 3 },
      { x: 2, y: 4 },
      { x: 3, y: 4 },
      { x: 4, y: 4 },
      { x: 5, y: 4 },
      { x: 5, y: 3 },
      { x: 5, y: 2 },
      { x: 5, y: 1 },
      { x: 6, y: 1 },
      { x: 7, y: 1 },
      { x: 8, y: 1 },
      { x: 9, y: 1 },
    ],
    waves: [
      { enemyCount: 5, spawnDelay: 1000 },
      { enemyCount: 8, spawnDelay: 800 },
      { enemyCount: 10, spawnDelay: 500 },
    ],
    enemyTexture: "enemy-1",
  },
  // Level 2
  {
    path: [
      { x: 0, y: 4 },
      { x: 1, y: 4 },
      { x: 2, y: 4 },
      { x: 2, y: 3 },
      { x: 2, y: 2 },
      { x: 3, y: 2 },
      { x: 4, y: 2 },
      { x: 5, y: 2 },
      { x: 6, y: 2 },
      { x: 7, y: 2 },
      { x: 7, y: 3 },
      { x: 7, y: 4 },
      { x: 7, y: 5 },
      { x: 8, y: 5 },
      { x: 9, y: 5 },
    ],
    waves: [
      { enemyCount: 10, spawnDelay: 1000 },
      { enemyCount: 15, spawnDelay: 700 },
      { enemyCount: 20, spawnDelay: 400 },
    ],
    enemyTexture: "enemy-2",
  },
  // Level 3
  {
    path: [
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
      { x: 4, y: 1 },
      { x: 4, y: 2 },
      { x: 4, y: 3 },
      { x: 4, y: 4 },
      { x: 5, y: 4 },
      { x: 6, y: 4 },
      { x: 7, y: 4 },
      { x: 8, y: 4 },
      { x: 8, y: 3 },
      { x: 8, y: 2 },
      { x: 8, y: 1 },
      { x: 9, y: 1 },
    ],
    waves: [
      { enemyCount: 15, spawnDelay: 900 },
      { enemyCount: 20, spawnDelay: 600 },
      { enemyCount: 25, spawnDelay: 300 },
    ],
    enemyTexture: "enemy-3",
  },
  // Level 4
  {
    path: [
      { x: 0, y: 5 },
      { x: 1, y: 5 },
      { x: 1, y: 4 },
      { x: 1, y: 3 },
      { x: 2, y: 3 },
      { x: 3, y: 3 },
      { x: 4, y: 3 },
      { x: 5, y: 3 },
      { x: 6, y: 3 },
      { x: 7, y: 3 },
      { x: 8, y: 3 },
      { x: 8, y: 2 },
      { x: 8, y: 1 },
      { x: 8, y: 0 },
      { x: 9, y: 0 },
    ],
    waves: [
      { enemyCount: 20, spawnDelay: 800 },
      { enemyCount: 25, spawnDelay: 500 },
      { enemyCount: 30, spawnDelay: 200 },
    ],
    enemyTexture: "enemy-1",
  },
  // Level 5
  {
    path: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 3, y: 0 },
      { x: 4, y: 0 },
      { x: 4, y: 1 },
      { x: 3, y: 1 },
      { x: 2, y: 1 },
      { x: 2, y: 2 },
      { x: 2, y: 3 },
      { x: 2, y: 4 },
      { x: 3, y: 4 },
      { x: 4, y: 4 },
      { x: 5, y: 4 },
      { x: 6, y: 4 },
      { x: 7, y: 4 },
      { x: 8, y: 4 },
      { x: 9, y: 4 },
    ],
    waves: [
      { enemyCount: 25, spawnDelay: 700 },
      { enemyCount: 30, spawnDelay: 400 },
      { enemyCount: 40, spawnDelay: 100 },
    ],
    enemyTexture: "enemy-2",
  },
];
