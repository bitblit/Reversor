import {Board} from "./board";
import {Piece} from "./piece";

describe('#spacesConsumed', function () {
  it('should start with 4 spaces taken and 60 remaining', function () {
    const board: Board = new Board();
    expect(board.piecesFound(Piece.B)).toEqual(2);
    expect(board.piecesFound(Piece.W)).toEqual(2);
    expect(board.spacesConsumed).toEqual(4);
    expect(board.spacesConsumed).toEqual(4);
    expect(board.emptySpacesRemaining).toEqual(60);
  });
});
