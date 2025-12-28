import { container } from "tsyringe";
import GridManager from "./managers/GridManager";
import LevelManager from "./managers/LevelManager";
import TurretManager from "./managers/TurretManager";
import WaveManager from "./managers/WaveManager";
import UIManager from "./managers/UIManager";
import GameManager from "./managers/GameManager";
import AssetsManager from "./managers/AssetsManager";
import ErrorHandler from "./managers/ErrorHandler";
import ErrorDisplay from "./managers/ErrorDisplay";

container.registerSingleton("AssetsManager", AssetsManager);
container.registerSingleton("ErrorDisplay", ErrorDisplay);
container.registerSingleton("ErrorHandler", ErrorHandler);
container.registerSingleton("GridManager", GridManager);
container.registerSingleton("LevelManager", LevelManager);
container.registerSingleton("TurretManager", TurretManager);
container.registerSingleton("WaveManager", WaveManager);
container.registerSingleton("UIManager", UIManager);
container.registerSingleton("GameManager", GameManager);

export default container;
