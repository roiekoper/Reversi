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
        this.counter2DisksLeft = 0;
        this.potentialSquareMoves = {};
        this.trunedDisksSquares = [];
    }

    turnStarted = (timeSeconds) => {
        this.turnCounter++;
        this.isMyTrun = true;
        this.startedTurnAt = timeSeconds;
    };

    turnFinished = (score, timeSeconds) => {
        this.isMyTrun = false;
        this.currentScore = score;
        if (score == 2) {
            this.counter2DisksLeft++;
        }
        this.arrayTurnsTime.push(timeSeconds - this.startedTurnAt);
        this.arrayTurnsScore.push(score);
    };

    getStatisticsAvgTimeForMove = () =>{
        let sum = 0;
        this.arrayTurnsTime.forEach(t => {
            sum += t;
        });
        return sum / (this.arrayTurnsTime.length || 1);
    };

    getStatistics2Disks = () =>{
        return this.counter2DisksLeft;
    };

    colorOpponent = () => {
        return this.color === "black" ? "white" : "black";
    }
}
