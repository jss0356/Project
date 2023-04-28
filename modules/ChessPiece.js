//by default, this will create a chess game piece of type "Empty"
export default class ChessPiece {
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
