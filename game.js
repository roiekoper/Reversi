import Board from './board.js'
import Timer from './timer.js'

export default class Game {
    constructor(players, size = 10) {
        this.id = Game.counter; // static var
        this.players = players;
        this.playerTurnCounter = 0;
        this.ended = false;
        this.size = size;
        this.board = null;
        this.gameElement = null;
        this.playerNameElement = null;
        this.timer = null;
        Game.counter++;

        this.render();
        this.timer = new Timer(this.id);

        // First player starts the game
        this.getCurrentPlayer().turnStarted(this.timer.seconds);
    }

    isGameEnded = () => {
        return this.board.howManyEmptySquares() == 0;
    };

    calculateScoreForPlayer = (player) => {
        return this.board.calculateSquaresWithColor(player.color);
    };

    playerClicked = (squareClickedHandler) => {
        let currentPlayer = this.getCurrentPlayer();
        let nextPlayer = null;

        // Previous player finished their turn
        currentPlayer.turnFinished(this.calculateScoreForPlayer(currentPlayer), this.timer.seconds); //todo set real time diff

        // Before moving to the next player, check if game ended
        if (!this.isGameEnded()) {
            // Next player starts their turn
            this.playerTurnCounter++;
            nextPlayer = this.getCurrentPlayer();
            nextPlayer.turnStarted(this.timer.seconds);
            this.updatePlayerName();
            squareClickedHandler(nextPlayer.color);
        } else {
            // Game ended
        }
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

        this.board = new Board(this.id, this.gameElement, this.size, this.playerClicked.bind(this));
        this.renderInitializeCircles()
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

    renderInitializeCircles = () => {
        const halfSize = this.size / 2 - 1;

        for (const row of Array(2).keys()) {
            for (const col of Array(2).keys()) {
                const playerColor = this.players[(col + row) % 2].color;
                this.board.squares
                    [halfSize + row]
                    [halfSize + col].setCircleColor(playerColor);
            }
        }
    };

    updatePlayerName = () => {
        this.playerNameElement.textContent = this.getCurrentPlayer().name;
    };

    getCurrentPlayer = () => {
        return this.players[this.playerTurnCounter % 2];
    };
}

Game.counter = 0;