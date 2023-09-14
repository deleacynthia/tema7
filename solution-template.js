/*
*
* "board" is a matrix that holds data about the
* game board, in a form of BoardSquare objects
*
* openedSquares holds the position of the opened squares
*
* flaggedSquares holds the position of the flagged squares
*
 */
let board = [];
let openedSquares = [];
let flaggedSquares = [];
let bombCount = 0;
let squaresLeft = 0;


/*
*
* the probability of a bomb in each square
*
 */
let bombProbability = 3;
let maxProbability = 15;


function minesweeperGameBootstrapper(rowCount, colCount) {
    let easy = {
        'rowCount': 9,
        'colCount': 9,
    };
    // TODO you can declare here the medium and expert difficulties
    let medium = {
        'rowCount': 16,
        'colCount': 16,
    };

    let expert = {
        'rowCount': 30,
        'colCount': 16,
    };
    if (rowCount == null && colCount == null) {
        // TODO have a default difficulty
        generateBoard(easy);
    } else {
        generateBoard({'rowCount': rowCount, 'colCount': colCount});
    }
}

function generateBoard(boardMetadata) {
    squaresLeft = boardMetadata.colCount * boardMetadata.rowCount;

    /*
    *
    * "generate" an empty matrix
    *
     */
    for (let i = 0; i < boardMetadata.rowCount; i++) {
        board[i] = new Array(boardMetadata.colCount);
        for (let j = 0; j < boardMetadata.colCount; j++) {
            board[i][j] = new BoardSquare(false, 0);
        }
    }    

    /*
    *
    * TODO fill the matrix with "BoardSquare" objects, that are in a pre-initialized state
    *
    */
    for (let i = 0; i < boardMetadata.rowCount; i++) {
            for (let j = 0; j < boardMetadata.colCount; j++) {
                // TODO place the bomb, you can use the following formula: Math.random() * maxProbability < bombProbability
                if (Math.random() * maxProbability < bombProbability) {
                    board[i][j].hasBomb = true;
                    bombCount++;
                }
            }
        }
    /*
    *
    * "place" bombs according to the probabilities declared at the top of the file
    * those could be read from a config file or env variable, but for the
    * simplicity of the solution, I will not do that
    *
    */
   

    /*
    *
    * TODO set the state of the board, with all the squares closed
    * and no flagged squares
    *
     */



    for (let i = 0; i < boardMetadata.rowCount; i++) {
        for (let j = 0; j < boardMetadata.colCount; j++) {
            board[i][j].bombsAround = countBombsAround(i, j, boardMetadata);
        }
    }


    //BELOW THERE ARE SHOWCASED TWO WAYS OF COUNTING THE VICINITY BOMBS

    /*
    *
    * TODO count the bombs around each square
    *
    */
    function countBombsAround(x, y, boardMetadata) {
        let count = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue;
                if (x + i >= 0 && x + i < boardMetadata.rowCount && y + j >= 0 && y + j < boardMetadata.colCount) {
                    if (board[x + i][y + j].hasBomb) count++;
                }
            }
        }
        return count;
    }

    /*
    *
    * print the board to the console to see the result
    *
    */
    console.log(board);
}

/*
*
* simple object to keep the data for each square
* of the board
*
*/
class BoardSquare {
    constructor(hasBomb, bombsAround) {
        this.hasBomb = hasBomb;
        this.bombsAround = bombsAround;
    }
}

class Pair {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}


/*
* call the function that "handles the game"
* called at the end of the file, because if called at the start,
* all the global variables will appear as undefined / out of scope
*
 */
minesweeperGameBootstrapper(5, 5);

// TODO create the other required functions such as 'discovering' a tile, and so on (also make sure to handle the win/loss cases)

function revealSquare(x, y) {
    
    if (board[x][y].hasBomb) {
        alert("you clicked on a bomb! game over");
       
    } else {
        if (!openedSquares.some(sq => sq.x === x && sq.y === y)) {
            openedSquares.push(new Pair(x, y));
            console.log(`square (${x}, ${y}) open`);

            squaresLeft--;
            if (squaresLeft == bombCount) {
                alert("congratulations! you win");
            }
        }
    }
}

function flagSquare(x, y) {
    if (!flaggedSquares.some(sq => sq.x === x && sq.y === y)) {
        flaggedSquares.push(new Pair(x, y));
    } else {
        flaggedSquares = flaggedSquares.filter(sq => sq.x !== x || sq.y !== y);
    }
}

function startGame(){
    let difficulty = document.getElementById("difficulty").value;
    let bombProb = parseInt(document.getElementById("bombProbability").value);
    let maxProb = parseInt(document.getElementById("maxProbability").value);

    
    bombProbability = bombProb;
    maxProbability = maxProb;

    switch (difficulty) {
        case "easy":
            minesweeperGameBootstrapper(9, 9);
            break;
        case "medium":
            minesweeperGameBootstrapper(16, 16);
            break;
        case "expert":
            minesweeperGameBootstrapper(30, 16);
            break;
    }
}

function revealInput() {
    let x = parseInt(document.getElementById("xCoord").value);
    let y = parseInt(document.getElementById("yCoord").value);
    revealSquare(x, y);
}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("startGameButton").addEventListener("click", startGame);
    document.getElementById("revealSquareButton").addEventListener("click", revealInput);
});