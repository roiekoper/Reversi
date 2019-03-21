import Square from './square.js'

export default class Board {
    constructor(id, gameElement, size, squareClickedHandler) {
        this.id = id;
        this.gameElement = gameElement;
        this.size = size;
        this.squares = [];
        this.squareClickedHandler = squareClickedHandler;
        this.render();
    }

    render() {
        const boardElement = document.createElement('div');
        boardElement['data-id'] = this.id;
        boardElement.className = 'board';
        boardElement.style = `grid-template-columns: repeat(${this.size}, 60px);`;

        Array.from({length: this.size}, (_, row) => {
            this.squares[row] = [];
            Array.from({length: this.size}, (_, col) => {
                const square = new Square(row, col, this.squareClickedHandler);
                this.squares[row][col] = square;

                boardElement.appendChild(square.render())
            })
        });

        this.gameElement.appendChild(boardElement);
    };

    calculateSquaresWithColor = (color) => {
      let counterColor = 0;
      this.squares.forEach(row => {
        row.forEach(square => {
          if (square.color == color) {counterColor++};
        });
      });
      return counterColor;
    };
  
    howManyEmptySquares = () => {
      return this.calculateSquaresWithColor(null);
    };
}