import { Flappy } from './Flappy.js'
import { InputHandler } from './input.js';
class Game {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.player = new Flappy(this)
        new InputHandler(this.player.flyUp.bind(this.player))
    }

    update() {
        this.player.update()
    }

    draw(context) {
        this.player.draw(context);
    }
}

window.addEventListener('load', () => {
    const canvas = document.querySelector('#canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 300;
    canvas.height = 500;

    const game = new Game(canvas.width, canvas.height)

    ;(function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        game.update();
        game.draw(ctx);
        requestAnimationFrame(animate)
    })();
})