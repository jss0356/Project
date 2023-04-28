import AI from './modules/AI.js'


// Menu (screens)

//by default, this will create a chess game piece of type "Empty"
class ChessPiece {
  constructor(pieceName = "Empty", pieceColor = "NoColor", positionX = null, positionY = null) {
    //Rook, Queen, Knight, King, Queen, Pawn, Empty
    this.pieceName = pieceName
    //"White", "Black", or "NoColor"
    this.pieceColor = pieceColor
    //represents the pieces current position on the board (null until placed on board)
    this.positionX = positionX
    this.positionY = positionY
    //where all possible moves of the chess piece shall go
    this.possibleMoves = []
    //true if current piece is checking an enemy king (IMPORTANT EXCEPTION! King Cannot Check Another King).
    this.isChecking = false
    //true if piece was moved by the associated playing side once or more.
    this.isMovedYet = false
    //used only for Queen, Rook, and Bishop pieces. Used to determine attackLine for checking piece.
    this.attackLine = []
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

    //these represent the main piece that are currently checking their respective enemy king's (if any at all)
    this.checkingPieceBlack = null
    this.checkingPieceWhite = null

    //coordinates of the pawn that is currently being promoted (regardless of color)
    this.promotingPawnX = null
    this.promotingPawnY = null

    this.possibleMovesUnderCheckWhite = []
    this.possibleMovesUnderCheckBlack = []

    //all these do is act as constants to define the bound limits of the chessboard (always remaining constant for chess as the chessboard size remains static). Note that "X" represents row bounds, "Y" represents column bounds.

    this.X_LOWER_BOUND = 0
    this.X_UPPER_BOUND = 7
    this.Y_LOWER_BOUND = 0
    this.Y_UPPER_BOUND = 7

    //decides whether if the current state of the game is stalemate draw or not.
    this.isStalemate = false

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
            this.board[i][j] = new ChessPiece("Rook", "Black", i, j)
          }
          else if (j === 1) {
            this.board[i][j] = new ChessPiece("Knight", "Black", i, j)
          }
          else if (j === 2) {
            this.board[i][j] = new ChessPiece("Bishop", "Black", i, j)
          }
          else if (j === 3) {
            this.board[i][j] = new ChessPiece("Queen", "Black", i, j)
          }
          else if (j === 4) {
            this.board[i][j] = new ChessPiece("King", "Black", i, j)
          }
          else if (j === 5) {
            this.board[i][j] = new ChessPiece("Bishop", "Black", i, j)
          }
          else if (j === 6) {
            this.board[i][j] = new ChessPiece("Knight", "Black", i, j)
          }
          //j === 7
          else {
            this.board[i][j] = new ChessPiece("Rook", "Black", i, j)
          }
        }

        //full row of black pawns
        else if (i === 1) {
          this.board[i][j] = new ChessPiece("Pawn", "Black", i, j)
        }
        //white side, second row which is all white pawns
        else if (i === 6) {
          this.board[i][j] = new ChessPiece("Pawn", "White", i, j)
        }
        else if (i === 7) {
          if (j === 0) {
            this.board[i][j] = new ChessPiece("Rook", "White", i, j)
          }
          else if (j === 1) {
            this.board[i][j] = new ChessPiece("Knight", "White", i, j)
          }
          else if (j === 2) {
            this.board[i][j] = new ChessPiece("Bishop", "White", i, j)
          }
          else if (j === 3) {
            this.board[i][j] = new ChessPiece("Queen", "White", i, j)
          }
          else if (j === 4) {
            this.board[i][j] = new ChessPiece("King", "White", i, j)
          }
          else if (j === 5) {
            this.board[i][j] = new ChessPiece("Bishop", "White", i, j)
          }
          else if (j === 6) {
            this.board[i][j] = new ChessPiece("Knight", "White", i, j)
          }
          //j === 7
          else {
            this.board[i][j] = new ChessPiece("Rook", "White", i, j)
          }
        }
        //otherwise, the square contains no piece there so set as empty.
        else {
          this.board[i][j] = new ChessPiece("Empty", "NoColor", i, j)
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
    //select possible move indicators to erase or clear (if there is any).
    let possibleMoveIndicators = document.querySelectorAll(".possible-move-indicator")

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
    if (possibleMoveIndicators.length !== 0) {
      for (let i = 0; i < possibleMoveIndicators.length; i++) {
        possibleMoveIndicators[i].remove()
      }
    }
  }

  renderBoard(currX, currY, isCheckState = false) {
    //erase the display from the previous state.
    this.clearBoard(currX, currY)
    //obtain all of the squares of the chessboard
    let chessSquares = document.querySelectorAll(".square")


    //current chess square being analyzed.
    let currSquare = 0

    //generate the pieces in the appropriate squares on the chess grid.
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (((currX * 8) + currY) === currSquare) {
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

    //if the user did not select an empty square on the chess board and the selected game piece is of their associated color.
    if ((this.board[currX][currY].pieceName !== "Empty") && (this.board[currX][currY].pieceColor === this.gameTurn) && isCheckState === false) {
      //if there are possible moves for this piece, must then show it to the user.
      if (this.board[currX][currY].possibleMoves.length !== 0) {
        //represents all possible moves for the piece that the user has selected.
        let possibleMovesList = this.board[currX][currY].possibleMoves
        //go through all the chess squares
        for (let i = 0; i < chessSquares.length; i++) {
          //for each chess square, go through the possibleMovesList and check if that square corresponds to a marked possible move.
          for (let j = 0; j < possibleMovesList.length; j++) {
            //if the current possibleMove coordinate pair corresponds to the current chess square, a possible move indicator must be rendered here.
            if ((((possibleMovesList[j].x) * 8) + possibleMovesList[j].y) === i) {
              let possibleMoveIndicator = document.createElement("div")
              possibleMoveIndicator.classList.add("possible-move-indicator")
              chessSquares[i].append(possibleMoveIndicator)
            }
          }
        }
      }
    }
    //the user selects a piece of the same color as the gameturn and the game is in the white check state.
    else if ((this.board[currX][currY].pieceName !== "Empty") && (this.board[currX][currY].pieceColor === this.gameTurn) && this.isCheckWhite === true) {
      //figure out if there is an associated move that can be made for that chosen peice.
      let associatedNodeItem = this.possibleMovesUnderCheckWhite.find(node => (node.piece.positionX === this.selectedPiece.positionX && node.piece.positionY === this.selectedPiece.positionY))
      console.log(associatedNodeItem)
      //if not, nothing to display so exit since nothing more to render.
      if (associatedNodeItem === undefined) {
        return
      }
      //else this non-zero sized container has all of the possible moves to render.
      let possibleMovesList = associatedNodeItem.possibleMovesCheck
      //go through all the chess squares
      for (let i = 0; i < chessSquares.length; i++) {
        //for each chess square, go through the possibleMovesList and check if that square corresponds to a marked possible move.
        for (let j = 0; j < possibleMovesList.length; j++) {
          //if the current possibleMove coordinate pair corresponds to the current chess square, a possible move indicator must be rendered here.
          if ((((possibleMovesList[j].x) * 8) + possibleMovesList[j].y) === i) {
            let possibleMoveIndicator = document.createElement("div")
            possibleMoveIndicator.classList.add("possible-move-indicator")
            chessSquares[i].append(possibleMoveIndicator)
          }
        }
      }

    }
    //the user selects a piece of the same color as the gameturn and the game is in the black check state.
    else if ((this.board[currX][currY].pieceName !== "Empty") && (this.board[currX][currY].pieceColor === this.gameTurn) && this.isCheckBlack === true) {

      let associatedNodeItem = this.possibleMovesUnderCheckBlack.find(node => (node.piece.positionX === this.selectedPiece.positionX && node.piece.positionY === this.selectedPiece.positionY))
      console.log(associatedNodeItem)
      if (associatedNodeItem === undefined) {
        return
      }
      //else this non-zero sized container has all of the possible moves to render.
      let possibleMovesList = associatedNodeItem.possibleMovesCheck
      //go through all the chess squares
      for (let i = 0; i < chessSquares.length; i++) {
        //for each chess square, go through the possibleMovesList and check if that square corresponds to a marked possible move.
        for (let j = 0; j < possibleMovesList.length; j++) {
          //if the current possibleMove coordinate pair corresponds to the current chess square, a possible move indicator must be rendered here.
          if ((((possibleMovesList[j].x) * 8) + possibleMovesList[j].y) === i) {
            let possibleMoveIndicator = document.createElement("div")
            possibleMoveIndicator.classList.add("possible-move-indicator")
            chessSquares[i].append(possibleMoveIndicator)
          }
        }
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

  //if there is a square that a king cannot move to because it will get attacked immediately, it is marked here (king cannot walk into a check).
  determineDangerSquare(currX, currY, addX, addY, maxMoves = 1) {
    //used in one place to set check.
    let originalX = currX
    let originalY = currY
    //determine what color the piece is first (used for some rule checking).
    let playingColor = this.board[currX][currY].pieceColor

    currX = originalX + (addX * 1)
    currY = originalY + (addY * 1)

    if (!this.inBounds(currX, currY)) {
      return false
    }



    if (playingColor === "White") {
      if (this.board[currX][currY].pieceColor === "Black") {
        if (this.board[currX][currY].pieceName === "King") {
          console.log("FILTER OUT")
          return true
        }
      }
    }
    else if (playingColor === "Black") {
      if (this.board[currX][currY].pieceColor === "White") {
        if (this.board[currX][currY].pieceName === "King") {
          console.log("FILTER OUT")
          return true
        }
      }
    }
    return false
  }

  //finds if piece can form an attackline (only applicable for Queen, Bishop, and Rook pieces).
  isPotentialAttackline(currX, currY, addX, addY, maxMoves = 8) {
    //determine what color the piece is first (used for some rule checking).
    let playingColor = this.board[currX][currY].pieceColor

    let originalX = currX
    let originalY = currY


    //check maxmove steps ahead.
    for (let i = 1; i <= maxMoves; i++) {
      //update based on specified update values to update by (note that addX and addY can be negative or positive).
      currX = originalX + (addX * i)
      currY = originalY + (addY * i)
      //if we are not in the bounds of the chess board anymore, no attackline possible so return current result.
      if (!this.inBounds(currX, currY)) {
        return false
      }
      //if the piece at this current square is an ally, no potential attackline can be found so false.
      if (this.board[currX][currY].pieceColor === playingColor) {
        return false
      }
      //if piece finding attackline is white
      if (playingColor === "White") {
        //if opposite colored piece.
        if (this.board[currX][currY].pieceColor === "Black") {
          //if a king is stumbled on, then there is an attackline
          if (this.board[currX][currY].pieceName === "King") {
            return true
          }
          //otherwise, no attackline found and opposite colored piece blocking so return false.
          else {
            return false
          }
        }
      }
      //if piece finding attackline is black
      if (playingColor === "Black") {
        //if opposite colored piece.
        if (this.board[currX][currY].pieceColor === "White") {
          //if a king is stumbled on, then there is an attackline
          if (this.board[currX][currY].pieceName === "King") {
            return true
          }
          //otherwise, no attackline found and opposite colored piece blocking so return false.
          else {
            return false
          }
        }
      }


    }
    //worst case scenario, no attackline found by default but it shouldn't go here.
    return false
  }

  //generalized function to help determine general possible moves for any given chess piece type (excluding "Empty"), done through filtering out moves that violate fundamental chess game rules (this function assumes non-check state).
  possibleMoves(maxMoves, currX, currY, addX, addY) {
    //used in one place to set check.
    let originalX = currX
    let originalY = currY
    //determine what color the piece is first (used for some rule checking).
    let playingColor = this.board[currX][currY].pieceColor
    //stores final result to return
    let potentialMoves = []
    //check maxmove steps ahead.
    for (let i = 1; i <= maxMoves; i++) {
      //update based on specified update values to update by (note that addX and addY can be negative or positive).
      currX = originalX + (addX * i)
      currY = originalY + (addY * i)
      //if we are not in the bounds of the chess board anymore, invalid move so return current result.
      if (!this.inBounds(currX, currY)) {
        return potentialMoves
      }

      //cannot move if it puts your side in check (applicable for ANY piece).

      if (playingColor === "White" && !this.isCheckWhite) {
        if (this.board[currX][currY].pieceName === "Empty" || (this.board[currX][currY].pieceColor === "Black" && this.board[currX][currY].pieceName !== "King")) {
          let possibleMoveSquare = this.board[currX][currY]
          let originalPieceName = this.board[originalX][originalY].pieceName
          //simulate movement and check if generating an attackline is possible.

          this.board[currX][currY] = this.board[originalX][originalY]
          this.board[originalX][originalY] = new ChessPiece()

          //if true, current possible move type (and possible future move steps) are invalid
          let isAttackLineFound = false

          //now look for opposite colored bishops, queens, or rooks and see if they have an attackline as a result of this potential move.
          for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
              let currentPiece = this.board[i][j]
              if (currentPiece.pieceColor === "Black") {
                if (currentPiece.pieceName === "Rook") {
                  isAttackLineFound = this.isPotentialAttackline(i, j, -1, 0)
                  if (isAttackLineFound) {
                    break
                  }
                  isAttackLineFound = this.isPotentialAttackline(i, j, 1, 0)
                  if (isAttackLineFound) {
                    break
                  }
                  isAttackLineFound = this.isPotentialAttackline(i, j, 0, -1)
                  if (isAttackLineFound) {
                    break
                  }
                  isAttackLineFound = this.isPotentialAttackline(i, j, 0, 1)
                  if (isAttackLineFound) {
                    break
                  }
                }
                else if (currentPiece.pieceName === "Queen") {
                  isAttackLineFound = this.isPotentialAttackline(i, j, -1, 0)
                  if (isAttackLineFound) {
                    break
                  }
                  isAttackLineFound = this.isPotentialAttackline(i, j, 1, 0)
                  if (isAttackLineFound) {
                    break
                  }
                  isAttackLineFound = this.isPotentialAttackline(i, j, 0, -1)
                  if (isAttackLineFound) {
                    break
                  }
                  isAttackLineFound = this.isPotentialAttackline(i, j, 0, 1)
                  if (isAttackLineFound) {
                    break
                  }
                  isAttackLineFound = this.isPotentialAttackline(i, j, -1, 1)
                  if (isAttackLineFound) {
                    break
                  }
                  isAttackLineFound = this.isPotentialAttackline(i, j, -1, -1)
                  if (isAttackLineFound) {
                    break
                  }
                  isAttackLineFound = this.isPotentialAttackline(i, j, 1, 1)
                  if (isAttackLineFound) {
                    break
                  }
                  isAttackLineFound = this.isPotentialAttackline(i, j, 1, -1)
                  if (isAttackLineFound) {
                    break
                  }

                }
                else if (currentPiece.pieceName === "Bishop") {
                  isAttackLineFound = this.isPotentialAttackline(i, j, -1, 1)
                  if (isAttackLineFound) {
                    break
                  }
                  isAttackLineFound = this.isPotentialAttackline(i, j, -1, -1)
                  if (isAttackLineFound) {
                    break
                  }
                  isAttackLineFound = this.isPotentialAttackline(i, j, 1, 1)
                  if (isAttackLineFound) {
                    break
                  }
                  isAttackLineFound = this.isPotentialAttackline(i, j, 1, -1)
                  if (isAttackLineFound) {
                    break
                  }
                }
              }
            }
            if (isAttackLineFound) {
              break
            }
          }

          //the current move is initially assumed to not be a danger square move (applicable for king pieces only).
          let isDangerSquare = false

          //if the piece to move is a king in the non-check state.
          if (originalPieceName === "King") {
            //also cannot move to "danger squares" or places it can walk into a check from the non-check state.
            for (let i = 0; i < 8; i++) {
              for (let j = 0; j < 8; j++) {
                let currentSquare = this.board[i][j]
                if (currentSquare.pieceColor === "Black") {
                  if (currentSquare.pieceName === "Pawn") {
                    let addX = 1
                    isDangerSquare = this.determineDangerSquare(i, j, addX, 1)
                    if (isDangerSquare) {
                      break
                    }
                    isDangerSquare = this.determineDangerSquare(i, j, addX, -1)
                    if (isDangerSquare) {
                      break
                    }

                  }
                  else if (currentSquare.pieceName === "Knight") {
                    isDangerSquare = this.determineDangerSquare(i, j, -1, 2)
                    if (isDangerSquare) {
                      break
                    }

                    isDangerSquare = this.determineDangerSquare(i, j, -2, 1)
                    if (isDangerSquare) {
                      break
                    }
                    isDangerSquare = this.determineDangerSquare(i, j, 1, 2)
                    if (isDangerSquare) {
                      break
                    }
                    isDangerSquare = this.determineDangerSquare(i, j, 2, 1)
                    if (isDangerSquare) {
                      break
                    }
                    isDangerSquare = this.determineDangerSquare(i, j, -1, -2)
                    if (isDangerSquare) {
                      break
                    }
                    isDangerSquare = this.determineDangerSquare(i, j, -2, -1)
                    if (isDangerSquare) {
                      break
                    }
                    isDangerSquare = this.determineDangerSquare(i, j, 1, -2)
                    if (isDangerSquare) {
                      break
                    }
                    isDangerSquare = this.determineDangerSquare(i, j, 2, -1)
                    if (isDangerSquare) {
                      break
                    }
                  }
                }
              }
              if (isDangerSquare) {
                break
              }
            }

            console.log("DANGER ", isDangerSquare)

          }

          this.board[originalX][originalY] = this.board[currX][currY]
          this.board[currX][currY] = possibleMoveSquare
          if (isAttackLineFound) {
            return []
          }
          if (originalPieceName === "King") {
            if (isDangerSquare) {
              return []
            }
          }


        }
      }
      if (playingColor === "Black" && !this.isCheckBlack) {
        if (this.board[currX][currY].pieceName === "Empty" || (this.board[currX][currY].pieceColor === "White" && this.board[currX][currY].pieceName !== "King")) {
          let possibleMoveSquare = this.board[currX][currY]
          let originalPieceName = this.board[originalX][originalY].pieceName

          //simulate movement and check if generating an attackline is possible.

          this.board[currX][currY] = this.board[originalX][originalY]
          this.board[originalX][originalY] = new ChessPiece()

          //if true, current possible move type (and possible future move steps) are invalid
          let isAttackLineFound = false

          //now look for opposite colored bishops, queens, or rooks and see if they have an attackline as a result of this potential move.
          for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
              let currentPiece = this.board[i][j]
              if (currentPiece.pieceColor === "White") {
                if (currentPiece.pieceName === "Rook") {
                  isAttackLineFound = this.isPotentialAttackline(i, j, -1, 0)
                  if (isAttackLineFound) {
                    break
                  }
                  isAttackLineFound = this.isPotentialAttackline(i, j, 1, 0)
                  if (isAttackLineFound) {
                    break
                  }
                  isAttackLineFound = this.isPotentialAttackline(i, j, 0, -1)
                  if (isAttackLineFound) {
                    break
                  }
                  isAttackLineFound = this.isPotentialAttackline(i, j, 0, 1)
                  if (isAttackLineFound) {
                    break
                  }
                }
                else if (currentPiece.pieceName === "Queen") {
                  isAttackLineFound = this.isPotentialAttackline(i, j, -1, 0)
                  if (isAttackLineFound) {
                    break
                  }
                  isAttackLineFound = this.isPotentialAttackline(i, j, 1, 0)
                  if (isAttackLineFound) {
                    break
                  }
                  isAttackLineFound = this.isPotentialAttackline(i, j, 0, -1)
                  if (isAttackLineFound) {
                    break
                  }
                  isAttackLineFound = this.isPotentialAttackline(i, j, 0, 1)
                  if (isAttackLineFound) {
                    break
                  }
                  isAttackLineFound = this.isPotentialAttackline(i, j, -1, 1)
                  if (isAttackLineFound) {
                    break
                  }
                  isAttackLineFound = this.isPotentialAttackline(i, j, -1, -1)
                  if (isAttackLineFound) {
                    break
                  }
                  isAttackLineFound = this.isPotentialAttackline(i, j, 1, 1)
                  if (isAttackLineFound) {
                    break
                  }
                  isAttackLineFound = this.isPotentialAttackline(i, j, 1, -1)
                  if (isAttackLineFound) {
                    break
                  }

                }
                else if (currentPiece.pieceName === "Bishop") {
                  isAttackLineFound = this.isPotentialAttackline(i, j, -1, 1)
                  if (isAttackLineFound) {
                    break
                  }
                  isAttackLineFound = this.isPotentialAttackline(i, j, -1, -1)
                  if (isAttackLineFound) {
                    break
                  }
                  isAttackLineFound = this.isPotentialAttackline(i, j, 1, 1)
                  if (isAttackLineFound) {
                    break
                  }
                  isAttackLineFound = this.isPotentialAttackline(i, j, 1, -1)
                  if (isAttackLineFound) {
                    break
                  }
                }
              }
            }
            if (isAttackLineFound) {
              break
            }
          }

          //the current move is initially assumed to not be a danger square move (applicable for king pieces only).
          let isDangerSquare = false

          //if the piece to move is a king in the non-check state.
          if (originalPieceName === "King") {
            //also cannot move to "danger squares" or places it can walk into a check from the non-check state.
            for (let i = 0; i < 8; i++) {
              for (let j = 0; j < 8; j++) {
                let currentSquare = this.board[i][j]
                if (currentSquare.pieceColor === "White") {
                  if (currentSquare.pieceName === "Pawn") {

                    let addX = -1
                    isDangerSquare = this.determineDangerSquare(i, j, addX, 1)
                    if (isDangerSquare) {
                      break
                    }
                    isDangerSquare = this.determineDangerSquare(i, j, addX, -1)
                    if (isDangerSquare) {
                      break
                    }

                  }
                  else if (currentSquare.pieceName === "Knight") {
                    isDangerSquare = this.determineDangerSquare(i, j, -1, 2)
                    if (isDangerSquare) {
                      break
                    }

                    isDangerSquare = this.determineDangerSquare(i, j, -2, 1)
                    if (isDangerSquare) {
                      break
                    }
                    isDangerSquare = this.determineDangerSquare(i, j, 1, 2)
                    if (isDangerSquare) {
                      break
                    }
                    isDangerSquare = this.determineDangerSquare(i, j, 2, 1)
                    if (isDangerSquare) {
                      break
                    }
                    isDangerSquare = this.determineDangerSquare(i, j, -1, -2)
                    if (isDangerSquare) {
                      break
                    }
                    isDangerSquare = this.determineDangerSquare(i, j, -2, -1)
                    if (isDangerSquare) {
                      break
                    }
                    isDangerSquare = this.determineDangerSquare(i, j, 1, -2)
                    if (isDangerSquare) {
                      break
                    }
                    isDangerSquare = this.determineDangerSquare(i, j, 2, -1)
                    if (isDangerSquare) {
                      break
                    }
                  }
                }
              }
              if (isDangerSquare) {
                break
              }
            }


          }


          this.board[originalX][originalY] = this.board[currX][currY]
          this.board[currX][currY] = possibleMoveSquare
          if (isAttackLineFound) {
            return []
          }

          if (originalPieceName === "King") {
            if (isDangerSquare) {
              return []
            }
          }

        }
      }


      //if, on the current step we bump into a valid chess piece.
      if (this.board[currX][currY].pieceName !== "Empty") {
        //if the piece on this square is the same color as the piece that is checking for their possible moves
        if (this.board[currX][currY].pieceColor === playingColor) {
          //we cannot attack our allies, so the piece can no longer move further forward.
          return potentialMoves
        }
        //must be an enemy piece, push coordinate to list of potentialMoves before returning unless enemy king (we can kill enemy pieces unless its an enemy king)
        else {

          if (this.board[currX][currY].pieceName !== "King") {
            if (!potentialMoves) {
              potentialMoves = [{ x: currX, y: currY }]
            }
            else {
              potentialMoves.push({ x: currX, y: currY })
            }
            return potentialMoves
          }
          //attacking enemy king
          else {
            if (this.board[originalX][originalY].pieceName !== "Pawn") {
              //set check flag first, before returning
              this.board[originalX][originalY].isChecking = true
            }
            //set attackline (non-empty for Queen, Bishop, and Rook pieces).
            this.board[originalX][originalY].attackLine = potentialMoves
            return potentialMoves

          }

        }
      }
      //move seems to not violate any of the general chess move rules, so add to potentialMoves.
      if (!potentialMoves) {
        potentialMoves = [{ x: currX, y: currY }]
      }
      else {
        potentialMoves.push({ x: currX, y: currY })
      }
    }
    return potentialMoves
  }



  //all of the move handler functions listed below must do the following: Query possibleMoves for a list of possibleMoves, then from there utilize those results to update  the total list of possibleMoves of a given piece (in other words, update the corressponding piece's possibleMoves array container).

  moveHandlerPawn(currX, currY) {
    this.board[currX][currY].possibleMoves = []
    let pieceSide = this.board[currX][currY].pieceColor
    let addX = (pieceSide === "White" ? -1 : 1)
    let Up1 = this.possibleMoves(1, currX, currY, addX, 0)
    let Up2 = this.possibleMoves(2, currX, currY, addX, 0)
    let UpRight = this.possibleMoves(1, currX, currY, addX, 1)
    let UpLeft = this.possibleMoves(1, currX, currY, addX, -1)

    if (Up2.length !== 0 && this.board[currX][currY].isMovedYet === false) {
      if (Up2.length === 1) {
        if (this.board[Up2[0].x][Up2[0].y].pieceName === "Empty") {
          this.board[currX][currY].possibleMoves = Up2
        }
      }
      else if (Up2.length === 2) {
        if (this.board[Up2[0].x][Up2[0].y].pieceName === "Empty") {
          this.board[currX][currY].possibleMoves.push(Up2[0])
          if (this.board[Up2[1].x][Up2[1].y].pieceName === "Empty") {
            this.board[currX][currY].possibleMoves.push(Up2[1])
          }
        }

      }


    }
    else if (Up1.length !== 0) {
      if (this.board[Up1[0].x][Up1[0].y].pieceName === "Empty") {
        this.board[currX][currY].possibleMoves = Up1
      }
    }


    if (this.inBounds(currX + addX, currY + 1)) {
      let squareToAnalyze1 = this.board[currX + addX][currY + 1]
      if (squareToAnalyze1.pieceName === "King" && squareToAnalyze1.pieceColor !== pieceSide) {
        this.board[currX][currY].isChecking = true
      }
    }

    if (this.inBounds(currX + addX, currY - 1)) {
      let squareToAnalyze2 = this.board[currX + addX][currY - 1]
      if (squareToAnalyze2.pieceName === "King" && squareToAnalyze2.pieceColor !== pieceSide) {
        this.board[currX][currY].isChecking = true
      }
    }

    if (UpRight.length != 0) {
      let squareToAnalyze = this.board[UpRight[0].x][UpRight[0].y]
      if (squareToAnalyze.pieceColor !== "NoColor" && squareToAnalyze.pieceColor !== pieceSide) {
        this.board[currX][currY].possibleMoves.push(...UpRight)
      }
    }
    if (UpLeft.length != 0) {
      let squareToAnalyze = this.board[UpLeft[0].x][UpLeft[0].y]
      if (squareToAnalyze.pieceColor !== "NoColor" && squareToAnalyze.pieceColor !== pieceSide) {
        this.board[currX][currY].possibleMoves.push(...UpLeft)
      }
    }


  }
  moveHandlerRook(currX, currY) {
    this.board[currX][currY].possibleMoves = []

    let Up = this.possibleMoves(8, currX, currY, -1, 0)
    let Down = this.possibleMoves(8, currX, currY, 1, 0)
    let Left = this.possibleMoves(8, currX, currY, 0, -1)
    let Right = this.possibleMoves(8, currX, currY, 0, 1)
    this.board[currX][currY].possibleMoves = Up
    this.board[currX][currY].possibleMoves.push(...Down)
    this.board[currX][currY].possibleMoves.push(...Left)
    this.board[currX][currY].possibleMoves.push(...Right)


  }
  moveHandlerKnight(currX, currY) {
    this.board[currX][currY].possibleMoves = []

    let UpRight1 = this.possibleMoves(1, currX, currY, -1, 2)
    let UpRight2 = this.possibleMoves(1, currX, currY, -2, 1)
    let DownRight1 = this.possibleMoves(1, currX, currY, 1, 2)
    let DownRight2 = this.possibleMoves(1, currX, currY, 2, 1)
    let UpLeft1 = this.possibleMoves(1, currX, currY, -1, -2)
    let UpLeft2 = this.possibleMoves(1, currX, currY, -2, -1)
    let DownLeft1 = this.possibleMoves(1, currX, currY, 1, -2)
    let DownLeft2 = this.possibleMoves(1, currX, currY, 2, -1)

    this.board[currX][currY].possibleMoves = UpRight1
    this.board[currX][currY].possibleMoves.push(...UpRight2)
    this.board[currX][currY].possibleMoves.push(...DownRight1)
    this.board[currX][currY].possibleMoves.push(...DownRight2)
    this.board[currX][currY].possibleMoves.push(...UpLeft1)
    this.board[currX][currY].possibleMoves.push(...UpLeft2)
    this.board[currX][currY].possibleMoves.push(...DownLeft1)
    this.board[currX][currY].possibleMoves.push(...DownLeft2)

  }
  moveHandlerBishop(currX, currY) {
    this.board[currX][currY].possibleMoves = []

    let UpRight = this.possibleMoves(8, currX, currY, -1, 1)
    let UpLeft = this.possibleMoves(8, currX, currY, -1, -1)
    let DownRight = this.possibleMoves(8, currX, currY, 1, 1)
    let DownLeft = this.possibleMoves(8, currX, currY, 1, -1)
    this.board[currX][currY].possibleMoves = UpRight
    this.board[currX][currY].possibleMoves.push(...UpLeft)
    this.board[currX][currY].possibleMoves.push(...DownRight)
    this.board[currX][currY].possibleMoves.push(...DownLeft)


  }
  moveHandlerQueen(currX, currY) {
    this.board[currX][currY].possibleMoves = []

    let Up = this.possibleMoves(8, currX, currY, -1, 0)
    let Down = this.possibleMoves(8, currX, currY, 1, 0)
    let Left = this.possibleMoves(8, currX, currY, 0, -1)
    let Right = this.possibleMoves(8, currX, currY, 0, 1)
    let UpRight = this.possibleMoves(8, currX, currY, -1, 1)
    let UpLeft = this.possibleMoves(8, currX, currY, -1, -1)
    let DownRight = this.possibleMoves(8, currX, currY, 1, 1)
    let DownLeft = this.possibleMoves(8, currX, currY, 1, -1)
    this.board[currX][currY].possibleMoves.push(...Up)
    this.board[currX][currY].possibleMoves.push(...Down)
    this.board[currX][currY].possibleMoves.push(...Left)
    this.board[currX][currY].possibleMoves.push(...Right)
    this.board[currX][currY].possibleMoves.push(...UpRight)
    this.board[currX][currY].possibleMoves.push(...UpLeft)
    this.board[currX][currY].possibleMoves.push(...DownRight)
    this.board[currX][currY].possibleMoves.push(...DownLeft)

  }
  moveHandlerKing(currX, currY) {


    this.board[currX][currY].possibleMoves = []

    let Up = this.possibleMoves(1, currX, currY, -1, 0)
    let Down = this.possibleMoves(1, currX, currY, 1, 0)
    let Left = this.possibleMoves(1, currX, currY, 0, -1)
    let Right = this.possibleMoves(1, currX, currY, 0, 1)
    let UpRight = this.possibleMoves(1, currX, currY, -1, 1)
    let UpLeft = this.possibleMoves(1, currX, currY, -1, -1)
    let DownRight = this.possibleMoves(1, currX, currY, 1, 1)
    let DownLeft = this.possibleMoves(1, currX, currY, 1, -1)
    this.board[currX][currY].possibleMoves = Up
    this.board[currX][currY].possibleMoves.push(...Down)
    this.board[currX][currY].possibleMoves.push(...Left)
    this.board[currX][currY].possibleMoves.push(...Right)
    this.board[currX][currY].possibleMoves.push(...UpRight)
    this.board[currX][currY].possibleMoves.push(...UpLeft)
    this.board[currX][currY].possibleMoves.push(...DownRight)
    this.board[currX][currY].possibleMoves.push(...DownLeft)


  }

  castlingHandler(currX, currY) {
    //if we selected a King that is of the same turn as the turn to move and it hasnt been moved yet
    if (this.selectedPiece.pieceName === "King" && this.selectedPiece.pieceColor === this.gameTurn && this.selectedPiece.isMovedYet === false) {
      //if we selected a Rook that is of the same turn as the turn to move and it hasnt been moved yet
      if (this.board[currX][currY].pieceName === "Rook" && this.board[currX][currY].pieceColor === this.gameTurn && this.board[currX][currY].isMovedYet === false) {
        //if the current turn to move is white.
        if (this.gameTurn === "White") {
          //if the rook is on the right side.
          if (currX === 7 && currY === 7) {
            //these squares must be empty for the castling to take place (last condition to check).
            let square1 = this.board[7][6]
            let square2 = this.board[7][5]

            //if it is, then we can castle.
            if (square1.pieceName === "Empty" && square2.pieceName === "Empty") {

              let originalXKing = this.selectedPiece.positionX
              let originalYKing = this.selectedPiece.positionY

              this.selectedPiece.positionX = 7
              this.selectedPiece.positionY = 6
              this.board[7][6] = this.selectedPiece
              this.board[originalXKing][originalYKing] = new ChessPiece("Empty", "NoColor", originalXKing, originalYKing)

              let originalXRook = this.board[currX][currY].positionX
              let originalYRook = this.board[currX][currY].positionY

              this.board[currX][currY].positionX = 7
              this.board[currX][currY].positionY = 5
              this.board[7][5] = this.board[currX][currY]
              this.board[originalXRook][originalYRook] = new ChessPiece("Empty", "NoColor", originalXRook, originalYRook)

            }

          }
          //otherwise, if the Rook is on the left side
          else if (currX === 7 && currY === 0) {
            //these squares must be empty for the castling to take place (last condition to check).
            let square1 = this.board[7][3]
            let square2 = this.board[7][2]
            let square3 = this.board[7][1]

            if (square1.pieceName === "Empty" && square2.pieceName === "Empty" && square3.pieceName === "Empty") {
              let originalXKing = this.selectedPiece.positionX
              let originalYKing = this.selectedPiece.positionY

              this.selectedPiece.positionX = 7
              this.selectedPiece.positionY = 2
              this.board[7][2] = this.selectedPiece
              this.board[originalXKing][originalYKing] = new ChessPiece("Empty", "NoColor", originalXKing, originalYKing)

              let originalXRook = this.board[currX][currY].positionX
              let originalYRook = this.board[currX][currY].positionY

              this.board[currX][currY].positionX = 7
              this.board[currX][currY].positionY = 3
              this.board[7][3] = this.board[currX][currY]
              this.board[originalXRook][originalYRook] = new ChessPiece("Empty", "NoColor", originalXRook, originalYRook)


            }

          }
        }
        //if the current turn to move is black.
        if (this.gameTurn === "Black") {
          //if the rook is on the right side.
          if (currX === 0 && currY === 7) {
            //these squares must be empty for the castling to take place (last condition to check).
            let square1 = this.board[0][6]
            let square2 = this.board[0][5]

            //if it is, then we can castle.
            if (square1.pieceName === "Empty" && square2.pieceName === "Empty") {

              let originalXKing = this.selectedPiece.positionX
              let originalYKing = this.selectedPiece.positionY

              this.selectedPiece.positionX = 0
              this.selectedPiece.positionY = 6
              this.board[0][6] = this.selectedPiece
              this.board[originalXKing][originalYKing] = new ChessPiece("Empty", "NoColor", originalXKing, originalYKing)

              let originalXRook = this.board[currX][currY].positionX
              let originalYRook = this.board[currX][currY].positionY

              this.board[currX][currY].positionX = 0
              this.board[currX][currY].positionY = 5
              this.board[0][5] = this.board[currX][currY]
              this.board[originalXRook][originalYRook] = new ChessPiece("Empty", "NoColor", originalXRook, originalYRook)

            }

          }
          //otherwise, if the Rook is on the left side
          else if (currX === 0 && currY === 0) {
            //these squares must be empty for the castling to take place (last condition to check).
            let square1 = this.board[0][3]
            let square2 = this.board[0][2]
            let square3 = this.board[0][1]

            if (square1.pieceName === "Empty" && square2.pieceName === "Empty" && square3.pieceName === "Empty") {
              let originalXKing = this.selectedPiece.positionX
              let originalYKing = this.selectedPiece.positionY

              this.selectedPiece.positionX = 0
              this.selectedPiece.positionY = 2
              this.board[0][2] = this.selectedPiece
              this.board[originalXKing][originalYKing] = new ChessPiece("Empty", "NoColor", originalXKing, originalYKing)

              let originalXRook = this.board[currX][currY].positionX
              let originalYRook = this.board[currX][currY].positionY

              this.board[currX][currY].positionX = 0
              this.board[currX][currY].positionY = 3
              this.board[0][3] = this.board[currX][currY]
              this.board[originalXRook][originalYRook] = new ChessPiece("Empty", "NoColor", originalXRook, originalYRook)


            }

          }
        }
        this.swapTurn()

      }
    }
  }

  promotionHandler(currX, currY) {
    let promotionDisplay = document.querySelectorAll("#promotion-display")
    console.log(promotionDisplay)
    if (this.selectedPiece.pieceName === "Pawn") {
      if (this.selectedPiece.pieceColor === "White") {
        if (this.selectedPiece.positionX === 0) {
          promotionDisplay[0].style.display = "flex"
          this.promotingPawnX = currX
          this.promotingPawnY = currY
        }
      }
      if (this.selectedPiece.pieceColor === "Black") {
        if (this.selectedPiece.positionX === 7) {
          promotionDisplay[0].style.display = "flex"
          this.promotingPawnX = this.selectedPiece.positionX
          this.promotingPawnY = this.selectedPiece.positionY

        }
      }
    }
  }
  clearCheckFlags() {
    //now reset all of the piece check flags to "false".
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (this.board[i][j].pieceName !== "Empty") {
          this.board[i][j].isChecking = false
        }
      }
    }
  }
  //finds if any piece is checking their enemy king, if so, then set check flags and output that there is a check to indicate a transition into a check sub-state.
  setCheckFlags() {
    this.clearCheckFlags()

    //iterate through whole board to set check flags for all playable pieces.
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (this.board[i][j].pieceName !== "Empty") {
          if (this.board[i][j].pieceName === "Rook") {
            this.moveHandlerRook(i, j)
          }
          if (this.board[i][j].pieceName === "Queen") {
            this.moveHandlerQueen(i, j)
          }
          if (this.board[i][j].pieceName === "Knight") {
            this.moveHandlerKnight(i, j)
          }
          if (this.board[i][j].pieceName === "Pawn") {
            this.moveHandlerPawn(i, j)
          }
          if (this.board[i][j].pieceName === "Bishop") {
            this.moveHandlerBishop(i, j)
          }
        }
      }
    }
    this.isCheckWhite = false
    this.isCheckBlack = false

    //iterate through whole board to determine if any pieces are checking their enemy king (if check flags were set for a piece).
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        //if a playable piece.
        if (this.board[i][j].pieceName !== "Empty") {
          //if its color is white.
          if (this.board[i][j].pieceColor === "White") {
            //if a white piece is checking a black king, black must be in check.
            if (this.board[i][j].isChecking) {
              this.isCheckBlack = true
              this.checkingPieceWhite = this.board[i][j]
              this.isCheckBlack = true
              return
            }
          }
          //if its color is black.
          else if (this.board[i][j].pieceColor === "Black") {
            //if a black piece is checking a white king, white must be in check.
            if (this.board[i][j].isChecking) {
              this.isCheckWhite = true
              this.checkingPieceBlack = this.board[i][j]
              this.isCheckWhite = true
              return
            }
          }
        }
      }
    }

    let checkPromptWhite = document.querySelector(".checkPromptWhite")
    checkPromptWhite.style.left = "-999px"
    let checkPromptBlack = document.querySelector(".checkPromptBlack")
    checkPromptBlack.style.left = "-999px"


  }



  //handles finding the possible moves under a check state for either white or black (subset of moves from normal state). Checkstate refers to color that is currently in check.
  checkHandler(checkState) {
    this.possibleMovesUnderCheckWhite = []
    this.possibleMovesUnderCheckBlack = []
    //checkstate is equal to white.
    if (checkState === "White") {
      /* Criteria to check for moves if valid under check state.
        Non-King Pieces
          1. Move must be of equivalent coordinates to that of an attackLine coordinate (assuming there is an attackLine)
          2. Move must be of same coordinates as the enemy piece checking their respective king (in other words, able to kill checking piece).
        King Piece
          1. Move that King makes must put the game out of a check state.
      */

      //current location of the white king (initially unknown).
      let currLocationKing = null

      //first check valid moves for non-king pieces.

      //refers to the current attackLine of the checking black piece.
      let currAttackLine = this.checkingPieceBlack.attackLine

      //whatever is part of an attackLine is considered a valid move coordinate.
      let validMovesForWhite = []
      validMovesForWhite.push(...currAttackLine)

      //another valid coordinate is where the checking piece is (killing it with a non-king piece).
      validMovesForWhite.push({ x: this.checkingPieceBlack.positionX, y: this.checkingPieceBlack.positionY })

      //now check to see if any piece has possibleMoves that are a part of these valid coordinates (reflects the concept that valid moves under a check state is always the subset of valid moves from the normal state)
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          //current piece under analysis.
          let currentPiece = this.board[i][j]


          //once we stumble upon the white king, set its position as known.
          if (currentPiece.pieceName === "King" && currentPiece.pieceColor === "White") {
            currLocationKing = { x: currentPiece.positionX, y: currentPiece.positionY }
          }

          //if the current piece is a playable white piece that is not a king
          if (currentPiece.pieceName !== "Empty" && currentPiece.pieceColor === "White" && currentPiece.pieceName !== "King") {



            //this is where the possibleMoves for the current piece under check state would go (if any).
            let possibleMovesCheck = []

            //the move handler must have already been called on all of the pieces from the setCheckFlags(), so we can safely assume that all the pieces have their possibleMoves populated.
            for (let k = 0; k < currentPiece.possibleMoves.length; k++) {
              //if this is true, current move is valid for associated currentPiece
              if (validMovesForWhite.find(({ x, y }) => currentPiece.possibleMoves[k].x === x && currentPiece.possibleMoves[k].y === y) !== undefined) {
                possibleMovesCheck.push({ x: currentPiece.possibleMoves[k].x, y: currentPiece.possibleMoves[k].y })

              }
            }
            //if the piece actually has a valid move to make under check state, add it to the substate of moves to be made for the check state.
            if (possibleMovesCheck.length !== 0) {
              this.possibleMovesUnderCheckWhite.push({ piece: currentPiece, possibleMovesCheck: possibleMovesCheck })
            }
          }
        }
      }

      //now determine possibleMoves in check for the king.
      validMovesForWhite = []
      //maintain true board state to revert back too.
      let actualBoardState = this.board
      this.moveHandlerKing(currLocationKing.x, currLocationKing.y)

      let kingPossibleMoves = this.board[currLocationKing.x][currLocationKing.y].possibleMoves

      for (let i = 0; i < kingPossibleMoves.length; i++) {
        //the current possible move under analysis.
        let currentPossibleMove = kingPossibleMoves[i]

        let originalPiece = this.board[currentPossibleMove.x][currentPossibleMove.y]
        this.board[currentPossibleMove.x][currentPossibleMove.y] = this.board[currLocationKing.x][currLocationKing.y]
        this.board[currLocationKing.x][currLocationKing.y] = originalPiece
        let backup = this.board[currLocationKing.x][currLocationKing.y]
        this.board[currLocationKing.x][currLocationKing.y] = new ChessPiece("Empty", "NoColor", 1, 1)
        this.setCheckFlags()

        if (!this.isCheckWhite) {
          validMovesForWhite.push(currentPossibleMove)
        }
        this.isCheckWhite = true

        this.board[currLocationKing.x][currLocationKing.y] = this.board[currentPossibleMove.x][currentPossibleMove.y]

        this.board[currentPossibleMove.x][currentPossibleMove.y] = backup

      }

      this.board = actualBoardState

      if (validMovesForWhite.length !== 0) {
        this.possibleMovesUnderCheckWhite.push({ piece: this.board[currLocationKing.x][currLocationKing.y], possibleMovesCheck: validMovesForWhite })
      }

    }
    //checkstate is equal to black.
    else {
      /* Criteria to check for moves if valid under check state.
        Non-King Pieces
          1. Move must be of equivalent coordinates to that of an attackLine coordinate (assuming there is an attackLine)
          2. Move must be of same coordinates as the enemy piece checking their respective king (in other words, able to kill checking piece).
        King Piece
          1. Move that King makes must put the game out of a check state.
      */

      //current location of the white king (initially unknown).
      let currLocationKing = null

      //first check valid moves for non-king pieces.

      //refers to the current attackLine of the checking black piece.
      let currAttackLine = this.checkingPieceWhite.attackLine

      //whatever is part of an attackLine is considered a valid move coordinate.
      let validMovesForBlack = []
      validMovesForBlack.push(...currAttackLine)

      //another valid coordinate is where the checking piece is (killing it with a non-king piece).
      validMovesForBlack.push({ x: this.checkingPieceWhite.positionX, y: this.checkingPieceWhite.positionY })

      //now check to see if any piece has possibleMoves that are a part of these valid coordinates (reflects the concept that valid moves under a check state is always the subset of valid moves from the normal state)
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          //current piece under analysis.
          let currentPiece = this.board[i][j]


          //once we stumble upon the black king, set its position as known.
          if (currentPiece.pieceName === "King" && currentPiece.pieceColor === "Black") {
            currLocationKing = { x: currentPiece.positionX, y: currentPiece.positionY }
          }

          //if the current piece is a playable black piece that is not a king
          if (currentPiece.pieceName !== "Empty" && currentPiece.pieceColor === "Black" && currentPiece.pieceName !== "King") {



            //this is where the possibleMoves for the current piece under check state would go (if any).
            let possibleMovesCheck = []

            //the move handler must have already been called on all of the pieces from the setCheckFlags(), so we can safely assume that all the pieces have their possibleMoves populated.
            for (let k = 0; k < currentPiece.possibleMoves.length; k++) {
              //if this is true, current move is valid for associated currentPiece
              if (validMovesForBlack.find(({ x, y }) => currentPiece.possibleMoves[k].x === x && currentPiece.possibleMoves[k].y === y) !== undefined) {
                possibleMovesCheck.push({ x: currentPiece.possibleMoves[k].x, y: currentPiece.possibleMoves[k].y })

              }
            }
            //if the piece actually has a valid move to make under check state, add it to the substate of moves to be made for the check state.
            if (possibleMovesCheck.length !== 0) {
              this.possibleMovesUnderCheckBlack.push({ piece: currentPiece, possibleMovesCheck: possibleMovesCheck })
            }
          }
        }
      }

      //now determine possibleMoves in check for the king.
      validMovesForBlack = []
      //maintain true board state to revert back too.
      let actualBoardState = this.board
      this.moveHandlerKing(currLocationKing.x, currLocationKing.y)
      let kingPossibleMoves = this.board[currLocationKing.x][currLocationKing.y].possibleMoves

      for (let i = 0; i < kingPossibleMoves.length; i++) {
        //the current possible move under analysis.
        let currentPossibleMove = kingPossibleMoves[i]

        let originalPiece = this.board[currentPossibleMove.x][currentPossibleMove.y]
        this.board[currentPossibleMove.x][currentPossibleMove.y] = this.board[currLocationKing.x][currLocationKing.y]
        this.board[currLocationKing.x][currLocationKing.y] = originalPiece
        let backup = this.board[currLocationKing.x][currLocationKing.y]
        this.board[currLocationKing.x][currLocationKing.y] = new ChessPiece("Empty", "NoColor", 1, 1)
        this.setCheckFlags()

        if (!this.isCheckBlack) {
          validMovesForBlack.push(currentPossibleMove)
        }
        this.isCheckBlack = true

        this.board[currLocationKing.x][currLocationKing.y] = this.board[currentPossibleMove.x][currentPossibleMove.y]

        this.board[currentPossibleMove.x][currentPossibleMove.y] = backup

      }

      this.board = actualBoardState

      if (validMovesForBlack.length !== 0) {
        this.possibleMovesUnderCheckBlack.push({ piece: this.board[currLocationKing.x][currLocationKing.y], possibleMovesCheck: validMovesForBlack })
      }
    }

  }

  setIsCheckmateFlags() {
    if (this.isCheckBlack && this.possibleMovesUnderCheckBlack.length === 0) {
      this.isCheckMateBlack = true
      return
    }
    else if (this.isCheckWhite && this.possibleMovesUnderCheckWhite.length === 0) {
      this.isCheckMateWhite = true
      return
    }
  }

  //for now, this sets the draw for only the stalemate condition (if either side has only a king left)
  isDraw() {
    let numWhitePieces = 0
    let numBlackPieces = 0

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (this.board[i][j].pieceColor === "White") {
          numWhitePieces++
        }
        else if (this.board[i][j].pieceColor === "Black") {
          numBlackPieces++
        }
      }
    }

    if (numWhitePieces === 1 || numBlackPieces === 1) {
      this.isStalemate = true
    }
  }


}

