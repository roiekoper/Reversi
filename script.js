import Game from './game.js'
import Player from './player.js'

const player1 = new Player(Game.counter, 'player 1', 'white')
const player2 = new Player(Game.counter, 'player 2', 'black')

const game = new Game([player1, player2])