import Phaser from "phaser";
import Turret from "../entities/Turret";
import { TURRET_UPGRADE_COST } from "../utils/Constants";
import { useGameStore } from "../state/gameStore";
import { injectable } from "tsyringe";
import GameManager from "./GameManager";

@injectable()
export default class UIManager {
  private scene!: Phaser.Scene;
  private moneyText!: Phaser.GameObjects.Text;
  private livesText!: Phaser.GameObjects.Text;
  private levelText!: Phaser.GameObjects.Text;
  private waveText!: Phaser.GameObjects.Text;
  private turretUIContainer!: Phaser.GameObjects.Container;
  private turretNameText!: Phaser.GameObjects.Text;
  private turretStatsText!: Phaser.GameObjects.Text;
  private upgradeButton!: Phaser.GameObjects.Text;
  private selectedTurret: Turret | null = null;
  private gameManager!: GameManager;

  public setScene(scene: Phaser.Scene, gameManager: GameManager) {
    this.scene = scene;
    this.gameManager = gameManager;
    this.createUI();
    this.createTurretUI();

    useGameStore.subscribe((state) => {
      this.moneyText.setText(`Money: $${state.money}`);
      this.livesText.setText(`Lives: ${state.lives}`);
      this.levelText.setText(`Level: ${state.level}`);
      this.waveText.setText(`Wave: ${state.wave}`);
    });
  }

  private createUI() {
    const style = {
      font: "20px Arial",
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 2,
    };

    this.moneyText = this.scene.add.text(10, 10, "Money: 0", style);
    this.levelText = this.scene.add.text(10, 40, "Level: 1", style);

    this.livesText = this.scene.add
      .text(790, 10, "Lives: 0", style)
      .setOrigin(1, 0);
    this.waveText = this.scene.add
      .text(790, 40, "Wave: 1", style)
      .setOrigin(1, 0);
  }

  private createTurretUI() {
    this.turretUIContainer = this.scene.add.container(10, 100);
    this.turretUIContainer.setVisible(false);

    const background = this.scene.add
      .rectangle(0, 0, 180, 150, 0x000000, 0.7)
      .setOrigin(0);
    this.turretUIContainer.add(background);

    this.turretNameText = this.scene.add.text(10, 10, "", {
      font: "18px Arial",
      color: "#ffffff",
    });
    this.turretStatsText = this.scene.add.text(10, 40, "", {
      font: "14px Arial",
      color: "#ffffff",
    });
    this.upgradeButton = this.scene.add
      .text(90, 120, "Upgrade", { font: "16px Arial", color: "#00ff00" })
      .setOrigin(0.5, 0)
      .setInteractive()
      .on("pointerdown", () => {
        if (this.selectedTurret) {
          this.gameManager.upgradeTurret(this.selectedTurret);
          this.updateTurretUI();
        }
      });

    this.turretUIContainer.add([
      this.turretNameText,
      this.turretStatsText,
      this.upgradeButton,
    ]);
  }

  public showTurretUI(turret: Turret) {
    this.selectedTurret = turret;
    this.updateTurretUI();
    this.turretUIContainer.setVisible(true);
  }

  public hideTurretUI() {
    this.selectedTurret = null;
    this.turretUIContainer.setVisible(false);
  }

  private updateTurretUI() {
    if (!this.selectedTurret) return;

    this.turretNameText.setText(`Turret (Lv ${this.selectedTurret.level})`);
    this.turretStatsText.setText(
      `Damage: ${this.selectedTurret.damage}\nRange: ${this.selectedTurret.range}\nRate: ${
        1000 / this.selectedTurret.fireRate
      }/s`,
    );
    const upgradeCost = TURRET_UPGRADE_COST * this.selectedTurret.level;
    this.upgradeButton.setText(`Upgrade ($${upgradeCost})`);

    const { money } = useGameStore.getState();
    if (money < upgradeCost) {
      this.upgradeButton.setColor("#ff0000").disableInteractive();
    } else {
      this.upgradeButton.setColor("#00ff00").setInteractive();
    }
  }
}
