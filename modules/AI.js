
import ChessPiece from './ChessPiece.js'

export default class AI {
  constructor() {
    //the color the AI will play for
    this.colorAI = ""
    //the max depth for minimaxAB
    this.maxDepth = ""
    //the maximizing player for minimaxAB
    this.MAXIMIZING_PLAYER = "Black"
    //depth 0 nodes from minimaxAB, representing all possible moves the AI could make. One of these moves is the move the AI wants to make determined by finding matching heuristic value.
    this.totalMoveSpace = []
    //the actual move the AI wants to make given current board state.
    this.nextMove = {}
  }

  //returns numerical heuristic value given board state.
  heuristicEvaluator(currBoardState) {
    //first heuristic is piece weight heuristic. This models material advantage/disadvantage.



    
    let currHeuristicValue = 0
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        let currPiece = currBoardState[i][j]
        if (currPiece.pieceColor === "White") {

          if (currPiece.pieceName === "Queen") {
            currHeuristicValue = currHeuristicValue - 929
          }
          else if (currPiece.pieceName === "Rook") {
            currHeuristicValue = currHeuristicValue - 479
          }
          else if (currPiece.pieceName === "Bishop") {
            currHeuristicValue = currHeuristicValue - 320
          }
          else if (currPiece.pieceName === "Knight") {
            currHeuristicValue = currHeuristicValue - 280
          }
          else if (currPiece.pieceName === "Pawn") {
            currHeuristicValue = currHeuristicValue - 100
          }
          else if (currPiece.pieceName === "King") {
            currHeuristicValue = currHeuristicValue - 60000
          }
        }
        else if (currPiece.pieceColor === "Black") {

          if (currPiece.pieceName === "Queen") {
            currHeuristicValue = currHeuristicValue + 929
          }
          else if (currPiece.pieceName === "Rook") {
            currHeuristicValue = currHeuristicValue + 479
          }
          else if (currPiece.pieceName === "Bishop") {
            currHeuristicValue = currHeuristicValue + 320
          }
          else if (currPiece.pieceName === "Knight") {
            currHeuristicValue = currHeuristicValue + 280
          }
          else if (currPiece.pieceName === "Pawn") {
            currHeuristicValue = currHeuristicValue + 100
          }
          else if (currPiece.pieceName === "King") {
            currHeuristicValue = currHeuristicValue + 60000
          }
        }
      }
    }

    //next heuristic is piece square tables heuristic. Models favorable and unfavorable positioning of pieces.
    let pst_w = {
      'pawn': [
        [100, 100, 100, 100, 105, 100, 100, 100],
        [78, 83, 86, 73, 102, 82, 85, 90],
        [7, 29, 21, 44, 40, 31, 44, 7],
        [-17, 16, -2, 15, 14, 0, 15, -13],
        [-26, 3, 10, 9, 6, 1, 0, -23],
        [-22, 9, 5, -11, -10, -2, 3, -19],
        [-31, 8, -7, -37, -36, -14, 3, -31],
        [0, 0, 0, 0, 0, 0, 0, 0]
      ],
      'knight': [
        [-66, -53, -75, -75, -10, -55, -58, -70],
        [-3, -6, 100, -36, 4, 62, -4, -14],
        [10, 67, 1, 74, 73, 27, 62, -2],
        [24, 24, 45, 37, 33, 41, 25, 17],
        [-1, 5, 31, 21, 22, 35, 2, 0],
        [-18, 10, 13, 22, 18, 15, 11, -14],
        [-23, -15, 2, 0, 2, 0, -23, -20],
        [-74, -23, -26, -24, -19, -35, -22, -69]
      ],
      'bishop': [
        [-59, -78, -82, -76, -23, -107, -37, -50],
        [-11, 20, 35, -42, -39, 31, 2, -22],
        [-9, 39, -32, 41, 52, -10, 28, -14],
        [25, 17, 20, 34, 26, 25, 15, 10],
        [13, 10, 17, 23, 17, 16, 0, 7],
        [14, 25, 24, 15, 8, 25, 20, 15],
        [19, 20, 11, 6, 7, 6, 20, 16],
        [-7, 2, -15, -12, -14, -15, -10, -10]
      ],
      'rook': [
        [35, 29, 33, 4, 37, 33, 56, 50],
        [55, 29, 56, 67, 55, 62, 34, 60],
        [19, 35, 28, 33, 45, 27, 25, 15],
        [0, 5, 16, 13, 18, -4, -9, -6],
        [-28, -35, -16, -21, -13, -29, -46, -30],
        [-42, -28, -42, -25, -25, -35, -26, -46],
        [-53, -38, -31, -26, -29, -43, -44, -53],
        [-30, -24, -18, 5, -2, -18, -31, -32]
      ],
      'queen': [
        [6, 1, -8, -104, 69, 24, 88, 26],
        [14, 32, 60, -10, 20, 76, 57, 24],
        [-2, 43, 32, 60, 72, 63, 43, 2],
        [1, -16, 22, 17, 25, 20, -13, -6],
        [-14, -15, -2, -5, -1, -10, -20, -22],
        [-30, -6, -13, -11, -16, -11, -16, -27],
        [-36, -18, 0, -19, -15, -15, -21, -38],
        [-39, -30, -31, -13, -31, -36, -34, -42]
      ],
      'king': [
        [4, 54, 47, -99, -99, 60, 83, -62],
        [-32, 10, 55, 56, 56, 55, 10, 3],
        [-62, 12, -57, 44, -67, 28, 37, -31],
        [-55, 50, 11, -4, -19, 13, 0, -49],
        [-55, -43, -52, -28, -51, -47, -8, -50],
        [-47, -42, -43, -79, -64, -32, -29, -32],
        [-4, 3, -14, -50, -57, -18, 13, 4],
        [17, 30, -3, -14, 6, -1, 40, 18]
      ]
    };
    var pst_b = {
      'pawn': pst_w['pawn'].slice().reverse(),
      'knight': pst_w['knight'].slice().reverse(),
      'bishop': pst_w['bishop'].slice().reverse(),
      'rook': pst_w['rook'].slice().reverse(),
      'queen': pst_w['queen'].slice().reverse(),
      'king': pst_w['king'].slice().reverse()
    }


    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        let currPiece = currBoardState[i][j]
        if (currPiece.pieceColor === "White") {
          if (currPiece.pieceName === "King") {
            currHeuristicValue = currHeuristicValue + pst_w.king[i][j]
          }
          else if (currPiece.pieceName === "Queen") {
            currHeuristicValue = currHeuristicValue + pst_w.queen[i][j]
          }
          else if (currPiece.pieceName === "Rook") {
            currHeuristicValue = currHeuristicValue + pst_w.rook[i][j]
          }
          else if (currPiece.pieceName === "Bishop") {
            currHeuristicValue = currHeuristicValue + pst_w.bishop[i][j]
          }
          else if (currPiece.pieceName === "Knight") {
            currHeuristicValue = currHeuristicValue + pst_w.knight[i][j]
          }
          else if (currPiece.pieceName === "Pawn") {
            currHeuristicValue = currHeuristicValue + pst_w.pawn[i][j]
          }
        }
        else if (currPiece.pieceColor === "Black") {
          if (currPiece.pieceName === "King") {
            currHeuristicValue = currHeuristicValue + pst_b.king[i][j]
          }
          else if (currPiece.pieceName === "Queen") {
            currHeuristicValue = currHeuristicValue + pst_b.queen[i][j]
          }
          else if (currPiece.pieceName === "Rook") {
            currHeuristicValue = currHeuristicValue + pst_b.rook[i][j]
          }
          else if (currPiece.pieceName === "Bishop") {
            currHeuristicValue = currHeuristicValue + pst_b.bishop[i][j]
          }
          else if (currPiece.pieceName === "Knight") {
            currHeuristicValue = currHeuristicValue + pst_b.knight[i][j]
          }
          else if (currPiece.pieceName === "Pawn") {
            currHeuristicValue = currHeuristicValue + pst_b.pawn[i][j]
          }
        }
      }
    }

    //return final heuristic (AI evaluation of favorability/unfavorability of current board state).
    //console.log("board state: ", board)
    //console.log("heuristic value: ", currHeuristicValue)
    return currHeuristicValue

  }
  //populates nextMove by determining AI's next move, given the current board state and currDepth starting at maxDepth.
  minimaxAB(currBoardState, currDepth, alpha, beta, playingSide) {
    if (currDepth === this.maxDepth) {

      if(currBoardState.isCheckMateWhite){
        return this.heuristicEvaluator(currBoardState.board) + (500 - (currDepth * 50))
     }
        
     else if(currBoardState.isCheckMateBlack){
      return this.heuristicEvaluator(currBoardState.board) - (500 - (currDepth * 50))
     }
      else if (currBoardState.isCheckWhite){
        return this.heuristicEvaluator(currBoardState.board) + 50
      }
      
      else if (currBoardState.isCheckBlack){
        return this.heuristicEvaluator(currBoardState.board) - 50
      }
         
      return this.heuristicEvaluator(currBoardState.board)
    }

    if (playingSide === this.MAXIMIZING_PLAYER) {
      if (currBoardState.isCheckMateBlack) {
        return this.heuristicEvaluator(currBoardState.board) - (500 - (currDepth * 50))
      }
      else if (currBoardState.isStalemate) {
        return this.heuristicEvaluator(currBoardState.board)
      }
      else if (currBoardState.isCheckBlack) {
        currBoardState.checkHandler("Black")
        let bestHeuristicEval = -Number.MAX_VALUE
        
        for (let i = 0; i < currBoardState.possibleMovesUnderCheckBlack.length; i++) {
          let currPiece = currBoardState.possibleMovesUnderCheckBlack[i].piece
          let currPiecePossibleMoves = currBoardState.possibleMovesUnderCheckBlack[i].possibleMovesCheck
          for (let j = 0; j < currPiecePossibleMoves.length; j++) {
            let backup = currBoardState.board[currPiecePossibleMoves[j].x][currPiecePossibleMoves[j].y]

            currBoardState.board[currPiecePossibleMoves[j].x][currPiecePossibleMoves[j].y] = currPiece
            currBoardState.board[currPiece.positionX][currPiece.positionY] = new ChessPiece("Empty", "NoColor", 1, 1)

            currBoardState.setCheckFlags()
            currBoardState.isDraw()
            currBoardState.setIsCheckmateFlags()

            let heuristicEval = this.minimaxAB(currBoardState, currDepth + 1, alpha, beta, "White") - 50
            if(heuristicEval > bestHeuristicEval && currDepth === 0){
            this.totalMoveSpace.push({x:currPiece.positionX, y:currPiece.positionY, newX: currPiecePossibleMoves[j].x, newY: currPiecePossibleMoves[j].y, heuristic: heuristicEval})
                }
            bestHeuristicEval = Math.max(bestHeuristicEval, heuristicEval)

            currBoardState.board[currPiece.positionX][currPiece.positionY] = currPiece

            currBoardState.board[currPiecePossibleMoves[j].x][currPiecePossibleMoves[j].y] = backup

            currBoardState.setCheckFlags()
            currBoardState.isDraw()
            currBoardState.setIsCheckmateFlags()


            alpha = Math.max(alpha, bestHeuristicEval)
            if (beta <= alpha) {
              break;
            }

          }

          if (beta <= alpha) {
            break;
          }
        }
        return bestHeuristicEval
      }
      else {

        let bestHeuristicEval = -Number.MAX_VALUE
        
        for (let i = 0; i < 8; i++) {
          for (let j = 0; j < 8; j++) {
            if (currBoardState.board[i][j].pieceName !== "Empty" && currBoardState.board[i][j].pieceColor === "Black") {
              if (currBoardState.board[i][j].pieceName === "Rook") {
                currBoardState.moveHandlerRook(i, j)
              }
              if (currBoardState.board[i][j].pieceName === "Queen") {
                currBoardState.moveHandlerQueen(i, j)
              }
              if (currBoardState.board[i][j].pieceName === "Knight") {
                currBoardState.moveHandlerKnight(i, j)
              }
              if (currBoardState.board[i][j].pieceName === "Pawn") {
                currBoardState.moveHandlerPawn(i, j)
              }
              if (currBoardState.board[i][j].pieceName === "Bishop") {
                currBoardState.moveHandlerBishop(i, j)
              }
              if(currBoardState.board[i][j].pieceName === "King"){
                currBoardState.moveHandlerKing(i, j)
              }
            }
          }
        }

        for(let i = 0; i < 8; i++){
          for(let j = 0; j < 8; j++){
            if (currBoardState.board[i][j].pieceName !== "Empty" && currBoardState.board[i][j].pieceColor === "Black") {
              
              let currPiece = currBoardState.board[i][j]
              for(let k = 0; k < currPiece.possibleMoves.length; k++){
              
                let possibleMoveX = currPiece.possibleMoves[k].x
                let possibleMoveY = currPiece.possibleMoves[k].y

                let backup = currBoardState.board[currPiece.possibleMoves[k].x][currPiece.possibleMoves[k].y]
                currBoardState.board[currPiece.possibleMoves[k].x][currPiece.possibleMoves[k].y] = currPiece
                currBoardState.board[currPiece.positionX][currPiece.positionY] = new ChessPiece("Empty", "NoColor", 1, 1)
                
                currBoardState.setCheckFlags()
                currBoardState.isDraw()
                currBoardState.setIsCheckmateFlags()

                let heuristicEval = this.minimaxAB(currBoardState, currDepth + 1, alpha, beta, "White") + 50
                if(heuristicEval > bestHeuristicEval && currDepth === 0){
            this.totalMoveSpace.push({x:i, y:j, newX: possibleMoveX, newY: possibleMoveY, heuristic: heuristicEval})
                }
                bestHeuristicEval = Math.max(bestHeuristicEval, heuristicEval)

                currBoardState.board[currPiece.positionX][currPiece.positionY] = currPiece
                currBoardState.board[possibleMoveX][possibleMoveY] = backup

                currBoardState.setCheckFlags()
                currBoardState.isDraw()
                currBoardState.setIsCheckmateFlags()


                
                alpha = Math.max(alpha, bestHeuristicEval)
  
                if (beta <= alpha) {
                  break;
                } 
              }
              
              if (beta <= alpha) {
                break;
              }
              
            }
          }
          
          if (beta <= alpha) {
            break;
          } 
        }
        return bestHeuristicEval


      }
    }
    else {
      if (currBoardState.isCheckMateWhite) {
        return this.heuristicEvaluator(currBoardState.board) + (500 - (currDepth * 50))
      }
      else if (currBoardState.isStalemate) {
        return this.heurisiticEvaluator(currBoardState.board)
      }
      else if (currBoardState.isCheckWhite) {
        currBoardState.checkHandler("White")
        
        let bestHeuristicEval = Number.MAX_VALUE
        for (let i = 0; i < currBoardState.possibleMovesUnderCheckWhite.length; i++) {
          let currPiece = currBoardState.possibleMovesUnderCheckWhite[i].piece
          let currPiecePossibleMoves = currBoardState.possibleMovesUnderCheckWhite[i].possibleMovesCheck
          for (let j = 0; j < currPiecePossibleMoves.length; j++) {
            let backup = currBoardState.board[currPiecePossibleMoves[j].x][currPiecePossibleMoves[j].y]
            console.log("before ", currPiecePossibleMoves[j].x, currPiecePossibleMoves[j].y)
            
            currBoardState.board[currPiecePossibleMoves[j].x][currPiecePossibleMoves[j].y] = currPiece
            currBoardState.board[currPiece.positionX][currPiece.positionY] = new ChessPiece("Empty", "NoColor", 1, 1)

            currBoardState.setCheckFlags()
            currBoardState.isDraw()
            currBoardState.setIsCheckmateFlags()

            let heuristicEval = this.minimaxAB(currBoardState, currDepth + 1, alpha, beta, "Black")
          if(heuristicEval < bestHeuristicEval && currDepth === 0){
            this.totalMoveSpace.push({x:currPiece.positionX, y:currPiece.positionY, newX: currPiecePossibleMoves[j].x, newY: currPiecePossibleMoves[j].y, heuristic: heuristicEval})
                }

            bestHeuristicEval = Math.min(bestHeuristicEval, heuristicEval)

            currBoardState.board[currPiece.positionX][currPiece.positionY] = currPiece

            currBoardState.board[currPiecePossibleMoves[j].x][currPiecePossibleMoves[j].y] = backup

            currBoardState.setCheckFlags()
            currBoardState.isDraw()
            currBoardState.setIsCheckmateFlags()

            beta = Math.min(beta, bestHeuristicEval)

            if (beta <= alpha) {
              break;
            }

          }

          if (beta <= alpha) {
            break;
          }
        }
        console.log("returning")
        return bestHeuristicEval

      }
      else {
        let bestHeuristicEval = Number.MAX_VALUE

        for (let i = 0; i < 8; i++) {
          for (let j = 0; j < 8; j++) {
            if (currBoardState.board[i][j].pieceName !== "Empty" && currBoardState.board[i][j].pieceColor === "White") {
              if (currBoardState.board[i][j].pieceName === "Rook") {
                currBoardState.moveHandlerRook(i, j)
              }
              if (currBoardState.board[i][j].pieceName === "Queen") {
                currBoardState.moveHandlerQueen(i, j)
              }
              if (currBoardState.board[i][j].pieceName === "Knight") {
                currBoardState.moveHandlerKnight(i, j)
              }
              if (currBoardState.board[i][j].pieceName === "Pawn") {
                currBoardState.moveHandlerPawn(i, j)
              }
              if (currBoardState.board[i][j].pieceName === "Bishop") {
                currBoardState.moveHandlerBishop(i, j)
              }
              if(currBoardState.board[i][j].pieceName === "King"){
                currBoardState.moveHandlerKing(i, j)
              }
            }
          }
        }

        for(let i = 0; i < 8; i++){
          for(let j = 0; j < 8; j++){
            if (currBoardState.board[i][j].pieceName !== "Empty" && currBoardState.board[i][j].pieceColor === "White") {
              let currPiece = currBoardState.board[i][j]
              for(let k = 0; k < currPiece.possibleMoves.length; k++){
                let possibleMoveX = currPiece.possibleMoves[k].x
                let possibleMoveY = currPiece.possibleMoves[k].y
                let backup = currBoardState.board[currPiece.possibleMoves[k].x][currPiece.possibleMoves[k].y]
                currBoardState.board[currPiece.possibleMoves[k].x][currPiece.possibleMoves[k].y] = currPiece
                currBoardState.board[currPiece.positionX][currPiece.positionY] = new ChessPiece("Empty", "NoColor", 1, 1)
                
                currBoardState.setCheckFlags()
                currBoardState.isDraw()
                currBoardState.setIsCheckmateFlags()

                let heuristicEval = this.minimaxAB(currBoardState, currDepth + 1, alpha, beta, "Black")
                if(heuristicEval < bestHeuristicEval && currDepth === 0){
                  console.log("piece to move: ", currPiece,  possibleMoveX, possibleMoveY, "heuristic value: ", this.heuristicEvaluator(currBoardState.board))
                  this.totalMoveSpace.push({x:i, y:j, newX: possibleMoveX, newY: possibleMoveY, heuristic: heuristicEval})
                }
                bestHeuristicEval = Math.min(bestHeuristicEval, heuristicEval)

                currBoardState.board[currPiece.positionX][currPiece.positionY] = currPiece
                currBoardState.board[possibleMoveX][possibleMoveY] = backup

                currBoardState.setCheckFlags()
                currBoardState.isDraw()
                currBoardState.setIsCheckmateFlags()


                
                beta = Math.min(beta, bestHeuristicEval)
  
                if (beta <= alpha) {
                  break;
                } 
              }
              
              if (beta <= alpha) {
                break;
              }
              
            }
          }
          
          if (beta <= alpha) {
            break;
          } 
        }
                return bestHeuristicEval
      }
    }
  }


}