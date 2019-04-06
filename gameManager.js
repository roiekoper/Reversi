import Game from './game.js'
import Player from './player.js'

export default class GameManager {
  constructor () {

  }

// We will add a list selector to 'pre-game-container' and evetually will remove it
   preGameSettings = () => {
    let labelChooseBoardSizeElement = document.createElement('h2');
    labelChooseBoardSizeElement.className = 'pre-game';
    labelChooseBoardSizeElement.id = 'pre-game-h2';
    labelChooseBoardSizeElement.innerHTML = "Choose board size: ";

    let selectBoardSizeElement = document.createElement("select");
    selectBoardSizeElement.className = 'pre-game';
    selectBoardSizeElement.id = 'pre-game-board-size-select';

    for (let i = 6 ; i <= 15 ; i++) {
      selectBoardSizeElement.options.add( new Option(`${i}x${i}`,`${i}`, true, true) );
    }

    selectBoardSizeElement.value = '10';

    let newGameButtonElement = document.createElement('button');
    newGameButtonElement.className = 'pre-game';
    newGameButtonElement.id = 'pre-game-button';
    newGameButtonElement.textContent = 'Start Game';
    newGameButtonElement.onclick = () => {
      startGame();
    };

    let boardSizeDivElement = document.getElementsByClassName('pre-game-container')[0];
    boardSizeDivElement.appendChild(labelChooseBoardSizeElement);
    boardSizeDivElement.appendChild(selectBoardSizeElement);
    boardSizeDivElement.appendChild(newGameButtonElement);
  };

  startGame = () => {
    let preGameContainer = document.getElementsByClassName('pre-game-container')[0];
    let selectBoardSize = document.getElementById('pre-game-board-size-select');
    let boardSize = Number(selectBoardSize.value);
    preGameContainer.remove();

    const player1 = new Player(Game.counter, 'player 1', 'black', true, true);
    const player2 = new Player(Game.counter, 'player 2', 'white', true, true);
    const game = new Game([player1, player2], boardSize);
  }

  preGameSettings();
}