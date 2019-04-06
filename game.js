import Board from './board.js'
import Timer from './timer.js'
import SoundPlayer from './utils.js'
import PopUp from './popUp.js'
import Statistics from './statistics.js'

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
        this.detailsContainerElement = null;
        this.gameContainerElement = null;
        this.playerLearningModeCheckboxElement = null;
        this.timer = null;
        this.soundDiskDown = new SoundPlayer("./sounds/diskdown.mp3");
        this.soundBadMove = new SoundPlayer("./sounds/badmove.mp3");
        this.winnerPlayer = null;
        this.timer = null;
        this.statistics = null;
        Game.counter++;

        this.render();
        this.board = new Board(this.id, this.gameElement, this.size, this.playerClicked.bind(this));
        this.renderInitializeCircles();

        this.timer = new Timer(this.id);
        this.statistics = new Statistics(this.detailsContainerElement);

        // First player starts the game
        this.getCurrentPlayer().turnStarted(this.timer.seconds);
        // Player helper - shows the potential gain on every square
        this.calculatePotentialGainForPlayer(this.getCurrentPlayer());
        // Update player items
        this.updatePlayerItems();
    }

    render = () => {
        let gameElement = document.createElement('div');
        gameElement['data-id'] = this.id;
        gameElement.className = 'game';
        gameElement.setAttribute('id', `game-${this.id}`);
        this.gameElement = gameElement;

        this.gameContainerElement = document.createElement('div');
        this.gameContainerElement.className = 'game-container';
        this.gameContainerElement.id = `game-container-${this.id}`;

        this.detailsContainerElement = document.createElement('div');
        this.detailsContainerElement.className = 'details-container';

        this.criticDetailsElement = document.createElement('div');
        this.criticDetailsElement.className = 'critic-details-container';

        this.detailsContainerElement.appendChild(this.criticDetailsElement);
        this.gameContainerElement.appendChild(this.detailsContainerElement);
        this.gameContainerElement.appendChild(gameElement);

        document.getElementsByClassName('games-container')[0].appendChild(this.gameContainerElement);
        this.renderPlayerContainer();
    };

    renderPlayerContainer = () => {
        const playerContainer = document.createElement('div');
        playerContainer.className = 'player-container';

        const playerTitle = document.createElement('h3');
        playerTitle.className = 'player-title';
        playerTitle.textContent = 'Player:';

        const playerNameElement = document.createElement('h3');
        playerNameElement.className = 'player-name';
        this.playerNameElement = playerNameElement;

        let playerLearningModeContainerElement = document.createElement('div');
        playerLearningModeContainerElement.className = 'label-container';
        let playerLearningModeElementLabel = document.createElement('h3');
        playerLearningModeElementLabel.className = 'label';
        playerLearningModeElementLabel.innerHTML = 'Learning Mode:';
        const playerLearningModeCheckboxElement = document.createElement('input');
        playerLearningModeCheckboxElement.className = 'player-checkbox';
        playerLearningModeCheckboxElement.type = 'checkbox';
        playerLearningModeCheckboxElement.onchange = this.checkboxLearningModeClicked.bind(this);
        this.playerLearningModeCheckboxElement = playerLearningModeCheckboxElement;
        playerLearningModeContainerElement.appendChild(playerLearningModeElementLabel);
        playerLearningModeContainerElement.appendChild(playerLearningModeCheckboxElement);

        let resignContainerElement = document.createElement('div');
        const resignButtonElement = document.createElement('button');
        resignButtonElement.className = 'player-resign-button';
        resignButtonElement.textContent = 'Resign';
        resignButtonElement.onclick = this.resignButtonClicked.bind(this);
        resignContainerElement.appendChild(resignButtonElement);

        playerContainer.appendChild(playerTitle);
        playerContainer.appendChild(playerNameElement);
        this.criticDetailsElement.appendChild(playerContainer);
        this.criticDetailsElement.appendChild(playerLearningModeContainerElement);
        this.criticDetailsElement.appendChild(resignContainerElement);
    };

    renderInitializeCircles = () => {
        const halfSize = Math.ceil(this.size / 2) - 1;

        for (const row of Array(2).keys()) {
            for (const col of Array(2).keys()) {
                const playerColor = this.players[(col + row) % 2].color;
                this.board.squares[halfSize + row][halfSize + col].changeColorTo(playerColor);
                this.board.coloredSquares.push(this.board.squares[halfSize + row][halfSize + col]);
            }
        }
    };

    checkboxLearningModeClicked = () => {
        let currentPlayer = this.getCurrentPlayer();
        currentPlayer.isInLearningMode = this.playerLearningModeCheckboxElement.checked; // update new status
        this.checkboxLearningModeUpdate();
    };
    
    checkboxLearningModeUpdate = () => {
        let currentPlayer = this.getCurrentPlayer();
        
        // Update checkbox status
        this.playerLearningModeCheckboxElement.checked = currentPlayer.isInLearningMode;
        
        // Update board
        if (currentPlayer.isInLearningMode) {
            this.board.showPotentialGainElements(false);
        } else {
            this.board.hidePotentialGainElements(false);
        }
    };

    resignButtonClicked = () => {
        // currentPlayer resigned
        let currentPlayer = this.getCurrentPlayer();
        let rivalPlayer = this.getRivalPlayer();

        // Game ended
        this.ended = true;
        this.board.hidePotentialGainElements(true);
        this.winnerPlayer = rivalPlayer;
        this.timer.pause();

        let endMessage = `${currentPlayer.name} (${currentPlayer.color}) resigned.<br>The winner is ${this.winnerPlayer.name} (${this.winnerPlayer.color})!`;
        new PopUp(
            this.gameElement,
            `<p>${endMessage}</p> `,
            'test',
            this.reset,
            this.players
        );

    };

    reset = (popup) => {
        this.board.destroy();
        this.board = new Board(this.id, this.gameElement, this.size, this.playerClicked.bind(this));
        this.renderInitializeCircles();
        this.winnerPlayer = null;
        this.timer.reset();
        this.ended = false;
        this.playerTurnCounter = 0;

        // Reset players
        this.players.forEach(player => {
            player.reset();
        });

        this.calculatePotentialGainForPlayer(this.getCurrentPlayer());
        this.updatePlayerItems();
        popup.destroy();
    };


    isGameEnded = () => {
        let currentPlayer = this.getCurrentPlayer();
        let rivalPlayer = this.getRivalPlayer();

        // No more empty squares left
        if (this.board.howManyEmptySquares() === 0) {
            return true;
        }

        // All squares are occupied by the same color
        if ((this.board.calculateSquaresWithColor(currentPlayer.color) === this.board.coloredSquares.length) ||
            (this.board.calculateSquaresWithColor(rivalPlayer.color) === this.board.coloredSquares.length)) {
            return true;
        }

        // Check that there is at least 1 box with a valid move for at least one player
        // No legal moves left, game ended
        return currentPlayer.potentialSquareMoves.length === 0;
    };

    setWinnerPlayerWithMoreDisks = () => {
        let currentPlayer = this.getCurrentPlayer();
        let rivalPlayer = this.getRivalPlayer();
        let currentPlayerTurnedDisk = currentPlayer.currentScore;
        let rivalPlayerTurnedDisk = rivalPlayer.currentScore;

        if (currentPlayerTurnedDisk > rivalPlayerTurnedDisk)
            this.winnerPlayer = currentPlayer;
        else if (rivalPlayerTurnedDisk > currentPlayerTurnedDisk)
            this.winnerPlayer = rivalPlayer;
        else // Tie
            this.winnerPlayer = null;
    };

    // Returns how many disks are going to be changed
    placeMoveAtSquare = (player, square) => {
        let arrayRealDisksToColor = []; // Keep track of the squares we want to change later
        let arrayMaybeDisksToColor = [];
        let origPosX = square.x;
        let origPosY = square.y;
        let origColor = player.color;

        // If current square is occupied already - can't place a disk on it
        if (!square.isEmpty()) {
            return 0;
        }

        // We will search for opposite colored disks next to the given square.
        //  if any exists, we will check that at the end we have our own color.
        for (let rowDirection = -1; rowDirection <= 1; rowDirection++) {
            for (let colDirection = -1; colDirection <= 1; colDirection++) {
                // Prepare positions to check
                let checkPosX = origPosX + colDirection;
                let checkPosY = origPosY + rowDirection;
                let findAnyOpponentSquares = false;

                // Ignore current square's location
                if (checkPosX === origPosX && origPosY === checkPosY) {
                    continue;
                }

                let opponentSquareObj = this.findOpponentSquaresInDirection(checkPosX, checkPosY,
                    origColor, colDirection, rowDirection);

                findAnyOpponentSquares = opponentSquareObj.findAnyOpponentSquares;
                arrayMaybeDisksToColor = opponentSquareObj.arrayMaybeDisksToColor;
                checkPosX = opponentSquareObj.checkPosX;
                checkPosY = opponentSquareObj.checkPosY;

                // Now we got to a potential our color
                if (findAnyOpponentSquares) {
                    arrayRealDisksToColor = [...arrayRealDisksToColor, ...this.checkDirectionEndWithCurrentColor(checkPosX, checkPosY, origColor, arrayMaybeDisksToColor)]
                }

                // Clear temporary disks (GC will do the job)
                arrayMaybeDisksToColor = [];
            }
        }

        player.potentialSquareMoves[`${square.x},${square.y}`] = arrayRealDisksToColor;
        return arrayRealDisksToColor.length;
    };

    checkDirectionEndWithCurrentColor = (checkPosX, checkPosY, currentColor, arrayMaybeDisksToColor) => {
        // Check if in the place where we got - is our color
        let arrayRealDisksToColor = [];
        if (this.board.isValidSquareLocation(checkPosX, checkPosY) &&
            !this.board.squares[checkPosX][checkPosY].isEmpty() &&
            this.board.squares[checkPosX][checkPosY].color === currentColor) {
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

    currentPlayerClickOnPotentialMove = (potentialSquareMoves) => {
        let currentPlayerColor = this.getCurrentPlayer().color;

        potentialSquareMoves.forEach(square => {
            square.changeColorTo(currentPlayerColor);
        });
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
        return [...new Set(Object.values(emptySquaresAround))];
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
    calculatePotentialGainForPlayer = (player) => {
        let squareAppends = {};
        this.board.coloredSquares.forEach(coloredSquare => {
            this.getEmptySquaresAround(coloredSquare).forEach(emptySquare => {
                if (!squareAppends[`${emptySquare.x},${emptySquare.y}`]) {
                    let potentialGain = this.placeMoveAtSquare(player, emptySquare);

                    // Update emptySquare
                    emptySquare.appendPotentialGainNumber(potentialGain, !player.isInLearningMode);
                    squareAppends[`${emptySquare.x},${emptySquare.y}`] = true;
                }
            });
        });
    };

    playerClicked = (squareClickedHandler, squarePressed) => {
        let currentPlayer = this.getCurrentPlayer();
        let nextPlayer = null;
        let endMessage = "";

        // Is it legal move?
        if (this.isAllowedToPlaceDisk(squarePressed) && !this.ended) {
            // Yes it is, let's play it.
            this.board.coloredSquares.push(squarePressed);
            this.soundDiskDown.play();
            let potentialSquares = currentPlayer.potentialSquareMoves[`${squarePressed.x},${squarePressed.y}`];
            this.currentPlayerClickOnPotentialMove(potentialSquares);
            squareClickedHandler(currentPlayer.color);

            // Previous player finished their turn (set score and time for turn)
            currentPlayer.turnFinished(this.board.calculateSquaresWithColor(currentPlayer.color), this.timer.seconds);

            // Next player starts their turn
            this.playerTurnCounter++;
            nextPlayer = this.getCurrentPlayer();
            nextPlayer.currentScore = this.board.calculateSquaresWithColor(nextPlayer.color);

            // Clear board 
            this.board.hidePotentialGainElements(true);

            nextPlayer.turnStarted(this.timer.seconds);
            this.updatePlayerItems();

            // Player helper - shows the potential gain on every square
            this.calculatePotentialGainForPlayer(nextPlayer);
        } else {
            // No, it's not a legal move, don't change turns
            this.soundBadMove.play();
        }


        // Check again if the game ended after the last turn
        if (this.isGameEnded()) {
            // Game ended
            this.ended = true;
            this.board.hidePotentialGainElements(true);
            this.setWinnerPlayerWithMoreDisks();
            this.timer.pause();

            // Get end message
            if (this.winnerPlayer != null) {
                endMessage = `The winner is ${this.winnerPlayer.name} (${this.winnerPlayer.color})!`;
            } else {
                endMessage = `It's a tie!`;
            }
            new PopUp(
                this.gameElement,
                `<p>${endMessage}</p> `,
                'test',
                this.reset,
                this.players
            );
        }
    };

    updatePlayerItems = () => {
        // Player name
        this.playerNameElement.textContent = `${this.getCurrentPlayer().name} (${this.getCurrentPlayer().color})`;

        // Stats
        if (this.statistics) {
            this.statistics.updateValueByKey('playTurnCounter', this.playerTurnCounter);
            this.statistics.updateValueByKey('playerTurnedDiskCounter', this.getCurrentPlayer().currentScore);
            this.statistics.updateValueByKey('avgPlayerTurnTime', this.getCurrentPlayer().getStatisticsAvgTimeForMove().toFixed(2));
            this.statistics.updateValueByKey('playerCounter2DisksLeft', this.getCurrentPlayer().getStatistics2Disks());
        }

        // Update learning mode
        this.checkboxLearningModeUpdate();
    };

    getCurrentPlayer = () => {
        return this.players[this.playerTurnCounter % 2];
    };

    getRivalPlayer = () => {
        return this.players[(this.playerTurnCounter + 1) % 2];
    };
}

Game.counter = 0;
