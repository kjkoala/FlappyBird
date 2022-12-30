export class Pipe {
    constructor(game) { 
        this.game = game;
        this.markedForDeletion = false;
        this.x = this.game.width;
        this.width = 52;
        this.height = 320;
        this.space = 60;
        this.spacePipes = this.heightPipe()

        this.image = document.querySelector('#pipe-green');
        this.image2 = document.querySelector('#pipe-green-rotate');
    }

    update() {
        const { speed, speedModification } = this.game;
        this.x -= speed * speedModification;

        if (this.x + this.width < 0) this.markedForDeletion = true
    }

    heightPipe() {
        const firstPipe = Math.floor(Math.random() * 320)
        if(firstPipe < 120) return this.heightPipe()
        return [firstPipe + this.space, firstPipe - 320 - this.space]
    }

    draw(context) {
        const [footerPipe, headPipe] = this.spacePipes;
        context.drawImage(this.image2, this.x, headPipe, this.width, this.height)
        context.drawImage(this.image, this.x, footerPipe, this.width, this.height)
    }
}