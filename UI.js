import { Flappy } from "./Flappy.js";

export class UI {
    constructor(game) {
        this.game = game;
        this.messageStartGame = document.querySelector('#message')
        this.messageGameOver = document.querySelector('#gameover')
        this.number_0 = document.querySelector('#number_0')
        this.number_1 = document.querySelector('#number_1')
        this.number_2 = document.querySelector('#number_2')
        this.number_3 = document.querySelector('#number_3')
        this.number_4 = document.querySelector('#number_4')
        this.number_5 = document.querySelector('#number_5')
        this.number_6 = document.querySelector('#number_6')
        this.number_7 = document.querySelector('#number_7')
        this.number_8 = document.querySelector('#number_8')
        this.number_9 = document.querySelector('#number_9')
        this.number_width = 32

        this.messageWidth = 184
        this.messageHeight = 267
    }
    
    draw(context) {
        if (this.game.gameStart) {
           [...`${this.game.score}`].forEach((number, i) => {
                context.drawImage(this[`number_${number}`], (this.game.width - this.number_width + (this.number_width * i + 1)) * 0.5, 30)
            })
        }

        if (!this.game.gameStart) {
            context.drawImage(this.messageStartGame, (this.game.width - this.messageWidth) * 0.5,
                (this.game.height - this.messageHeight) * 0.5, this.messageWidth, this.messageHeight)
        } else if (this.game.gameOver) {
            context.drawImage(this.messageGameOver, (this.game.width - this.messageWidth) * 0.5,
                (this.game.height - this.messageHeight) * 0.5)
        }
    }
}