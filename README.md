
# Reversi
### Students
- `Sharon Brizinov`   (sharonbrizinov at gmail .com) (ID in PDF file)
- `Roie Koper`        (roiekoper at gmail .com) (ID in PDF file)

### Game Mechanics
1. **Pre game**
    - `index.js` will init the game after choosing board size.
2. **Game**
    - `render` function is responsible to render each HTML object to the DOM.
    - `placeMoveAtSquare` function will collect into `potentialSquareMoves` the squares that will be affected if current user will place the disk on the given square. 
        -  The algorithm for this function is pretty simple. Start with current square and check all occupied squares (by the rival player). For each such square continue with the direction (e.g. left, up, left-up, etc), until encountered square that belongs to current user or the board ended. If such path was found, it will be marked and kept.
    - `calculatePotentialGainForPlayer` function will calculate the potential gain on every square, every turn. When in training mode, we will use its output to reflect to the current player what is the potential gain.
3. **Board and squares**
     - `board` represent a board with size of nxn which holds `squares`.
     -  Each `square` holds an internal state which determines the current disk color (or none), and the potential gain (or none).
3. **Player**
    - `player` represent a player with its perferences and statistics.
    
### Completed Bonuses
1. New Game
2. Training Mode 
    - Implemented for every player separately
3. Board Size

### How to run the project
Since our project is constructed of multiple files (modules) and modern browsers are equipped with CORS technology, one will need to do the following:

1. Use Ofer's WebPack template as follows:
    a. Copy the WebPack template files one directory above the project `src` directory.
    b. Run `npm install` command to load all npm modules.
    c. Run `npm run build` to pack all the modules into a single file.
    d. Go to the new `public` directory and run `index.html` in the browser.