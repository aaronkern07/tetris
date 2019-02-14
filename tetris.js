const cvs = document.getElementById("tetris");
const ctx = cvs.getContext("2d");

const ROW = 20;
const COL = COLUMN = 10;
const SQ = squareSize = 20;
const VACANT = "WHITE"; //color of an empty square

// draw square 
function drawSquare(x,y,color) {
    ctx.fillStyle = color;
    ctx.fillRect(x*SQ,y*SQ,SQ,SQ);

    ctx.strokeStyle = "BLACK";
    ctx.strokeRect(x*SQ,y*SQ,SQ,SQ);
}

// Make the game board

let board = [];

for (r=0; r<ROW; r++) {
    board[r] = [];
    for (c=0; c<COL; c++) {
        board[r][c] = VACANT;
    }
}

// draw the board

function drawBoard(){
    for (r=0; r<ROW; r++) {
        for (c=0; c<COL; c++) {
            drawSquare(c,r,board[r][c]);
        }
    }
}

drawBoard();

// pieces and the colors

const PIECES = [
    [Z, "red"],
    [S, "green"],
    [T, "yellow"],
    [O, "blue"],
    [L, "purple"],
    [I, "cyan"],
    [J, "orange"]
];

//generate random pieces

function randomPiece(){
    let r = randomN = Math.floor(Math.random() * PIECES.length) //length is 6 for the array
    return new Piece( PIECES[r][0],PIECES[r][1]);
}

let p = randomPiece();

// initate a piece

// let p = new Piece( PIECES[0][0] , PIECES[0][1]);  // old code


// The object piece

function Piece(tetromino,color) {
    this.tetromino = tetromino;
    this.color = color;

    this.tetrominoN = 0; // we start from the first pattern
    this.activeTetromino = this.tetromino[this.tetrominoN];

    // we need to control the pieces
    this.x = 3;
    this.y = -2;

}

// fill function

Piece.prototype.fill = function(color) {
    for (r=0; r < this.activeTetromino.length; r++) {
        for (c=0; c < this.activeTetromino.length; c++) {
            if ( this.activeTetromino[r][c]){
                drawSquare(this.x + c, this.y + r, color);
            }
        }
    }
}


// draw the piece 

Piece.prototype.draw = function() {
    this.fill(this.color);
}

// undraw the piece

Piece.prototype.unDraw = function() {
    this.fill(VACANT);
}

// move the piece down

Piece.prototype.moveDown = function(){
    if(!this.collision(0,1,this.activeTetromino)){
    this.unDraw();
    this.y++;
    this.draw();
    }else{
        // lock the piece and generate a new piece
        p = randomPiece();
    }
}

// move Right the piece

Piece.prototype.moveRight = function(){
    if(!this.collision(1,0,this.activeTetromino)){
    this.unDraw();
    this.x++;
    this.draw();
    }
}

// move left the piece

Piece.prototype.moveLeft = function(){
    if(!this.collision(-1,0,this.activeTetromino)){
    this.unDraw();
    this.x--;
    this.draw();
    }
}

// rotate the piece

Piece.prototype.rotate = function(){
    let nextPattern = this.tetromino[(this.tetrominoN + 1)%this.tetromino.length];
    let kick = 0;

    if(!this.collision(0,0,nextPattern)){
        if(this.x > COL/2){
            //This is the right wall
            kick = -1; //We need to move the piece to the left
        }else{
            //This is the left wall
            kick = 1; //We need to move the piece to the right
        }
         
    }
    

    if(!this.collision(kick,0,nextPattern)){
    this.unDraw();
    this.x += kick;
    this.tetrominoN = (this.tetrominoN + 1)%this.tetromino.length;
    this.activeTetromino = this.tetromino[this.tetrominoN];
    this.draw();
    }
}

Piece.prototype.lock = function (){
    
}

// collision function

Piece.prototype.collision = function(x,y,piece){
    for (r=0; r < this.activeTetromino.length; r++) {
        for (c=0; c < this.activeTetromino.length; c++) {
            // if the square is empty, we skip it
            if(!piece[r][c]){
                continue;
            }
            //coordinates of the piece after movement
            let newX = this.x + c + x;
            let newY = this.y + r + y;

            // conditions 
            if(newX < 0 || newX >= COL || newY >= ROW){
                return true;
            }
            // skip newY < 0; board[-1] will crush our game
            if (newY < 0){
                continue;
            }
            // check if there is a locked piece already in place
            if ( board[newY][newX] != VACANT){
                return true;
            }
        }
    }
    return false;
}

// Control the piece

document.addEventListener("keydown", CONTROL);

function CONTROL (event){
    if(event.keyCode == 37){
        p.moveLeft();
        dropStart = Date.now();
    }
    else if(event.keyCode == 38){
        p.rotate();
        dropStart = Date.now();
    }
    else if(event.keyCode == 39){
        p.moveRight();
        dropStart = Date.now();
    }
    else if(event.keyCode == 40){
        p.moveDown();
    }
}

// drop the piece every second

let dropStart = Date.now();
function drop() {
    let now = Date.now();
    let delta = now - dropStart;
    if(delta > 1000){
        p.moveDown();
        dropStart = Date.now();
    }
    requestAnimationFrame(drop);
}
drop();