let board = new ChessBoard
//output the current state of the board as seen by javascript, for reference purposes.
console.log(board.board)
//initially renders the board at the very start of the game.
board.initialRender()



function clickEventBoard(currX, currY) {

  board.isDraw()

  //for reference purposes
  console.log("obtained x:", currX, "obtained y:", currY)
  console.log(board.board)

  board.castlingHandler(currX, currY)

  //if the user selected a chess piece that is of the same color as the side they are playing on, determine possible valid moves.
  if ((board.board[currX][currY].pieceName !== "Empty") && (board.board[currX][currY].pieceColor === board.gameTurn) && board.isStalemate === false) {
    board.selectedPiece = board.board[currX][currY]
    if (board.selectedPiece.pieceName === "Rook") {
      console.log("Detected Rook")
      board.moveHandlerRook(currX, currY)
    }
    else if (board.selectedPiece.pieceName === "Knight") {
      console.log("Detected Knight")
      board.moveHandlerKnight(currX, currY)
    }
    else if (board.selectedPiece.pieceName === "Bishop") {
      console.log("Detected Bishop")
      board.moveHandlerBishop(currX, currY)
    }
    else if (board.selectedPiece.pieceName === "Queen") {
      console.log("Detected Queen")
      board.moveHandlerQueen(currX, currY)
    }
    else if (board.selectedPiece.pieceName === "King") {
      console.log("Detected King")
      board.moveHandlerKing(currX, currY)
    }
    else if (board.selectedPiece.pieceName === "Pawn") {
      console.log("Detected Pawn")
      board.moveHandlerPawn(currX, currY)
    }
  }

  //if the user previously selected a piece.
  if (board.selectedPiece.pieceName !== "Empty" && board.isStalemate === false) {
    //if the user selects a square that is a part of the pieces possibleMoves, the piece must be moved to the specified location clicked on by the user.
    if (((board.selectedPiece.possibleMoves.find(({ x, y }) => ((x === currX) && (y === currY)))) !== undefined) && board.isCheckWhite === false && board.isCheckBlack === false) {
      console.log("time to move", board.selectedPiece.possibleMoves)
      //original x and y of the piece to be moved.
      let originalX = board.selectedPiece.positionX
      let originalY = board.selectedPiece.positionY

      //update the old x,y values to reflect that of the new location.
      board.selectedPiece.positionX = currX
      board.selectedPiece.positionY = currY

      //make the piece move to the newly specified location
      board.board[currX][currY] = board.selectedPiece

      board.promotionHandler(currX, currY)

      //replace old location with empty square, indicating that the piece has moved away from this square.
      board.board[originalX][originalY] = new ChessPiece("Empty", "NoColor", originalX, originalY)

      //This section is only after movement is done.
      //once the piece is moved, this will set the moved flag to true if not yet set.
      if (board.selectedPiece.isMovedYet === false) {
        board.board[board.selectedPiece.positionX][board.selectedPiece.positionY].isMovedYet = true
      }
      //swap turn from white->black or black->white.
      board.swapTurn()
      //set the selected piece to be equivalent to the square the user has selected.
      board.selectedPiece = new ChessPiece

      //check if the game has transitioned away from normal state
      board.setCheckFlags()
      //if black is now in check.
      if (board.isCheckBlack) {
        board.checkHandler("Black")
        //determines if actually checkmate substate for black.
        board.setIsCheckmateFlags()
      }
      //otherwise, if white is now in check.
      else if (board.isCheckWhite) {
        board.checkHandler("White")
        //determines if actually checkmate substate for white.
        board.setIsCheckmateFlags()
      }

    }
    else if (board.isCheckWhite) {
      let associatedNodeItem = board.possibleMovesUnderCheckWhite.find(node => (node.piece.positionX === board.selectedPiece.positionX && node.piece.positionY === board.selectedPiece.positionY))
      if (associatedNodeItem !== undefined) {
        let possibleMoves = associatedNodeItem.possibleMovesCheck
        if (possibleMoves.find(({ x, y }) => ((x === currX) && (y === currY))) !== undefined) {
          //original x and y of the piece to be moved.
          let originalX = board.selectedPiece.positionX
          let originalY = board.selectedPiece.positionY

          //update the old x,y values to reflect that of the new location.
          board.selectedPiece.positionX = currX
          board.selectedPiece.positionY = currY

          //make the piece move to the newly specified location
          board.board[currX][currY] = board.selectedPiece

          board.promotionHandler(currX, currY)

          //replace old location with empty square, indicating that the piece has moved away from this square.
          board.board[originalX][originalY] = new ChessPiece("Empty", "NoColor", originalX, originalY)

          //This section is only after movement is done.
          //once the piece is moved, this will set the moved flag to true if not yet set.
          if (board.selectedPiece.isMovedYet === false) {
            board.board[board.selectedPiece.positionX][board.selectedPiece.positionY].isMovedYet = true
          }
          //swap turn from white->black or black->white.
          board.swapTurn()
          //set the selected piece to be equivalent to the square the user has selected.
          board.selectedPiece = new ChessPiece

          //check if the game has transitioned away from normal state
          board.setCheckFlags()
        }
      }


    }
    else if (board.isCheckBlack) {
      let associatedNodeItem = board.possibleMovesUnderCheckBlack.find(node => (node.piece.positionX === board.selectedPiece.positionX && node.piece.positionY === board.selectedPiece.positionY))
      if (associatedNodeItem !== undefined) {
        let possibleMoves = associatedNodeItem.possibleMovesCheck
        if (possibleMoves.find(({ x, y }) => ((x === currX) && (y === currY))) !== undefined) {
          //original x and y of the piece to be moved.
          let originalX = board.selectedPiece.positionX
          let originalY = board.selectedPiece.positionY

          //update the old x,y values to reflect that of the new location.
          board.selectedPiece.positionX = currX
          board.selectedPiece.positionY = currY

          //make the piece move to the newly specified location
          board.board[currX][currY] = board.selectedPiece

          board.promotionHandler(currX, currY)

          //replace old location with empty square, indicating that the piece has moved away from this square.
          board.board[originalX][originalY] = new ChessPiece("Empty", "NoColor", originalX, originalY)

          //This section is only after movement is done.
          //once the piece is moved, this will set the moved flag to true if not yet set.
          if (board.selectedPiece.isMovedYet === false) {
            board.board[board.selectedPiece.positionX][board.selectedPiece.positionY].isMovedYet = true
          }
          //swap turn from white->black or black->white.
          board.swapTurn()
          //set the selected piece to be equivalent to the square the user has selected.
          board.selectedPiece = new ChessPiece

          //check if the game has transitioned away from normal state
          board.setCheckFlags()

        }
      }
    }
    else {
      board.selectedPiece = board.board[currX][currY]
    }
  }

  console.log("Selected piece: ", board.selectedPiece)
  if (board.isCheckBlack === false && board.isCheckWhite === false) {
    board.renderBoard(currX, currY)
  }
  else {
    board.renderBoard(currX, currY, true)
  }

  if (board.isCheckMateBlack) {
    let checkmatePromptWhite = document.querySelector(".checkmatePromptWhite")
    checkmatePromptWhite.style.left = "200px"
  }
  else if (board.isCheckMateWhite) {
    let checkmatePromptWhite = document.querySelector(".checkmatePromptWhite")
    checkmatePromptWhite.style.left = "200px"
  }

  else if (board.isCheckWhite) {
    let checkPromptWhite = document.querySelector(".checkPromptWhite")
    checkPromptWhite.style.left = "200px"
  }
  else if (board.isCheckBlack) {
    let checkPromptBlack = document.querySelector(".checkPromptBlack")
    checkPromptBlack.style.left = "200px"
  }

  else if (board.isStalemate) {
    let stalematePrompt = document.querySelector(".stalematePrompt")
    stalematePrompt.style.left = "200px"
  }
}

