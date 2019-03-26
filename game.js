import Board from './board.js'
import Timer from './timer.js'
import SoundPlayer from './utils.js'

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
        this.soundDiskDown = new SoundPlayer("./sounds/diskdown.mp3");
        this.soundBadMove = new SoundPlayer("./sounds/badmove.mp3");
        this.shouldPresentPotentialGain = true; // TODO: toggle with checkbox
        // TODO: TIMER
        // this.timer = new Timer(this.id);
        Game.counter++;

        this.render();
        this.board = new Board(this.id, this.gameElement, this.size, this.playerClicked.bind(this));
        this.renderInitializeCircles();

        // Player helper - shows the potential gain on every square
        if (this.shouldPresentPotentialGain) {
            this.showPotentialGainForPlayer(this.getCurrentPlayer());
        }

        // First player starts the game
        // TODO TIMER
        // this.getCurrentPlayer().turnStarted(this.timer.seconds);
    }

    isGameEnded = () => {
        let isGameEnded = false;

        // No more empty squares left
        if (this.board.howManyEmptySquares() == 0){
            return true;
        }

        // Check that there is at least 1 box with a valid move for at least one player
        for (let playerIndex = 0; playerIndex < this.players.length; playerIndex++) {
            for (let rowIndex = 0; rowIndex < this.board.squares.length; rowIndex++) {
                for (let colIndex = 0; colIndex < this.board.squares[rowIndex].length; colIndex++) {
                    if (this.placeMoveAtSqaure(this.players[playerIndex], this.board.squares[rowIndex][colIndex], false) > 0) {
                        // Player has at least this move, game hasn't ended yet
                        return false;
                    }
                }
            }
        }
        // No legal moves left, game ended
        return true;
    };

    calculateScoreForPlayer = (player) => {
        return this.board.calculateSquaresWithColor(player.color);
    };

    // Returns how many disks are going to be changed
    placeMoveAtSquare = (player, square, isActualMove) => {
        let arrayRealDisksToColor = []; // Keep track of the squares we want to change later
        let arrayMaybeDisksToColor = [];
        let origPosX = square.x;
        let origPosY = square.y;
        let origColor = player.color;
        let colorOpponent = player.colorOpponent();

        // If current square is occupied already - can't place a disk on it
        if (!square.isEmpty()) {
            return 0;
        }

        console.log('---');
        console.log('origPosX',origPosX);
        console.log('origPosY',origPosY);

        // We will search for opposite colored disks next to the given square.
        //  if any exists, we will check that at the end we have our own color.
        for (let rowDirection = -1; rowDirection <= 1; rowDirection++) {
            for (let colDirection = -1; colDirection <= 1; colDirection++) {
                // Prepare positions to check
                let checkPosX = origPosX + colDirection;
                let checkPosY = origPosY + rowDirection;
                let findAnyOpponentSquares = false;

                // Ignore current square's location
                // if (checkPosX === origPosX && origPosY === checkPosY)
                //     continue;

                let opponentSquareObj = this.findOpponentSquaresInDirection(checkPosX, checkPosY,
                    origColor, colDirection, rowDirection);

                findAnyOpponentSquares = opponentSquareObj.findAnyOpponentSquares;
                arrayMaybeDisksToColor = opponentSquareObj.arrayMaybeDisksToColor;
                checkPosX = opponentSquareObj.checkPosX;
                checkPosY = opponentSquareObj.checkPosY;

                // Now we got to a potential our color
                if (findAnyOpponentSquares) {
                    console.log(this.checkDirectionEndWithCorrectColor(checkPosX, checkPosY,
                        colorOpponent, arrayMaybeDisksToColor));
                    arrayRealDisksToColor = [...this.checkDirectionEndWithCorrectColor(checkPosX, checkPosY,
                        colorOpponent, arrayMaybeDisksToColor)]
                }

                // Clear temporary disks (GC will do the job)
                arrayMaybeDisksToColor = [];
            }
        }
        console.log('---');

        // If it's an actual move, change the color
        if (isActualMove) {
            arrayRealDisksToColor.forEach(square => {
                square.changeColorTo(origColor);
            });
        }

        return arrayRealDisksToColor.length;
    };

    checkDirectionEndWithCorrectColor = (checkPosX, checkPosY, colorOpponent, arrayMaybeDisksToColor) => {
        // Check if in the place where we got is our color
        let arrayRealDisksToColor = [];
        if (this.board.isValidSquareLocation(checkPosX, checkPosY) &&
            !this.board.squares[checkPosX][checkPosY].isEmpty() &&
            this.board.squares[checkPosX][checkPosY].isOpponentColor(colorOpponent)) {
            // Yes! we have a real path
            arrayRealDisksToColor = [...arrayMaybeDisksToColor];
        }
        return arrayRealDisksToColor;
    };

    findOpponentSquaresInDirection = (checkPosX, checkPosY, origColor, colDirection, rowDirection) => {
// We will check each position, and search for the opponent color
        let findAnyOpponentSquares = false;
        let arrayMaybeDisksToColor = [];
        while (this.board.isValidSquareLocation(checkPosX, checkPosY) &&
        !this.board.squares[checkPosX][checkPosY].isEmpty() &&
        this.board.squares[checkPosX][checkPosY].isOpponentColor(origColor)) {
            findAnyOpponentSquares = true;
            // Keep this square for later
            arrayMaybeDisksToColor.push(this.board.squares[checkPosX][checkPosY]);
            // Keep moving in the same direction
            checkPosX += colDirection;
            checkPosY += rowDirection;
        }

        return {findAnyOpponentSquares, arrayMaybeDisksToColor, checkPosX, checkPosY};
    };

    isAllowedToPlaceDisk = (square) => {
        return square.isEmpty() &&
            this.currentPlayerClickedNearDisks(square);
    };

    getEmptySquaresAround = ({x, y}) => {
        let isValid = false;
        let checkPosX;
        let checkPosY;
        let emptySquaresAround = {};

        for (let rowDirection = -1; !isValid && rowDirection <= 1; rowDirection++) {
            for (let colDirection = -1; !isValid && colDirection <= 1; colDirection++) {
                checkPosX = x + colDirection;
                checkPosY = y + rowDirection;

                if (this.board.isValidSquareLocation(checkPosX, checkPosY) &&
                    this.board.squares[checkPosX][checkPosY].isEmpty())
                    emptySquaresAround[`${checkPosX},${checkPosY}`] = this.board.squares[checkPosX][checkPosY]

            }
        }
        return Object.values(emptySquaresAround);
    };

    currentPlayerClickedNearDisks = ({x, y}) => {
        let isValid = false;
        let checkPosX;
        let checkPosY;

        for (let rowDirection = -1; !isValid && rowDirection <= 1; rowDirection++) {
            for (let colDirection = -1; !isValid && colDirection <= 1; colDirection++) {
                checkPosX = x + colDirection;
                checkPosY = y + rowDirection;
                isValid = this.board.isValidSquareLocation(checkPosX, checkPosY) &&
                    !this.board.squares[checkPosX][checkPosY].isEmpty();

            }
        }

        return isValid;
    };

    // Will iterate all squares and try to calculate gain for every potential move
    showPotentialGainForPlayer = (player) => {
        this.board.coloredSquares.forEach(coloredSquare => {
            this.getEmptySquaresAround(coloredSquare).forEach(emptySquare => {
                let potentialGain = this.placeMoveAtSquare(player, emptySquare, false);
                // Update emptySquare
                emptySquare.setPotentialGain(potentialGain);
            });
        });
    };

    playerClicked = (squareClickedHandler, squarePressed) => {
        let currentPlayer = this.getCurrentPlayer();
        let nextPlayer = null;

        // Is it legal move?
        if (this.isAllowedToPlaceDisk(squarePressed)) {
            // Yes it is, let's play it.
            this.soundDiskDown.play();
            this.placeMoveAtSquare(currentPlayer, squarePressed, true);    // Apply move on board (must be first because square is still nulled)
            squareClickedHandler(currentPlayer.color);                      // Set current pressed square color


            // Previous player finished their turn
            // TODO TIMER
            // currentPlayer.turnFinished(this.calculateScoreForPlayer(currentPlayer), this.timer.seconds);

            // Before moving to the next player, check if game ended
            if (!this.isGameEnded()) {
                // Next player starts their turn
                this.playerTurnCounter++;
                nextPlayer = this.getCurrentPlayer();
                // TODO TIMER
                // nextPlayer.turnStarted(this.timer.seconds);
                this.updatePlayerName();

                // Player helper - shows the potential gain on every square
                if (this.shouldPresentPotentialGain) {
                    this.showPotentialGainForPlayer(nextPlayer);
                }

            } else {
                this.board.hidePotentialGain();
                // Game ended
                // TODO: present alert saying the game eneded
                // TODO: offer to restart the game (update game counter)
            }
        } else {
            // No, it's not a legal move, don't change turns
            this.soundBadMove.play();

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
    };

    renderPlayerContainer = () => {
        const playerContainer = document.createElement('div');
        playerContainer.className = 'player-container';

        const playerTitle = document.createElement('h2');
        playerTitle.className = 'player-title';
        playerTitle.textContent = 'Player:';

        const playerNameElement = document.createElement('h2');
        playerNameElement.className = 'player-name';
        this.playerNameElement = playerNameElement;
        this.updatePlayerName();

        playerContainer.appendChild(playerTitle);
        playerContainer.appendChild(playerNameElement);
        this.gameElement.appendChild(playerContainer)
    };

    renderInitializeCircles = () => {
        const halfSize = this.size / 2 - 1;

        for (const row of Array(2).keys()) {
            for (const col of Array(2).keys()) {
                const playerColor = this.players[(col + row) % 2].color;
                this.board.squares[halfSize + row][halfSize + col].changeColorTo(playerColor);
                this.board.coloredSquares = [...this.board.coloredSquares, this.board.squares[halfSize + row][halfSize + col]]
            }
        }
    };

    // Will iterate all squares and try to calculate gain for every potential move
    // Return the total potential gain for player
    calculatePotentialGainForPlayer = (player, isShow=false) => {
        let currentPlayer = this.getCurrentPlayer();
        let potentialGain = 0;
        let totalPotentialGain = 0;
        this.board.squares.forEach(row => {
            row.forEach(square => {
                potentialGain = this.placeMoveAtSqaure(currentPlayer, square, false);
                totalPotentialGain += potentialGain;
                // Update square
                if (isShow) {
                    square.setPotentialGain(potentialGain);
                }
            })});
        return totalPotentialGain;
    };

    // Must be called after verifying that game hasn't ended
    moveTurnToNextPlayer = () => {
        let nextPlayer = null;
        // Next player should start their turn, but we need to check first that next player has
        //    a valid moves
        this.playerTurnCounter++;
        nextPlayer = this.getCurrentPlayer();
        if (this.calculatePotentialGainForPlayer(nextPlayer, false) == 0) {
            // Next player has no valid move! next turn goes back to current player
            this.playerTurnCounter--;
            nextPlayer = this.getCurrentPlayer();
        }

        nextPlayer.turnStarted(this.timer.seconds);
        this.updatePlayerName();

        // Player helper - shows the potential gain on every square
        if (this.shouldPresentPotentialGain) {
            this.calculatePotentialGainForPlayer(nextPlayer, true);
        }
    };

    updatePlayerName = () => {
        this.playerNameElement.textContent = `${this.getCurrentPlayer().name} (${this.getCurrentPlayer().color})`;
    };

    getCurrentPlayer = () => {
        return this.players[this.playerTurnCounter % 2];
    };
}

Game.counter = 0;