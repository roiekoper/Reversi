export default class Player {
    constructor(gameId, name, color, isHuman) {
        this.gameId = gameId;       // What game does the player currenly play
        this.name = name;           // Player's name
        this.color = color;         // White / Black
        this.isHuman = isHuman;     // For AI
        this.currentScore = 0;      // Every pocket on the board equals 1 point
        this.turnCounter = 0;       // How many turns did the player play
        this.arrayTurnsTime = [];   // Counts the time for each move
        this.arrayTurnsScore = [];  // Keeps track on the score every turn
        this.isMyTrun = false;
        this.startedTurnAt = 0;
    }

    turnStarted = (timeSeconds) => {
        this.isMyTrun = true;
        this.startedTurnAt = timeSeconds;
    };

    turnFinished = (score, timeSeconds) => {
        this.isMyTrun = false;
        this.currentScore = score;
        this.arrayTurnsTime.push(timeSeconds - this.startedTurnAt);
        this.arrayTurnsScore.push(score);
    };

    colorOpponent = () => {
        return this.color === "black" ? "white" : "black";
    }
}