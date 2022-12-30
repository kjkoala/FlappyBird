import { Background } from './background.js';
import { Base } from './base.js';
import { Flappy } from './Flappy.js'
import { InputHandler } from './input.js';
import { Pipe } from './pipe.js';
import { UI } from './UI.js';
class Game {
    constructor(width, height) {
        this.audio_hit = document.querySelector('#audio_hit');
        this.audio_die = document.querySelector('#audio_die');
        this.audio_wing = document.querySelector('#audio_wing');
        this.audio_point = document.querySelector('#audio_point');

        this.width = width;
        this.height = height;
        this.speed = 1;
        this.outputMargin = 59;
        this.speedModification = 2;
        this.pipeTimer = 0;
        this.gameOver = false;
        this.gameStart = false;
        this.fontColor = 'white';
        this.score = 0;
        this.scoreBlock = false;

        this.pipes = new Set();
        this.player = new Flappy(this);
        this.background = new Background(this);
        this.base = new Base(this);
        this.UI = new UI(this);

        new InputHandler(() => {
            if (!this.gameOver) {
                this.player.flyUp()
                this.audio_wing.play()
            }
        });
    }

    update(deltaTime) {
        this.base.update();
        this.background.update();
        this.player.update(deltaTime);
        this.pipes.forEach(pipe => {
            pipe.update()
            if (pipe.markedForDeletion) {
                this.pipes.delete(pipe)
                this.scoreBlock = false;
            }
        });

        if (!this.gameStart) {
            this.pipeTimer = 0;
        } else if (this.pipeTimer > 1700) {
            this.pipeTimer = 0;
            this.pipes.add(new Pipe(this));
        } else {
            this.pipeTimer += deltaTime
        }

        if(this.gameOver && this.speed > 0) {
            this.audio_hit.play();
            this.audio_die.play();
            this.speed = 0;

            const restart = () => {
                this.restart()
                window.removeEventListener('mousedown', restart)
            }

            setTimeout(() => {
                window.addEventListener('mousedown', restart)
            }, 500)
        }
    }
    
    draw(context) {
        this.background.draw(context);
        this.pipes.forEach(pipe => pipe.draw(context))
        this.base.draw(context);
        this.player.draw(context);
        this.UI.draw(context);
    }

    scoreUpdate() {
        if (!this.scoreBlock) {
            this.score += 1;
            this.scoreBlock = true;
            this.audio_point.play();
        }
    }

    restart() {
        this.speed = 1;
        this.outputMargin = 59;
        this.speedModification = 2;
        this.pipeTimer = 0;
        this.gameOver = false;
        this.gameStart = false;
        this.fontColor = 'white';
        this.score = 0;
        this.scoreBlock = false;

        this.pipes = new Set();
        this.player = new Flappy(this);
        this.background = new Background(this);
        this.base = new Base(this);
        this.UI = new UI(this);
    }
}

window.addEventListener('load', () => {
    const canvas = document.querySelector('#canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 375;
    canvas.height = 500;

    const game = new Game(canvas.width, canvas.height)
    let lastTime = 0;

    ;(function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        game.update(deltaTime);
        game.draw(ctx);
        requestAnimationFrame(animate)
    })(0);
})