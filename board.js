import Square from './square.js'

export default class Board {
  constructor (id, gameElement, size = 10, squareClickedHandler) {
    this.id = id;
    this.gameElement = gameElement;
    this.size = size;
    this.squareClickedHandler = squareClickedHandler;
    this.render()
  }

  render () {
    const boardElement = document.createElement('div');
    boardElement['data-id'] = this.id;
    boardElement.className = 'board';
    boardElement.style = `grid-template-columns: repeat(${this.size}, 60px);`;

    Array.from({length: this.size}, (_, row) => {
      Array.from({length: this.size}, (_, col) => {
        const square = new Square(row, col, this.squareClickedHandler);
        boardElement.appendChild(square.render())
      })
    });

    this.gameElement.appendChild(boardElement);
  }
}