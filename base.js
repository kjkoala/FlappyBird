export class Base {
    constructor(game) {
        this.game = game;
        this.image = document.querySelector('#base');
        this.x = 0;
        this.y =  this.game.height - 112;
        this.width = 336;
        this.height = 112;
    }
    update() {
        this.x -= this.game.speed * this.game.speedModification;
        if (this.x <= -96) this.x = 0;
    }

    draw(context){
        context.drawImage(this.image, this.x, this.y, this.width, this.height)
        context.drawImage(this.image, this.x + this.width, this.y, this.width, this.height)
    }
}