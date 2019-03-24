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

    // Returns how many disks are going to be changed
    placeMoveAtSqaure = (player, square, isActualMove) => {
        let currentPlayer = player;
        let howManyDisksWillChange = 0;
        let arrayRealDisksToColor = []; // Keep track of the squares we want to change later
        let arrayMaybeDisksToColor = [];
        let origPosX = square.x;
        let origPosY = square.y;
        let origColor = currentPlayer.color;
        let colorOpponent = origColor == "black" ? "white" : "black";

        // If current square is occuiped already - can't place a disk on it
        if (square.color != null) {
            return 0;
        }

        // We will search for opposite colored disks next to the given square.
        //  if any exists, we will check that at the end we have our own color.
        for (let rowDirection = -1; rowDirection <= 1; rowDirection++) {
            for(let colDirection = -1; colDirection <= 1; colDirection++) {
                // Prepare positions to check
                let checkPosX = origPosX + colDirection;
                let checkPosY = origPosY + rowDirection;
                let flagDidFindOpponentColorAlongPath = false;

                // Ignore current square's location
                if (checkPosX == origPosX && origPosY == checkPosY)
                    continue;

                // We will check each position, and search for the oponent color
                while(this.board.isLocationValidAndInColor(checkPosX, checkPosY, colorOpponent)) {
                            flagDidFindOpponentColorAlongPath = true;
                            // Keep this square for later
                            arrayMaybeDisksToColor.push(this.board.getSquareAtIndex(checkPosX, checkPosY))
                            // Keep moving in the same direction
                            checkPosX += colDirection;
                            checkPosY += rowDirection;
                            
                            
                        }
                // Now we got to a potentialy our color
                if (flagDidFindOpponentColorAlongPath) {
                    // Check if in the place where we got is our color
                    if (this.board.isLocationValidAndInColor(checkPosX, checkPosY, origColor)) {
                        // Yes! we have a real path
                        arrayRealDisksToColor.push(...arrayMaybeDisksToColor);
                    }
                }
                // Clear temporary disks (GC will do the job)
                arrayMaybeDisksToColor = [];
            }
        }
        howManyDisksWillChange = arrayRealDisksToColor.length;
        
        // If it's an actual move, change the color
        if(isActualMove) {
            arrayRealDisksToColor.forEach(square => {
                square.changeColorTo(origColor);
            });
        }

        return howManyDisksWillChange;
    };

    isAllowedToPlaceDisk = (square) => {
        let currentPlayer = this.getCurrentPlayer();
        return this.board.isSquareEmpty(square) && this.placeMoveAtSqaure(currentPlayer, square, false) > 0;
    };

    // Will iterate all squares and try to calculate gain for every potential move
    showPotentialGainForPlayer = (player) => {
        let currentPlayer = this.getCurrentPlayer();
        let potentialGain = 0;
        this.board.squares.forEach(row => {
            row.forEach(square => {
                potentialGain = this.placeMoveAtSqaure(currentPlayer, square, false);
                // Update square
                square.setPotentialGain(potentialGain);
        })});

    };

    playerClicked = (squareClickedHandler, squarePressed) => {
        let currentPlayer = this.getCurrentPlayer();
        let nextPlayer = null;

        // Is it legal move?
        if (this.isAllowedToPlaceDisk(squarePressed)) {
            // Yes it is, let's play it.
            this.soundDiskDown.play();
            this.placeMoveAtSqaure(currentPlayer, squarePressed, true);    // Apply move on board (must be first because square is still nulled)
            squareClickedHandler(currentPlayer.color);                      // Set current pressed square color
            
            
            // Previous player finished their turn
            currentPlayer.turnFinished(this.calculateScoreForPlayer(currentPlayer), this.timer.seconds);

            // Before moving to the next player, check if game ended
            if (!this.isGameEnded()) {
                // Next player starts their turn
                this.playerTurnCounter++;
                nextPlayer = this.getCurrentPlayer();
                nextPlayer.turnStarted(this.timer.seconds);
                this.updatePlayerName();

                // Player helper - shows the potential gain on every square
                if (this.shouldPresentPotentialGain) {
                    this.showPotentialGainForPlayer(nextPlayer);
                }
                
            } else {
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
            }
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