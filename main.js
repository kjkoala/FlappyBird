import { Background } from './background.js';
import { Base } from './base.js';
import { Flappy } from './Flappy.js'
import { InputHandler } from './input.js';
import { Network } from './network.js';
import { Pipe } from './pipe.js';
import { UI } from './UI.js';
import { sound } from './sound.js';
class Game {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.speed = 1;
        this.outputMargin = 112;
        this.speedModification = 2;
        this.createPipeTime = 3000;
        this.pipeTimer = 0;
        this.gameOver = false;
        this.gameStart = false;
        this.score = 0;
        this.best_score = 0;
        this.scoreBlock = false;

        this.fps = 60;
        this.frameInterval = 1000 / this.fps;

        this.pipes = new Set();
        this.player = new Flappy(this);
        this.background = new Background(this);
        this.base = new Base(this);
        this.UI = new UI(this);
        this.network = new Network(this);

        new InputHandler(() => {
            if (!this.gameOver) {
                this.player.flyUp()
                sound.wing.play()
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
        } else if (this.pipeTimer > this.createPipeTime) {
            this.pipeTimer = 0;
            this.pipes.add(new Pipe(this));
        } else {
            this.pipeTimer += deltaTime
        }

        if(this.gameOver && this.speed > 0) {
            this.speed = 0;
            sound.hit.play();
            sound.die.play();

            document.querySelector('#board').classList.remove('hide')

            if (this.score > this.best_score) {
                this.network.setScore();
            } else {
                this.network.getScores();
            }
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
            sound.point.play();
        }
    }

    restart() {
        document.querySelector('#board').classList.add('hide')

        this.speed = 1;
        this.outputMargin = 112;
        this.speedModification = 2;
        this.pipeTimer = 0;
        this.gameOver = false;
        this.gameStart = false;
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

    document.querySelector('#loading_page').hidden = true
    document.querySelector('.ground').hidden = false
    canvas.hidden = false

    canvas.width = Math.min(window.innerWidth, 570) ;
    canvas.height = Math.min(window.innerHeight, 713);

    const game = new Game(canvas.width, canvas.height)
    let lastTime = performance.now();

    document.querySelector('#restart').addEventListener('click', () => {
        game.restart()
    })

    ;(function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        if (deltaTime > game.frameInterval) {
            game.update(deltaTime)
            game.draw(ctx)
            lastTime = timeStamp - (deltaTime % game.frameInterval)
        }
        requestAnimationFrame(animate);
    }(lastTime));
})