let promotionClickHandler = function(pieceTypeSelected) {
  let promotionDisplay = document.querySelectorAll("#promotion-display")
  promotionDisplay[0].style.display = "none"
  console.log(board.selectedPiece)
  if (board.gameTurn === "White") {
    board.board[board.promotingPawnX][board.promotingPawnY] = new ChessPiece(pieceTypeSelected, "Black", board.promotingPawnX, board.promotingPawnY)
  }
  if (board.gameTurn === "Black") {
    board.board[board.promotingPawnX][board.promotingPawnY] = new ChessPiece(pieceTypeSelected, "White", board.promotingPawnX, board.promotingPawnY)
  }
      //check if the game has transitioned away from normal state
      board.setCheckFlags()
      //if black is now in check.
      if (board.isCheckBlack) {
        board.checkHandler("Black")
        //determines if actually checkmate substate for black.
        board.setIsCheckmateFlags()
      }
      //otherwise, if white is now in check.
      else if (board.isCheckWhite) {
        board.checkHandler("White")
        //determines if actually checkmate substate for white.
        board.setIsCheckmateFlags()
      }

  if (board.isCheckMateBlack) {
    let checkmatePromptWhite = document.querySelector(".checkmatePromptWhite")
    checkmatePromptWhite.style.left = "200px"
  }
  else if (board.isCheckMateWhite) {
    let checkmatePromptWhite = document.querySelector(".checkmatePromptWhite")
    checkmatePromptWhite.style.left = "200px"
  }

  else if (board.isCheckWhite) {
    let checkPromptWhite = document.querySelector(".checkPromptWhite")
    checkPromptWhite.style.left = "200px"
  }
  else if (board.isCheckBlack) {
    let checkPromptBlack = document.querySelector(".checkPromptBlack")
    checkPromptBlack.style.left = "200px"
  }

  board.renderBoard(board.promotingPawnX, board.promotingPawnY)
}