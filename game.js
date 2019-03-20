import Board from './board.js'
import Timer from './timer.js'

export default class Game {
    constructor(players) {
        this.id = Game.counter; // static var
        this.players = players;
        this.playerTurnCounter = 0;
        this.ended = false;
        Game.counter++;

        this.render();
        this.timer = new Timer(this.id);
    }

    static get SIZE() {
        return 10;
    }

    playerClicked = (squareClickedHandler) => {
        this.playerTurnCounter++;
        this.updatePlayerName();
        squareClickedHandler(this.getCurrentPlayer().color);
    };

    render = () => {
        let gameElement = document.createElement('div');
        gameElement['data-id'] = this.id;
        gameElement.className = 'game';
        gameElement.setAttribute('id', `game-${this.id}`);
        this.gameElement = gameElement;

        const gameContainer = document.createElement('div');
        gameContainer.className = 'game-container';
        gameContainer.appendChild(gameElement);

        document.getElementsByClassName('games-container')[0].appendChild(gameContainer);
        this.renderPlayerContainer();

        this.board = new Board(this.id, this.gameElement, Game.SIZE, this.playerClicked.bind(this))
    };

    renderPlayerContainer = () => {
        const playerContainer = document.createElement('div');
        playerContainer.className = 'player-container';

        const playerTitle = document.createElement('h2');
        playerTitle.className = 'player-title';
        playerTitle.textContent = 'Player:';

        const playerNameElement = document.createElement('h2');
        playerNameElement.className = 'player-name';
        playerNameElement.textContent = this.getCurrentPlayer().name;
        this.playerNameElement = playerNameElement;

        playerContainer.appendChild(playerTitle);
        playerContainer.appendChild(playerNameElement);
        this.gameElement.appendChild(playerContainer)
    };

    updatePlayerName = () => {
        this.playerNameElement.textContent = this.getCurrentPlayer().name;
    };

    getCurrentPlayer = () => {
        return this.players[this.playerTurnCounter % 2];
    }
}

Game.counter = 0;