export class Flappy {
    constructor(game) {
        this.game = game;
        this.width = 34;
        this.height = 24;
        this.x = 20;
        this.y = game.height * 0.5;
        this.vy = 0;
        this.weight = 0.5;
        this.image = document.querySelector('#bluebird');
        this.frameX = 0;
        this.maxFrame = 2;
        this.angel = 0;

        this.fps = 7;
        this.frameInterval = 1000 / this.fps;
        this.frameTimer = 0;
    }

    update(deltaTime) {
        if(this.game.gameStart) {
            this.y -= this.vy;
            this.vy -= this.weight;
            if (!this.game.gameOver) this.angel += this.weight * 5;
        }
        this.checkCollision();

        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0;
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = 0;
        } else if (this.game.gameOver) {
            this.frameX = 1;
        } else {
            this.frameTimer += deltaTime
        }
    }

    draw(context) {
        context.save()
        context.translate(this.x, this.y)
        context.rotate(this.angel * Math.PI / 360)
        context.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, 0, 0, this.width, this.height)
        context.restore()
    }

    checkCollision() {
        if (this.y >= this.game.height - this.height - this.game.outputMargin) {
            this.game.gameOver = true;
            this.y = this.game.height - this.height - this.game.outputMargin
        }
        this.game.pipes.forEach(pipe => {
            const [footerPipe, headerPipe] = pipe.spacePipes;
            
            // задел нижний пайп
            if ((pipe.x < this.x + this.width &&
                pipe.x + pipe.width > this.x &&
                footerPipe < this.y + this.height)
                ||
                // задел верхний пайп
                ( pipe.x < this.x + this.width &&
                pipe.x + pipe.width > this.x &&
                headerPipe + pipe.height > this.y)
            ) {
                this.game.gameOver = true;
            }
            if (pipe.x + pipe.width < this.x + this.width &&
                pipe.x + pipe.width > this.x) {
                this.game.scoreUpdate();
            }
        })
    }

    flyUp() {
        if (!this.game.gameStart) this.game.gameStart = true;
        if (!this.game.gameOver) {
            this.vy = 7;
            this.angel = -45;
        }
    }
}