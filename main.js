import { Background } from './background.js';
import { Base } from './base.js';
import { Flappy } from './Flappy.js'
import { InputHandler } from './input.js';
import { Pipe } from './pipe.js';
import { UI } from './UI.js';

const hash = location.search.slice(4)
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
        this.best_score = 0;
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

        fetch('/api/flappy/getHeightScores', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                data: hash
            })
        })
        .then(res => res.json())
        .then(players => {
            this.best_score = players.find(player => player.me).score || 0;
        })
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
            const loadingElement = document.querySelector("#score_loading")
            loadingElement.textContent = 'Loading...'

            if (this.score > this.best_score) {
                fetch('/api/flappy/setScore', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        data: hash,
                        score: this.score
                    })
                })
            }


            fetch('/api/flappy/getHeightScores', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    data: hash
                })
            })
            .then(res => res.json())
            .then(players => {
                const fragment = new DocumentFragment();
                players.forEach((player) => {
                    const wrap = document.createElement('li');
                    const name = document.createElement('span');
                    const score = document.createElement('span');

                    if(player.me) {
                        wrap.classList.add('me');
                        this.best_score = player.score;
                    }
                    name.classList.add('name');
                    name.textContent = `${player.first_name} ${player.last_name}`
                    score.textContent = player.score
                    wrap.append(name);
                    wrap.append(score);
                    fragment.append(wrap);
                })

                if (players.length === 0) {
                    loadingElement.textContent = 'List is empty';
                } else {
                    loadingElement.textContent = '';
                }

                const element = document.querySelector('#score');

                while(element.firstChild) {
                    element.removeChild(element.firstChild);
                }
                element.append(fragment);
            }).catch(() => {
                loadingElement.textContent = 'Error!'
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