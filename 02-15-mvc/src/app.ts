//for CLI interactiv
const readline = require('readline');
const io = readline.createInterface({ 
  input: process.stdin, 
  output: process.stdout
});

//differentiates between players (Player[' '] is "none")
export enum Player {X = 0, O = 1, ' ' = ' '}

/**
 * Represents a game of Tic Tac Toe.
 * Board size is hard-coded at 3.
 */
export class TTTGame {
  private gameBoard:Player[][];
  private currentPlayer:Player = Player.X;
  private winner:Player = Player[' '];
  public readonly size = 3; //hard-coded for simplicity

  constructor() {
    this.resetBoard(); //initialize board
  }

  resetBoard() {
    this.gameBoard = [
      [Player[' '], Player[' '], Player[' ']],
      [Player[' '], Player[' '], Player[' ']],
      [Player[' '], Player[' '], Player[' ']],
    ];
  }

  //returns if sucessful or not
  makeMove(x:number, y:number):boolean{ 
    if(this.winner !== Player[' ']) return false; //don't move if won
    if(x <0 || x > 2 || y < 0 || y > 2) return false; //out of bounds
    if(this.gameBoard[x][y] !== Player[' ']) return false; //don't move if occupied

    this.gameBoard[x][y] = this.currentPlayer; //make move

    //check if we now have a winner
    let gb = this.gameBoard;

    //check row
    if(gb[x][0] === gb[x][1] && gb[x][1] === gb[x][2]) this.winner = this.currentPlayer; 

    //check col
    if(gb[0][y] === gb[1][y] && gb[1][y] === gb[2][y]) this.winner = this.currentPlayer;

    //check diag
    if( gb[1][1] !== Player[' '] && (
        (gb[0][0] === gb[1][1] && gb[1][1] === gb[2][2]) || 
        (gb[2][0] === gb[1][1] && gb[1][1] === gb[0][2]) )) 
      this.winner = this.currentPlayer

    this.currentPlayer = (Number(this.currentPlayer)+1) % 2; //toggle

    return true; //valid move
  }

  getPiece(x:number, y:number):Player{
    if(x <0 || x > 2 || y < 0 || y > 2) return Player[' ']; //out of bounds
    return this.gameBoard[x][y];
  }

  getBoard() {
    return this.gameBoard;
  }
  
  getCurrentPlayer():Player {
    return this.currentPlayer;
  }

  getWinner():Player {
    return this.winner;
  }

  //starts the game
  play() {
    this.printBoard();
    this.takeTurn();    
  }

  takeTurn() {
    this.printPrompt();
    io.question('> ', (input) => {
      try {
        let cell = input.split(',');
        let legal = this.makeMove(Number(cell[0]),Number(cell[1]));
        if(legal){ //legal move
          this.printBoard();
          if(this.getWinner() !== Player[' ']){
            this.printWinner(this.getWinner());
            io.close();
            return; //end
          }
        }
      } catch(e) {} //for parsing errors

      this.takeTurn(); //recurse!
    })
  }

  printBoard() {
    //print the board
    console.log("    0   1   2")
    for(let i=0; i<this.size; i++) {
      let row = i+"   ";
      for(let j=0; j<this.size; j++) {
        row += Player[this.getPiece(i,j)];
        if(j < this.size - 1) 
          row += " | ";
      }
      console.log(row);
      if(i < this.size -1)
        console.log("   -----------");
    }
    console.log("");
  }

  printPrompt() {
    console.log(Player[game.getCurrentPlayer()]+"'s turn. Pick a spot [row, col]");
  }

  printWinner(winner:Player):void {
    console.log(Player[winner]+" is the winner!");
  }
}

let game:TTTGame = new TTTGame();
game.play();