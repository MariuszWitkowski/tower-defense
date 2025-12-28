import { injectable, inject } from "tsyringe";
import LevelManager from "./LevelManager";
import WaveManager from "./WaveManager";
import TurretManager from "./TurretManager";
import GridManager from "./GridManager";
import UIManager from "./UIManager";
import { useGameStore } from "../state/gameStore";
import Bullet from "../entities/Bullet";
import Enemy from "../entities/Enemy";
import Turret from "../entities/Turret";
import { ENEMY_REWARD, TURRET_UPGRADE_COST } from "../utils/Constants";
import { TurretType } from "../utils/TurretType";

@injectable()
export default class GameManager {
  private scene!: Phaser.Scene;

  constructor(
    @inject("LevelManager") public levelManager: LevelManager,
    @inject("WaveManager") public waveManager: WaveManager,
    @inject("TurretManager") public turretManager: TurretManager,
    @inject("GridManager") public gridManager: GridManager,
    @inject("UIManager") public uiManager: UIManager,
  ) {}

  public setScene(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public initialize() {
    this.setupPhysics();
    useGameStore.subscribe((state) => {
      if (state.lives <= 0) {
        this.gameOver();
      }
    });
  }

  private gameOver() {
    const { actions } = useGameStore.getState();
    actions.setGameOver(true);
    this.waveManager.stopWave();
    this.uiManager.showGameOver();
  }

  public update(_time: number, _delta: number) {
    this.waveManager.update();
  }

  public startCurrentLevel() {
    this.uiManager.hideStartLevelButton();
    const { level, actions } = useGameStore.getState();
    const levelConfig = this.levelManager.getLevel(level - 1);

    if (levelConfig) {
      actions.setLevel(level);
      this.gridManager.setupPath(levelConfig.path);
      this.waveManager.convertGridPathToWorldPath(levelConfig.path);
      this.turretManager.setEnemyGroup(this.waveManager.getEnemyGroup());
      this.startWave();
    } else {
      console.log("YOU WON!");
    }
  }

  private startWave() {
    const { level, wave, actions } = useGameStore.getState();
    const levelConfig = this.levelManager.getLevel(level - 1);
    const waveConfig = levelConfig?.waves[wave];

    if (waveConfig) {
      actions.setWave(wave + 1);
      this.waveManager.startWave(
        waveConfig,
        wave + 1,
        this,
        this.onWaveComplete.bind(this),
      );
    }
  }

  private onWaveComplete() {
    const { level, wave } = useGameStore.getState();
    const levelConfig = this.levelManager.getLevel(level - 1);

    if (levelConfig && wave < levelConfig.waves.length) {
      this.startWave();
    } else {
      this.uiManager.showNewLevelButton();
    }
  }

  public nextLevel() {
    const { level, actions } = useGameStore.getState();
    actions.setLevel(level + 1);
    actions.setWave(0);
    this.turretManager.clearTurrets();
    this.startCurrentLevel();
    this.uiManager.hideNewLevelButton();
  }

  private setupPhysics() {
    this.scene.physics.add.overlap(
      this.turretManager.getBulletGroup(),
      this.waveManager.getEnemyGroup(),
      (bullet, enemy) => this.handleBulletHit(bullet as Bullet, enemy as Enemy),
    );
  }

  private handleBulletHit(bullet: Bullet, enemy: Enemy) {
    bullet.setActive(false);
    bullet.setVisible(false);
    enemy.takeDamage(bullet.damage);

    if (bullet.turretType === TurretType.SPLASH) {
      const splashRadius = 50;
      this.waveManager
        .getEnemyGroup()
        .getChildren()
        .forEach((child) => {
          const otherEnemy = child as Enemy;
          if (
            otherEnemy.active &&
            otherEnemy !== enemy &&
            Phaser.Math.Distance.Between(
              enemy.x,
              enemy.y,
              otherEnemy.x,
              otherEnemy.y,
            ) <= splashRadius
          ) {
            otherEnemy.takeDamage(bullet.damage * 0.5); // Splash damage is 50% of original
            if (!otherEnemy.active) {
              const { actions } = useGameStore.getState();
              actions.earnMoney(ENEMY_REWARD);
            }
          }
        });
    }

    if (!enemy.active) {
      const { actions } = useGameStore.getState();
      actions.earnMoney(ENEMY_REWARD);
    }
  }

  public onEnemyReachedEnd(enemy: Enemy) {
    const { actions } = useGameStore.getState();
    actions.loseLife();
    enemy.destroy();
  }

  public upgradeTurret(turret: Turret) {
    const { money, actions } = useGameStore.getState();
    const cost = TURRET_UPGRADE_COST * turret.level;
    if (money >= cost) {
      actions.spendMoney(cost);
      this.turretManager.upgradeTurret(turret);
    }
  }
}
