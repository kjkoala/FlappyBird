export class Background {
    constructor(game) {
        this.game = game;
        this.width = 288;
        this.height = 512;
        this.x = 0;
        this.y = 0;
        this.image = document.querySelector('#background-day');

    }
    update() {
        this.x -= this.game.speed;
        if (this.x <= -this.width) this.x = 0;
    }

    draw(context) {
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
        context.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
        context.drawImage(this.image, this.x + this.width * 2, this.y, this.width, this.height);
    }
}