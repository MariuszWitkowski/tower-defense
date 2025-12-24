import Phaser from "phaser";

export default class UIManager {
  private scene: Phaser.Scene;
  private moneyText!: Phaser.GameObjects.Text;
  private livesText!: Phaser.GameObjects.Text;
  private levelText!: Phaser.GameObjects.Text;
  private waveText!: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.createUI();
  }

  private createUI() {
    const style = {
      font: "20px Arial",
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 2,
    };

    // Top Left UI
    this.moneyText = this.scene.add.text(10, 10, "Money: 0", style);
    this.levelText = this.scene.add.text(10, 40, "Level: 1", style);

    // Top Right UI
    this.livesText = this.scene.add
      .text(790, 10, "Lives: 0", style)
      .setOrigin(1, 0);
    this.waveText = this.scene.add
      .text(790, 40, "Wave: 1", style)
      .setOrigin(1, 0);
  }

  public updateMoney(amount: number) {
    this.moneyText.setText(`Money: $${amount}`);
  }

  public updateLives(amount: number) {
    this.livesText.setText(`Lives: ${amount}`);
  }

  public updateLevel(level: number) {
    this.levelText.setText(`Level: ${level}`);
  }

  public updateWave(wave: number, totalWaves: number) {
    this.waveText.setText(`Wave: ${wave} / ${totalWaves}`);
  }
}
