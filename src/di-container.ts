import { container } from "tsyringe";
import GridManager from "./managers/GridManager";
import LevelManager from "./managers/LevelManager";
import TurretManager from "./managers/TurretManager";
import WaveManager from "./managers/WaveManager";
import UIManager from "./managers/UIManager";
import GameManager from "./managers/GameManager";
import AssetsManager from "./managers/AssetsManager";

container.register("AssetsManager", { useClass: AssetsManager });
container.register("GridManager", { useClass: GridManager });
container.register("LevelManager", { useClass: LevelManager });
container.register("TurretManager", { useClass: TurretManager });
container.register("WaveManager", { useClass: WaveManager });
container.register("UIManager", { useClass: UIManager });
container.register("GameManager", { useClass: GameManager });

export default container;
