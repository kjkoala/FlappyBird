export class Pipe {
    constructor(game) { 
        this.game = game;
        this.markedForDeletion = false;
        this.x = this.game.width;
        this.width = 52;
        this.height = 320;
        this.space = 42;
        this.minHeightPipeOnGround = 390;
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
        const footerPipe = Math.floor(Math.random() * this.height)
        if (footerPipe < this.minHeightPipeOnGround) return this.heightPipe()
        return [footerPipe + this.space, footerPipe - this.height - this.space]
    }

    draw(context) {
        const [footerPipe, headPipe] = this.spacePipes;
        context.drawImage(this.image2, this.x, headPipe, this.width, this.height)
        context.drawImage(this.image, this.x, footerPipe, this.width, this.height)
    }
}