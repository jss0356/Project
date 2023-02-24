

//by default, this will create a chess game piece of type "Empty"
class ChessPiece {
  constructor(pieceName = "Empty", pieceColor = "NoColor") {
    //Rook, Queen, Knight, King, Queen, Pawn, Empty
    this.pieceName = pieceName
    //"White", "Black", or "NoColor"
    this.pieceColor = pieceColor
    //where all possible moves of the chess piece shall go
    this.possibleMoves = []
    //true if current piece is checking an enemy king (IMPORTANT EXCEPTION! King Cannot Check Another King).
    this.isChecking = false
    //true if piece was moved by the associated playing side once or more.
    this.isMovedYet = false
  }
}


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
    //represents the currently selected piece of the user (by default, its empty as in no piece is selected).
    this.selectedPiece = new ChessPiece

    //all these do is act as constants to define the bound limits of the chessboard (always remaining constant for chess as the chessboard size remains static). Note that "X" represents row bounds, "Y" represents column bounds.

    const X_LOWER_BOUND = 0
    const X_UPPER_BOUND = 7
    const Y_LOWER_BOUND = 0
    const Y_UPPER_BOUND = 7

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
  initialRender() {
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
  //this helper function assumes that the board is already rendered with the pieces on it.
  clearBoard() {
    //gather all the chess piece elements to clear.
    let elementsToClear = document.querySelectorAll(".chess-piece")
    //clear the gathered elements
    for (let i = 0; i < elementsToClear.length; i++) {
      elementsToClear[i].remove()
    }
    //all chess squares
    let chessSquares = document.querySelectorAll(".square")
    //clear the selected chess square node indicator too.
    for (let i = 0; i < chessSquares.length; i++) {
      if (chessSquares[i].classList.contains("square-selected")) {
        chessSquares[i].classList.remove("square-selected")
      }
    }

  }

  renderBoard(currX, currY) {
    //erase the display from the previous state.
    this.clearBoard(currX, currY)
    //obtain all of the squares of the chessboard
    let chessSquares = document.querySelectorAll(".square")


    //current chess square being analyzed.
    let currSquare = 0

    //generate the pieces in the appropriate squares on the chess grid.
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (((currX * 8) + currY) == currSquare) {
          chessSquares[currSquare].classList.add("square-selected")
        }
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
  //returns boolean value of true if current coordinates are within the bounds of the chessBoard, false otherwise.
  inBounds(testX, testY) {
    //if within the row bounds of the chess board.
    if ((testX >= this.X_LOWER_BOUND) && (testX <= this.X_UPPER_BOUND)) {
      //and if also within the column bounds of the chess board.
      if ((testY >= this.Y_LOWER_BOUND) && (testY <= this.Y_UPPER_BOUND)) {
        //coordinate pair given is within chess board, so return true.
        return true
      }
    }
    //else, not within bounds so return false.
    return false
  }
  //generalized function to help determine general possible moves for any given chess piece type (excluding "Empty"), done through filtering out moves that violate fundamental chess game rules (this function assumes non-check state).
  possibleMoves(maxMoves, currX, currY, addX, addY) {
    //used in one place to set check.
    let originalX = currX
    let originalY = currY
    //determine what color the piece is first (used for some rule checking).
    let playingColor = this.board[currX][currY].pieceColor
    //determine type of piece that shall be moved (again used for some rule checking)
    let playingPieceType = this.board[currX][currY].pieceName
    //stores final result to return
    let potentialMoves = null
    //check maxmove steps ahead.
    for (let i = 1; i < maxMoves; i++) {
      //update based on specified update values to update by (note that addX and addY can be negative or positive).
      currX = currX + (addX * i)
      currY = currY + (addY * i)
      //if we are not in the bounds of the chess board anymore, invalid move so return current result.
      if (!inBounds(currX, currY)) {
        return potentialMoves
      }
      //if, on the current step we bump into a valid chess piece.
      if (this.board[currX][currY].pieceName !== "Empty") {
        //if the piece on this square is the same color as the piece that is checking for their possible moves
        if (this.board[currX][currY].pieceColor === playingColor) {
          //we cannot attack our allies, so the piece can no longer move further forward.
          return potentalMoves
        }
        //must be an enemy piece, push coordinate to list of potentialMoves before returning unless enemy king (we can kill enemy pieces unless its an enemy king)
        else {
          if (this.board[currX][currY].pieceName !== "King") {
            potentialMoves.push({ x: currX, y: currY })
            return potentialMoves
          }
          //attacking enemy king
          else {
            if (playingPieceType !== "Pawn") {
              //set check flag first, before returning
              this.board[originalX][originalY].isChecking = true
              return potentialMoves
            }
          }
        }
      }
      //move seems to not violate any of the general chess move rules, so add to potentialMoves.
      potentialMoves.push({ x: currX, y: currY })
    }
    return potentialMoves
  }

  //all of the move handler functions listed below must do the following: Query possibleMoves for a list of possibleMoves, then from there utilize those results to update  the total list of possibleMoves of a given piece (in other words, update the corressponding piece's possibleMoves array container).

  moveHandlerPawn() {

  }
  moveHandlerRook(currX, currY) {
    let Up = possibleMoves(8, currX, currY, -1, 0)
        let Down = possibleMoves(8, currX, currY, 1, 0)
        let Left = possibleMoves(8, currX, currY, 0, -1)
        let Right = possibleMoves(8, currX, currY, -1, 1)
      this.board[currX][currY].possibleMoves.push(...Up)
  }
  moveHandlerKnight() {

  }
  moveHandlerBishop() {

  }
  moveHandlerQueen() {

  }
  moveHandlerKing() {

  }

}

let board = new ChessBoard
//output the current state of the board as seen by javascript, for reference purposes.
console.log(board.board)
//initially renders the board at the very start of the game.
board.initialRender()
function clickEventBoard(currX, currY) {
  //for reference purposes
  console.log("obtained x:", currX, "obtained y:", currY)
  //if the user selected a chess piece that is of the same color as the side they are playing on.
  if ((board.board[currX][currY].pieceName !== "Empty") && (board.board[currX][currY].pieceColor === board.gameTurn)) {
    //
  }
  board.renderBoard(currX, currY)
}