export class Flappy {
    constructor(game) {
        this.game = game;
        this.width = 34;
        this.height = 24;
        this.x = 20;
        this.y = game.height * 0.5;
        this.vy = 0;
        this.weight = 1;
        this.speed = 0;
        this.image = document.querySelector('#bluebird');
    }

    update() {
        this.y -= this.vy;
        this.vy -= 0.5;
        if (this.y >= this.game.height - this.height) {
            this.y = this.game.height - this.height
        }
    }

    draw(context) {
        context.drawImage(this.image, 0, 0, this.width, this.height, this.x, this.y, this.width, this.height)
    }

    flyUp() {
        this.vy = 10;
    }
}