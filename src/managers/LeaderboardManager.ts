import { injectable } from "tsyringe";
import Phaser from "phaser";

@injectable()
export class LeaderboardManager {
    private scene!: Phaser.Scene;

    public setScene(scene: Phaser.Scene) {
        this.scene = scene;
    }

    public saveScore(name: string, score: number) {
        const scores = this.getScores();
        scores.push({ name, score });
        scores.sort((a, b) => b.score - a.score);
        localStorage.setItem("leaderboard", JSON.stringify(scores));
    }

    public getScores(): { name: string, score: number }[] {
        const scores = localStorage.getItem("leaderboard");
        return scores ? JSON.parse(scores) : [];
    }

    public showLeaderboard() {
        const scores = this.getScores();
        const popup = new LeaderboardPopup(this.scene, scores);
        this.scene.add.existing(popup);
    }
}

export class LeaderboardPopup extends Phaser.GameObjects.Container {
    constructor(scene: Phaser.Scene, scores: { name: string, score: number }[]) {
        super(scene, 400, 300);

        const background = scene.add.rectangle(0, 0, 400, 500, 0x000000, 0.8).setOrigin(0.5);
        this.add(background);

        const title = scene.add.text(0, -220, "Leaderboard", { font: "32px Arial", color: "#ffffff" }).setOrigin(0.5);
        this.add(title);

        const closeButton = scene.add.text(180, -220, "X", { font: "24px Arial", color: "#ff0000" }).setOrigin(0.5).setInteractive();
        closeButton.on("pointerdown", () => {
            this.destroy();
        });
        this.add(closeButton);

        let y = -180;
        scores.slice(0, 10).forEach((score, index) => {
            const text = `${index + 1}. ${score.name}: ${score.score}`;
            const scoreText = scene.add.text(0, y, text, { font: "20px Arial", color: "#ffffff" }).setOrigin(0.5);
            this.add(scoreText);
            y += 30;
        });
    }
}
