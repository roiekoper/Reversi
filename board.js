import Square from './square.js'

// @NOTE: col - x, row - y
export default class Board {
    constructor(id, gameElement, size, squareClickedHandler) {
        this.id = id;
        this.gameElement = gameElement;
        this.size = size;
        this.squares = [];
        this.squareClickedHandler = squareClickedHandler;
        this.coloredSquares = [];
        this.render();

        return this;
    }

    render() {
        const boardElement = document.createElement('div');
        boardElement['data-id'] = this.id;
        boardElement.className = 'board';
        boardElement.style = `grid-template-columns: repeat(${this.size}, 60px);`;

        Array.from({length: this.size}, (_, row) => {
            this.squares[row] = [];
            Array.from({length: this.size}, (_, col) => {
                const square = new Square(col, row, this.squareClickedHandler);
                this.squares[row][col] = square;

                boardElement.appendChild(square.squareElement)
            })
        });

        this.gameElement.appendChild(boardElement);
    };

    hidePotentialGain = () => {
      this.squares.forEach(row => {
        row.forEach(square => {
            square.setPotentialGain(0);
          });
        });
      };

    calculateSquaresWithColor = (color) => {
      let counterColor = 0;
      this.squares.forEach(row => {
        row.forEach(square => {
          if (square.color === color) {
            counterColor++
          }
        });
      });
      return counterColor;
    };
  
    howManyEmptySquares = () => {
      return this.calculateSquaresWithColor(null);
    };

    isValidSquareLocation = (x ,y) => {
      let row = y;
      let col = x;
      return row >= 0 && col >= 0 && row < this.size && col < this.size;
    };

    hidePotentialGainElements = () => {
        this.squares.flat().forEach((square) => {
           square.removePotentialGainElement();
        });
    };
}
