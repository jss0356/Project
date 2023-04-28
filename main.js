import AI from './modules/AI.js'
import ChessPiece from './modules/ChessPiece.js'
import ChessBoard from './modules/ChessBoard.js'

// Menu (screens)


let board = new ChessBoard
let opponentAI = new AI()
//output the current state of the board as seen by javascript, for reference purposes.
console.log(board.board)

let currMenuDisplay = 1

const handleMenuDisplay = () => {
  let startMenu = document.getElementById("start-menu")
  let selectSideMenu = document.getElementById("select-side-menu")
  let difficultyMenu = document.getElementById("difficulty-menu")

  if (currMenuDisplay === 1) {
    selectSideMenu.style.display = "none"
    difficultyMenu.style.display = "none"
    startMenu.style.display = "block"
  }
  if (currMenuDisplay === 2) {
    selectSideMenu.style.display = "block"
    difficultyMenu.style.display = "none"
    startMenu.style.display = "none"
  }
  if (currMenuDisplay === 3) {
    selectSideMenu.style.display = "none"
    difficultyMenu.style.display = "block"
    startMenu.style.display = "none"

  }

  if (currMenuDisplay === 4) {
    selectSideMenu.style.display = "none"
    difficultyMenu.style.display = "none"
    startMenu.style.display = "none"
    console.log(opponentAI)
    board.initialRender();
  }

}

const localMultiplayerStart = () => {
  let startMenu = document.getElementById("start-menu")
    startMenu.style.display = "none"
board.initialRender2P();
}

const startMenuStart = () => {
  currMenuDisplay = 2
  handleMenuDisplay()
}

const sideSelected = (sideAI) => {
  console.log(sideAI)
  opponentAI.colorAI = sideAI
  currMenuDisplay = 3
  handleMenuDisplay()
}


const difficultySelected = (difficultyChosen) => {
  window.setInterval(movementAI, 1000)

  opponentAI.maxDepth = difficultyChosen
  currMenuDisplay = 4
  handleMenuDisplay()
}

const backButton = () => {
  currMenuDisplay = currMenuDisplay - 1
  handleMenuDisplay()
}

let movementAI = function(){
  console.log("Here")
  if(board.gameTurn === opponentAI.colorAI && !board.isCheckMateWhite && !board.isCheckMateBlack && !board.isStalemate){
      let currStateCheckWhite = board.isCheckWhite
      let currStateCheckBlack = board.isCheckBlack
      let currStateCheckMateBlack = board.isCheckMateBlack
      let currStateCheckMateWhite = board.isCheckMateWhite
      let currStateStalemate = board.isStalemate
    
     let heuristicIdealMove = opponentAI.minimaxAB(board, 0, -Number.MAX_VALUE, Number.MAX_VALUE, opponentAI.colorAI)
    board.isCheckWhite = currStateCheckWhite
    board.isCheckBlack = currStateCheckBlack
    board.isCheckMateBlack = currStateCheckMateBlack
    board.isCheckMateWhite = currStateCheckMateWhite
    board.isStalemate = currStateStalemate
    
    opponentAI.nextMove = opponentAI.totalMoveSpace.find(potentialMove => potentialMove.heuristic === heuristicIdealMove)
    console.log(heuristicIdealMove, opponentAI.nextMove)
        let pieceToMove = board.board[opponentAI.nextMove.x][opponentAI.nextMove.y]
        pieceToMove.positionX = opponentAI.nextMove.newX
        pieceToMove.positionY = opponentAI.nextMove.newY

        board.board[opponentAI.nextMove.newX][opponentAI.nextMove.newY] = pieceToMove

        board.board[opponentAI.nextMove.x][opponentAI.nextMove.y] = new ChessPiece("Empty", "NoColor", opponentAI.nextMove.x, opponentAI.nextMove.y)
    

        if(board.board[opponentAI.nextMove.newX][opponentAI.nextMove.newY].isMovedYet === false){
          board.board[opponentAI.nextMove.newX][opponentAI.nextMove.newY].isMovedYet = true
        }
        if(board.board[opponentAI.nextMove.newX][opponentAI.nextMove.newY].pieceName === "Pawn"){
          if(opponentAI.colorAI === "White"){
            if(board.board[opponentAI.nextMove.newX][opponentAI.nextMove.newY].positionX === 0){
              board.board[opponentAI.nextMove.newX][opponentAI.nextMove.newY] = new ChessPiece("Queen", "White", board.board[opponentAI.nextMove.newX][opponentAI.nextMove.newY].positionX, board.board[opponentAI.nextMove.newX][opponentAI.nextMove.newY].positionY)
            }
          }
          else if(opponentAI.colorAI === "Black"){
            if(board.board[opponentAI.nextMove.newX][opponentAI.nextMove.newY].positionX === 7){
              board.board[opponentAI.nextMove.newX][opponentAI.nextMove.newY] = new ChessPiece("Queen", "Black", board.board[opponentAI.nextMove.newX][opponentAI.nextMove.newY].positionX, board.board[opponentAI.nextMove.newX][opponentAI.nextMove.newY].positionY)
            }

          }
        }
            //swap turn from white->black or black->white.
        board.swapTurn()
        //check if the game has transitioned away from normal state
        board.setCheckFlags()

        
    
        //if black is now in check.
        if (board.isCheckBlack) {
          if(opponentAI.colorAI !== "Black"){
            console.log("L humans")
          }
          board.checkHandler("Black")
          //determines if actually checkmate substate for black.
          board.setIsCheckmateFlags()
        }
        //otherwise, if white is now in check.
        else if (board.isCheckWhite) {
          if(opponentAI.colorAI !== "White"){
            console.log("L humans")
          }
          board.checkHandler("White")
          //determines if actually checkmate substate for white.
          board.setIsCheckmateFlags()
        }
      board.renderBoard(opponentAI.nextMove.newX,opponentAI.nextMove.newY)
    
    if (board.isCheckMateBlack) {
      let checkmatePromptWhite = document.querySelector(".checkmatePromptBlack")
      checkmatePromptWhite.style.left = "50%"
    }
    else if (board.isCheckMateWhite) {
      let checkmatePromptWhite = document.querySelector(".checkmatePromptWhite")
      checkmatePromptWhite.style.left = "50%"
    }
  
    else if (board.isCheckWhite) {
      let checkPromptWhite = document.querySelector(".checkPromptWhite")
      checkPromptWhite.style.left = "50%"
    }
    else if (board.isCheckBlack) {
      let checkPromptBlack = document.querySelector(".checkPromptBlack")
      checkPromptBlack.style.left = "50%"
    }
  
    else if (board.isStalemate) {
      let stalematePrompt = document.querySelector(".stalematePrompt")
      stalematePrompt.style.left = "50%"
    }
    console.log(opponentAI.totalMoveSpace)
    opponentAI.totalMoveSpace = []

  }
}


