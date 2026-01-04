import { container } from "tsyringe";
import GridManager from "./managers/GridManager";
import LevelManager from "./managers/LevelManager";
import TurretManager from "./managers/TurretManager";
import WaveManager from "./managers/WaveManager";
import UIManager from "./managers/UIManager";
import { LeaderboardManager } from "./managers/LeaderboardManager";
import GameManager from "./managers/GameManager";
import AssetsManager from "./managers/AssetsManager";

container.registerSingleton("LeaderboardManager", LeaderboardManager);
container.registerSingleton("AssetsManager", AssetsManager);
container.registerSingleton("GridManager", GridManager);
container.registerSingleton("LevelManager", LevelManager);
container.registerSingleton("TurretManager", TurretManager);
container.registerSingleton("WaveManager", WaveManager);
container.registerSingleton("UIManager", UIManager);
container.registerSingleton("GameManager", GameManager);

export default container;
