import Phaser from 'phaser';

export default class UIManager {
  private scene: Phaser.Scene;
  private moneyText!: Phaser.GameObjects.Text;
  private livesText!: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.createUI();
  }

  private createUI() {
    const style = { font: '20px Arial', color: '#ffffff', stroke: '#000000', strokeThickness: 2 };

    // Money Label (Top Left)
    this.moneyText = this.scene.add.text(10, 10, 'Money: 0', style);
    
    // Lives Label (Top Right)
    this.livesText = this.scene.add.text(790, 10, 'Lives: 0', style).setOrigin(1, 0);
  }

  public updateMoney(amount: number) {
    this.moneyText.setText(`Money: $${amount}`);
  }

  public updateLives(amount: number) {
    this.livesText.setText(`Lives: ${amount}`);
  }
}
