import ChessPiece from './modules/ChessPiece.js'



class ChessBoard {
  constructor() {
    //only has values of "White" and "Black" indicating which colored side's turn.
    this.gameTurn = "White"
    //true if white is in check state, else false
    this.isCheckWhite = false
    //true if black is in check state, else false
    this.isCheckBlack = false
    //true if black is in checkmate state (white won), else false
    this.isCheckMateBlack = false
    //true if white is in checkmate state (black won), else false
    this.isCheckMateWhite = false

    //representation of the chess board as a 2d array of chess pieces
    this.board = new Array(8)
    for (let i = 0; i < 8; i++) {
      this.board[i] = new Array(8)
    }

    //setting the expected chess pieces types in their respective positions based on initial chess game state
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        //first row of black side
        if (i === 0) {
          if (j === 0) {
            this.board[i][j] = new ChessPiece("Rook", "Black")
          }
          else if (j === 1) {
            this.board[i][j] = new ChessPiece("Knight", "Black")
          }
          else if (j === 2) {
            this.board[i][j] = new ChessPiece("Bishop", "Black")
          }
          else if (j === 3) {
            this.board[i][j] = new ChessPiece("Queen", "Black")
          }
          else if (j === 4) {
            this.board[i][j] = new ChessPiece("King", "Black")
          }
          else if (j === 5) {
            this.board[i][j] = new ChessPiece("Bishop", "Black")
          }
          else if (j === 6) {
            this.board[i][j] = new ChessPiece("Knight", "Black")
          }
          //j === 7
          else {
            this.board[i][j] = new ChessPiece("Rook", "Black")
          }
        }

        //full row of black pawns
        else if (i === 1) {
          this.board[i][j] = new ChessPiece("Pawn", "Black")
        }
        //white side, second row which is all white pawns
        else if (i === 6) {
          this.board[i][j] = new ChessPiece("Pawn", "White")
        }
        else if (i === 7) {
          if (j === 0) {
            this.board[i][j] = new ChessPiece("Rook", "White")
          }
          else if (j === 1) {
            this.board[i][j] = new ChessPiece("Knight", "White")
          }
          else if (j === 2) {
            this.board[i][j] = new ChessPiece("Bishop", "White")
          }
          else if (j === 3) {
            this.board[i][j] = new ChessPiece("Queen", "White")
          }
          else if (j === 4) {
            this.board[i][j] = new ChessPiece("King", "White")
          }
          else if (j === 5) {
            this.board[i][j] = new ChessPiece("Bishop", "White")
          }
          else if (j === 6) {
            this.board[i][j] = new ChessPiece("Knight", "White")
          }
          //j === 7
          else {
            this.board[i][j] = new ChessPiece("Rook", "White")
          }
        }
        //otherwise, the square contains no piece there so set as empty.
        else {
          this.board[i][j] = new ChessPiece()
        }

      }
    }


  }


  //renders the current state of the board to the webpage
  renderBoard() {
    //where the chessboard shall go.
    let chessBoardDisplay = document.querySelector("#chessBoardDisplay")

    //generate checker-patterened chess board.
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {

        if ((i % 2) === 0) {
          if ((j % 2) === 0) {
            chessBoardDisplay.innerHTML += `<div class="papaya-whip square"   onclick="clickEventBoard(${i},${j})"></div>`

          }
          else {
            chessBoardDisplay.innerHTML += `<div class="green square" onclick="clickEventBoard(${i},${j})"></div>`

          }
        }
        else {
          if ((j % 2) === 0) {
            chessBoardDisplay.innerHTML += `<div class="green square"   onclick="clickEventBoard(${i},${j})"></div>`

          }
          else {
            chessBoardDisplay.innerHTML += `<div class="papaya-whip square" onclick="clickEventBoard(${i},${j})"></div>`

          }
        }
      }
    }
    //obtain all of the squares of the chessboard
    let chessSquares = document.querySelectorAll(".square")

    chessSquares[0].innerHTML += '<span style="position: absolute;">8</span>'
    chessSquares[8].innerHTML += '<span style="position: absolute;">7</span>'
    chessSquares[16].innerHTML += '<span style="position: absolute;">6</span>'
    chessSquares[24].innerHTML += '<span style="position: absolute;">5</span>'
    chessSquares[32].innerHTML += '<span style="position: absolute;">4</span>'
    chessSquares[40].innerHTML += '<span style="position: absolute;">3</span>'
    chessSquares[48].innerHTML += '<span style="position: absolute;">2</span>'
    chessSquares[56].innerHTML += '<span style="position: absolute;">1</span>'
    chessSquares[56].innerHTML += '<span style="position: absolute;">1</span>'
    chessSquares[56].innerHTML += '<span style="position: absolute; top:40px;">a</span>'
    chessSquares[57].innerHTML += '<span style="position: absolute; top:40px;">b</span>'
    chessSquares[58].innerHTML += '<span style="position: absolute;top:40px;">c</span>'
    chessSquares[59].innerHTML += '<span style="position: absolute; top:40px;">d</span>'
    chessSquares[60].innerHTML += '<span style="position: absolute; top:40px;">e</span>'
    chessSquares[61].innerHTML += '<span style="position: absolute; top:40px;">f</span>'
    chessSquares[62].innerHTML += '<span style="position: absolute; top:40px;">g</span>'
    chessSquares[63].innerHTML += '<span style="position: absolute; top:40px;">h</span>'

    //current square being analyzed
    let currSquare = 0
    //generate the pieces in the appropriate squares on the chess grid.
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        //if there is a piece that needs to be generated.
        if (this.board[i][j].pieceName !== "Empty") {
          //if the piece to be generated is of the color "White"
          if (this.board[i][j].pieceColor === "White") {
            //if a pawn element needs to be generated.
            if (this.board[i][j].pieceName === "Pawn") {
              let newPawnElement = document.createElement("img")
              newPawnElement.setAttribute("src", "./sprites/pawnw.png")
              newPawnElement.classList.add("chess-piece")
              chessSquares[currSquare].append(newPawnElement)
            }
            //generate a Rook element
            else if (this.board[i][j].pieceName === "Rook") {
              let newRookElement = document.createElement("img")
              newRookElement.setAttribute("src", "./sprites/rookw.png")
              newRookElement.classList.add("chess-piece")
              chessSquares[currSquare].append(newRookElement)
            }
            //generate a Knight element
            else if (this.board[i][j].pieceName === "Knight") {
              let newKnightElement = document.createElement("img")
              newKnightElement.setAttribute("src", "./sprites/knightw.png")
              newKnightElement.classList.add("chess-piece")
              chessSquares[currSquare].append(newKnightElement)
            }
            //generate a Bishop element
            else if (this.board[i][j].pieceName === "Bishop") {
              let newBishopElement = document.createElement("img")
              newBishopElement.setAttribute("src", "./sprites/bishopw.png")
              newBishopElement.classList.add("chess-piece")
              chessSquares[currSquare].append(newBishopElement)
            }
            //generate a Queen element
            else if (this.board[i][j].pieceName === "Queen") {
              let newQueenElement = document.createElement("img")
              newQueenElement.setAttribute("src", "./sprites/queenw.png")
              newQueenElement.classList.add("chess-piece")
              chessSquares[currSquare].append(newQueenElement)
            }
            //generate a King element
            else {
              let newKingElement = document.createElement("img")
              newKingElement.setAttribute("src", "./sprites/kingw.png")
              newKingElement.classList.add("chess-piece")
              chessSquares[currSquare].append(newKingElement)
            }
          }
          //otherwise, piece to generate is of black color
          else {
            //if a pawn element needs to be generated.
            if (this.board[i][j].pieceName === "Pawn") {
              let newPawnElement = document.createElement("img")
              newPawnElement.setAttribute("src", "./sprites/pawnb.png")
              newPawnElement.classList.add("chess-piece")
              chessSquares[currSquare].append(newPawnElement)
            }
            //generate a Rook element
            else if (this.board[i][j].pieceName === "Rook") {
              let newRookElement = document.createElement("img")
              newRookElement.setAttribute("src", "./sprites/rookb.png")
              newRookElement.classList.add("chess-piece")
              chessSquares[currSquare].append(newRookElement)
            }
            //generate a Knight element
            else if (this.board[i][j].pieceName === "Knight") {
              let newKnightElement = document.createElement("img")
              newKnightElement.setAttribute("src", "./sprites/knightb.png")
              newKnightElement.classList.add("chess-piece")
              chessSquares[currSquare].append(newKnightElement)
            }
            //generate a Bishop element
            else if (this.board[i][j].pieceName === "Bishop") {
              let newBishopElement = document.createElement("img")
              newBishopElement.setAttribute("src", "./sprites/bishopb.png")
              newBishopElement.classList.add("chess-piece")
              chessSquares[currSquare].append(newBishopElement)
            }
            //generate a Queen element
            else if (this.board[i][j].pieceName === "Queen") {
              let newQueenElement = document.createElement("img")
              newQueenElement.setAttribute("src", "./sprites/queenb.png")
              newQueenElement.classList.add("chess-piece")
              chessSquares[currSquare].append(newQueenElement)
            }
            //generate a King element
            else {
              let newKingElement = document.createElement("img")
              newKingElement.setAttribute("src", "./sprites/kingb.png")
              newKingElement.classList.add("chess-piece")
              chessSquares[currSquare].append(newKingElement)
            }
          }
        }
        currSquare++;
      }
    }

  }

  swapTurn() {
    if (this.gameTurn === "White") {
      this.gameTurn = "Black"
    }
    else {
      this.gameTurn = "White"
    }
  }

  //black sideColor=1, white sideColor=-1
  possibleMoves(maxMove, currX, currY, addX, addY) {
    //to-do
  }
}

let board = new ChessBoard
//output the current state of the board as seen by javascript.
console.log(board.board)
board.renderBoard()
function clickEventBoard(currX, currY) {
  console.log("obtained x:", currX, "obtained y:", currY)
}