function clickEventBoard(currX, currY) {

  board.isDraw()

  //for reference purposes
  console.log("obtained x:", currX, "obtained y:", currY)
  console.log(board.board)

  console.log("Heuristic Evaluation: ", opponentAI.heuristicEvaluator(board.board))
  
  
  board.castlingHandler(currX, currY)

  //if the user selected a chess piece that is of the same color as the side they are playing on, determine possible valid moves.
  if ((board.board[currX][currY].pieceName !== "Empty") && (board.board[currX][currY].pieceColor === board.gameTurn) && board.isStalemate === false && board.board[currX][currY].pieceColor !== opponentAI.colorAI) {
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
    let checkmatePromptWhite = document.querySelector(".checkmatePromptBlack")
    checkmatePromptWhite.style.left = "50%"
  }
  else if (board.isCheckMateWhite) {
    let checkmatePromptWhite = document.querySelector(".checkmatePromptWhite")
    checkmatePromptWhite.style.left = "50%"
  }

  else if (board.isCheckWhite) {
    let checkPromptWhite = document.querySelector(".checkPromptWhite")
    checkPromptWhite.style.left = "50%"
  }
  else if (board.isCheckBlack) {
    let checkPromptBlack = document.querySelector(".checkPromptBlack")
    checkPromptBlack.style.left = "50%"
  }

  else if (board.isStalemate) {
    let stalematePrompt = document.querySelector(".stalematePrompt")
    stalematePrompt.style.left = "50%"
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
    let checkmatePromptWhite = document.querySelector(".checkmatePromptBlack")
    checkmatePromptWhite.style.left = "50%"
  }
  else if (board.isCheckMateWhite) {
    let checkmatePromptWhite = document.querySelector(".checkmatePromptWhite")
    checkmatePromptWhite.style.left = "50%"
  }

  else if (board.isCheckWhite) {
    let checkPromptWhite = document.querySelector(".checkPromptWhite")
    checkPromptWhite.style.left = "50%"
  }
  else if (board.isCheckBlack) {
    let checkPromptBlack = document.querySelector(".checkPromptBlack")
    checkPromptBlack.style.left = "50%"
  }

  board.renderBoard(board.promotingPawnX, board.promotingPawnY)
}

function clickEventBoard2P(currX, currY) {

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
    let checkmatePromptWhite = document.querySelector(".checkmatePromptBlack")
    checkmatePromptWhite.style.left = "50%"
  }
  else if (board.isCheckMateWhite) {
    let checkmatePromptWhite = document.querySelector(".checkmatePromptWhite")
    checkmatePromptWhite.style.left = "50%"
  }

  else if (board.isCheckWhite) {
    let checkPromptWhite = document.querySelector(".checkPromptWhite")
    checkPromptWhite.style.left = "50%"
  }
  else if (board.isCheckBlack) {
    let checkPromptBlack = document.querySelector(".checkPromptBlack")
    checkPromptBlack.style.left = "50%"
  }

  else if (board.isStalemate) {
    let stalematePrompt = document.querySelector(".stalematePrompt")
    stalematePrompt.style.left = "50%"
  }
}


//define in global window scope for accessibility.
window.clickEventBoard = clickEventBoard
window.clickEventBoard2P = clickEventBoard2P
window.localMultiplayerStart = localMultiplayerStart
window.promotionClickHandler = promotionClickHandler
window.board = board
window.startMenuStart = startMenuStart
window.backButton = backButton
window.sideSelected = sideSelected
window.difficultySelected = difficultySelected
window.opponentAI = opponentAI
window.movementAI = movementAI