import { Flappy } from "./Flappy.js";

export class UI {
    constructor(game) {
        this.game = game;
        this.messageStartGame = document.querySelector('#message')
        this.messageGameOver = document.querySelector('#gameover')
        this.width = 184
        this.height = 267
        this.fontSize = 30;
        this.fontFamily = 'Righteous';
    }
    
    draw(context) {
        context.font = `${this.fontSize}px ${this.fontFamily}`;
        if (this.game.gameStart) {
            context.textAlign = 'center'
            context.fillStyle = 'black'
            context.fillText(this.game.score, this.game.width * 0.5, 53);
    
            context.fillStyle = this.game.fontColor;
            context.fillText(this.game.score, this.game.width * 0.5, 50);
        }

        if (!this.game.gameStart) {
            context.drawImage(this.messageStartGame, (this.game.width - this.width) * 0.5,
                (this.game.height - this.height) * 0.5, this.width, this.height)
        } else if (this.game.gameOver) {
            context.drawImage(this.messageGameOver, (this.game.width - this.width) * 0.5,
                (this.game.height - this.height) * 0.5)
        }
    }
}