import { Background } from './background.js';
import { Base } from './base.js';
import { Flappy } from './Flappy.js'
import { InputHandler } from './input.js';
import { Pipe } from './pipe.js';
import { UI } from './UI.js';
import { handlerType } from './matchMedia.js'
class Game {
    constructor(width, height) {
        this.audio_hit = new Audio('assets/audio/audio_hit.ogg');
        this.audio_die = new Audio('assets/audio/audio_die.ogg');
        this.audio_point = new Audio('assets/audio/audio_point.ogg');

        this.width = width;
        this.height = height;
        this.speed = 1;
        this.outputMargin = 112;
        this.speedModification = 2;
        this.createPipeTime = 1700;
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

        new InputHandler(() => {
            if (!this.gameOver) {
                this.player.flyUp()
                this.audio_wing = new Audio('assets/audio/audio_wing.ogg');
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
        } else if (this.pipeTimer > this.createPipeTime) {
            this.pipeTimer = 0;
            this.pipes.add(new Pipe(this));
        } else {
            this.pipeTimer += deltaTime
        }

        if(this.gameOver && this.speed > 0) {
            this.speed = 0;
            this.audio_hit.play();
            this.audio_die.play();

            document.querySelector('#board').classList.remove('hide')

            fetch('/api/flappy/getHeightScores', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: {
                    data: location.search
                }
            })
            .then(res => res.json())
            .then(res => {
                console.log(res)
            })

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

    canvas.width = Math.min(window.innerWidth, 570) ;
    canvas.height = Math.min(window.innerHeight, 713);

    const game = new Game(canvas.width, canvas.height)
    let lastTime = 0;

    document.querySelector('#restart').addEventListener('click', () => {
        game.restart()
    })

    ;(function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        game.update(deltaTime);
        game.draw(ctx);
        requestAnimationFrame(animate)
    })(0);
})