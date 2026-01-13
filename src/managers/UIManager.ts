import Phaser from "phaser";
import Turret from "../entities/Turret";
import { TURRET_UPGRADE_COST } from "../utils/Constants";
import { useGameStore } from "../state/gameStore";
import { injectable, inject } from "tsyringe";
import { TurretType } from "../utils/TurretType";
import { LeaderboardManager } from "./LeaderboardManager";

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

  constructor(@inject("LeaderboardManager") private leaderboardManager: LeaderboardManager) {}

  public setScene(
    scene: Phaser.Scene,
    upgradeTurretCallback: (turret: Turret) => void,
    nextLevelCallback: () => void,
    startLevelCallback: () => void,
  ) {
    this.scene = scene;
    this.leaderboardManager.setScene(scene);
    this.upgradeTurretCallback = upgradeTurretCallback;
    this.nextLevelCallback = nextLevelCallback;
    this.startLevelCallback = startLevelCallback;
    this.createUI();
    this.createTurretUI();
    this.createTurretSelectionUI();
    this.createNewLevelButton();
    this.createStartLevelButton();

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

    this.livesText = this.scene.add.text(790, 10, "Lives: 0", style).setOrigin(1, 0);
    this.waveText = this.scene.add.text(790, 40, "Wave: 1", style).setOrigin(1, 0);

    const leaderboardButton = this.scene.add
      .text(400, 570, "Leaderboard", style)
      .setOrigin(0.5, 0)
      .setInteractive()
      .on("pointerdown", () => {
        this.leaderboardManager.showLeaderboard();
      });
  }

  private createTurretUI() {
    this.turretUIContainer = this.scene.add.container(10, 400);
    this.turretUIContainer.setVisible(false);

    const background = this.scene.add.rectangle(0, 0, 180, 150, 0x000000, 0.7).setOrigin(0);
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

    this.turretUIContainer.add([this.turretNameText, this.turretStatsText, this.upgradeButton]);
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
    const turretSelectionContainer = this.scene.add.container(10, 450);

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

  public showGameOver() {
    const gameOverContainer = this.scene.add.container(400, 300);

    const background = this.scene.add.rectangle(0, 0, 300, 200, 0x000000, 0.8).setOrigin(0.5);
    gameOverContainer.add(background);

    const gameOverText = this.scene.add
      .text(0, -50, "Game Over", {
        font: "32px Arial",
        color: "#ff0000",
      })
      .setOrigin(0.5);
    gameOverContainer.add(gameOverText);

    const nameInput = this.scene.add
      .dom(0, 20)
      .createFromHTML(
        '<input type="text" id="nameInput" placeholder="Enter your name" style="width: 200px; padding: 10px; font-size: 16px;">',
      )
      .setOrigin(0.5);
    gameOverContainer.add(nameInput);

    const submitButton = this.scene.add
      .text(0, 80, "Submit", {
        font: "24px Arial",
        color: "#00ff00",
        backgroundColor: "#333333",
        padding: { x: 10, y: 5 },
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => {
        const name = (document.getElementById("nameInput") as HTMLInputElement).value;
        if (name) {
          const { money } = useGameStore.getState();
          this.leaderboardManager.saveScore(name, money);
          gameOverContainer.destroy();
          this.leaderboardManager.showLeaderboard();
        }
      });
    gameOverContainer.add(submitButton);
  }
}
