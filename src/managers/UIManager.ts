import Phaser from "phaser";
import Turret from "../entities/Turret";
import { TURRET_UPGRADE_COST } from "../utils/Constants";
import { useGameStore } from "../state/gameStore";
import { injectable, inject } from "tsyringe";
import { TurretType } from "../utils/TurretType";
import ErrorHandler from "./ErrorHandler";

@injectable()
export default class UIManager {
  private scene!: Phaser.Scene;
  private errorHandler!: ErrorHandler;
  private errorIcon!: Phaser.GameObjects.Text;
  private errorPopup!: Phaser.GameObjects.Container;
  private moneyText!: Phaser.GameObjects.Text;
  private livesText!: Phaser.GameObjects.Text;
  private levelText!: Phaser.GameObjects.Text;
  private waveText!: Phaser.GameObjects.Text;
  private gameOverText!: Phaser.GameObjects.Text;
  private turretUIContainer!: Phaser.GameObjects.Container;
  private turretNameText!: Phaser.GameObjects.Text;
  private turretStatsText!: Phaser.GameObjects.Text;
  private upgradeButton!: Phaser.GameObjects.Text;
  private newLevelButton!: Phaser.GameObjects.Text;
  private startLevelButton!: Phaser.GameObjects.Text;
  private selectedTurret: Turret | null = null;
  private selectedTurretType: TurretType = TurretType.QUICK;
  private quickTurretButton!: Phaser.GameObjects.Text;
  private heavyTurretButton!: Phaser.GameObjects.Text;
  private splashTurretButton!: Phaser.GameObjects.Text;
  private upgradeTurretCallback!: (turret: Turret) => void;
  private nextLevelCallback!: () => void;
  private startLevelCallback!: () => void;

  constructor(@inject("ErrorHandler") errorHandler: ErrorHandler) {
    this.errorHandler = errorHandler;
  }

  public setScene(
    scene: Phaser.Scene,
    upgradeTurretCallback: (turret: Turret) => void,
    nextLevelCallback: () => void,
    startLevelCallback: () => void,
  ) {
    this.scene = scene;
    this.upgradeTurretCallback = upgradeTurretCallback;
    this.nextLevelCallback = nextLevelCallback;
    this.startLevelCallback = startLevelCallback;
    this.createUI();
    this.createTurretUI();
    this.createTurretSelectionUI();
    this.createNewLevelButton();
    this.createStartLevelButton();
    this.createErrorUI();
    this.createGameOverText();

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
          this.upgradeTurretCallback(this.selectedTurret);
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

  private createNewLevelButton() {
    this.newLevelButton = this.scene.add
      .text(400, 300, "Start Next Level", {
        font: "32px Arial",
        color: "#00ff00",
        backgroundColor: "#000000",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => {
        this.nextLevelCallback();
      });
    this.newLevelButton.setVisible(false);
  }

  private createStartLevelButton() {
    this.startLevelButton = this.scene.add
      .text(400, 300, "Start Level", {
        font: "32px Arial",
        color: "#00ff00",
        backgroundColor: "#000000",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => {
        this.startLevelCallback();
      });
    this.startLevelButton.setVisible(false);
  }

  public showNewLevelButton() {
    this.newLevelButton.setVisible(true);
  }

  public hideNewLevelButton() {
    this.newLevelButton.setVisible(false);
  }

  public showStartLevelButton() {
    this.startLevelButton.setVisible(true);
  }

  public hideStartLevelButton() {
    this.startLevelButton.setVisible(false);
  }

  private createTurretSelectionUI() {
    const turretSelectionContainer = this.scene.add.container(10, 300);

    this.quickTurretButton = this.scene.add
      .text(0, 0, "Build Quick Turret")
      .setInteractive()
      .on("pointerdown", () => {
        this.selectedTurretType = TurretType.QUICK;
        this.updateTurretButtonStyles();
      });

    this.heavyTurretButton = this.scene.add
      .text(0, 30, "Build Heavy Turret")
      .setInteractive()
      .on("pointerdown", () => {
        this.selectedTurretType = TurretType.HEAVY;
        this.updateTurretButtonStyles();
      });

    this.splashTurretButton = this.scene.add
      .text(0, 60, "Build Splash Turret")
      .setInteractive()
      .on("pointerdown", () => {
        this.selectedTurretType = TurretType.SPLASH;
        this.updateTurretButtonStyles();
      });

    turretSelectionContainer.add([
      this.quickTurretButton,
      this.heavyTurretButton,
      this.splashTurretButton,
    ]);

    this.updateTurretButtonStyles();
  }

  private updateTurretButtonStyles() {
    const style = { font: "18px Arial", color: "#ffffff" };
    const selectedStyle = { font: "18px Arial", color: "#00ff00" };

    this.quickTurretButton.setStyle(
      this.selectedTurretType === TurretType.QUICK ? selectedStyle : style,
    );
    this.heavyTurretButton.setStyle(
      this.selectedTurretType === TurretType.HEAVY ? selectedStyle : style,
    );
    this.splashTurretButton.setStyle(
      this.selectedTurretType === TurretType.SPLASH ? selectedStyle : style,
    );
  }

  public getSelectedTurretType(): TurretType {
    return this.selectedTurretType;
  }

  private createErrorUI() {
    this.errorIcon = this.scene.add
      .text(770, 570, "\uD83D\uDC1E", { fontSize: "30px" })
      .setInteractive()
      .setVisible(false);

    this.errorPopup = this.scene.add.container(100, 100).setVisible(false);
    const background = this.scene.add.graphics();
    background.fillStyle(0x000000, 0.8);
    background.fillRect(0, 0, 600, 400);
    this.errorPopup.add(background);

    const errorText = this.scene.add.text(10, 10, "", {
      fontSize: "16px",
      color: "#ffffff",
      wordWrap: { width: 580 },
    });
    this.errorPopup.add(errorText);

    const closeButton = this.scene.add
      .text(590, 10, "X", { fontSize: "20px", color: "#ffffff" })
      .setInteractive()
      .setOrigin(1, 0);
    this.errorPopup.add(closeButton);

    const copyButton = this.scene.add
      .text(500, 370, "Copy", { fontSize: "20px", color: "#ffffff" })
      .setInteractive();
    this.errorPopup.add(copyButton);

    this.errorIcon.on("pointerdown", () => {
      errorText.setText(this.getFormattedErrors());
      this.errorPopup.setVisible(true);
    });

    closeButton.on("pointerdown", () => {
      this.errorPopup.setVisible(false);
    });

    copyButton.on("pointerdown", () => {
      navigator.clipboard.writeText(this.getFormattedErrors());
    });
  }

  private getFormattedErrors(): string {
    const errors = this.errorHandler.getErrors();
    return errors.map((e) => `${e.message}\n${e.stack}`).join("\n\n");
  }

  public update() {
    if (this.errorHandler.getErrors().length > 0) {
      this.errorIcon.setVisible(true);
    }
  }

  public showGameOver() {
    this.gameOverText.setVisible(true);
  }

  private createGameOverText() {
    this.gameOverText = this.scene.add
      .text(400, 300, "Game Over", {
        font: "48px Arial",
        color: "#ff0000",
        backgroundColor: "#000000",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setVisible(false);
  }
}
