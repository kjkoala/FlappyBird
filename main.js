import { Background } from './background.js';
import { Base } from './base.js';
import { Flappy } from './Flappy.js'
import { InputHandler } from './input.js';
import { Pipe } from './pipe.js';
import { UI } from './UI.js';

const MEDALS = {
    BRONZE: 'Bronze',
    SILVER: 'Silver',
    GOLD: 'Gold',
    PLATINUM: 'Platinummedal'
};

let playerMedal = '';
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

            const localScore = window.localStorage.getItem('localScore')
            document.querySelector('#score').textContent = this.score;
            document.querySelector('#best_score').textContent = localScore ?? this.score;
            document.querySelector('#board').classList.remove('hide')



            if (localScore) {
                if (this.score > Number(localScore)) {
                    window.localStorage.setItem('localScore', this.score)
                }
            } else {
                window.localStorage.setItem('localScore', this.score)
            }

            if (localScore >= 10 && localScore < 20) {
                playerMedal = MEDALS.BRONZE
            } else if (localScore >= 20 && localScore < 30) {
                playerMedal = MEDALS.SILVER
            } else if (localScore >= 30 && localScore < 40) {
                playerMedal = MEDALS.GOLD
            } else if (localScore >= 40) {
                playerMedal = MEDALS.PLATINUM
            }

            document.querySelector('#medal').src = `assets/${playerMedal}.webp`;

            const restart = () => {
                this.restart()
                document.querySelector('#board').classList.add('hide')
                document.querySelector('#medal').classList.add('hide')
                window.removeEventListener('touchstart', restart)
            }

            setTimeout(() => {
                window.addEventListener('touchstart', restart)
            }, 500)

            if(playerMedal) {
                setTimeout(() => {
                    document.querySelector('#medal').classList.remove('hide')
                }, 600)
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
            this.audio_point.play();
        }
    }

    restart() {
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

    ;(function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        game.update(deltaTime);
        game.draw(ctx);
        requestAnimationFrame(animate)
    })(0);
})