export class Network {
    constructor(game) {
        this.game = game;
        this.hash = location.search.slice(4);
        this.firstLoadPageScore();
    }

    firstLoadPageScore () {
        fetch('/api/flappy/getHeightScores', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                data: this.hash
            })
        })
        .then(res => res.json())
        .then(players => {
            this.game.best_score = players.find(player => player.me).score || 0;
        })
    }

    setScore () {
        fetch('/api/flappy/setScore', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                data: this.hash,
                score: this.game.score
            })
        })
        .then(() => this.getScores());
    }

    getScores() {
        const loadingElement = document.querySelector("#score_loading")
        loadingElement.textContent = 'Loading...'

        const element = document.querySelector('#score');

        while(element.firstChild) {
            element.removeChild(element.firstChild);
        }

        fetch('/api/flappy/getHeightScores', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                data: this.hash
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
                    wrap.classList.add('you');
                    this.game.best_score = player.score;
                }
                name.classList.add('name');
                name.textContent = player.name
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

            element.append(fragment);
        }).catch(() => {
            loadingElement.textContent = 'Error!'
        })
    }
}