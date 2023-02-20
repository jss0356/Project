//by default, this will create a chess game piece of type "Empty"
export default class ChessPiece{
  constructor(pieceName = "Empty", pieceColor = "NoColor"){
    this.pieceName = pieceName
    this.pieceColor = pieceColor
    this.possibleMoves = []
    this.isChecking = false
  }
}