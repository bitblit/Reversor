/*
  Runs the game
*/

import {Board, Piece, Player} from "./model";

export class Game {
  constructor(private player1: Player, private player2: Player) {
    if (!player1 || !player2 || !player1.label || !player1.nextMove || !player2.label || !player2.nextMove) {
      throw new Error('One of the player objects is invalid');
    }
  }

  public run(): Board {
    const board: Board = new Board();
    let winner: string = null;

    while (!board.isBoardFull && !winner) {
      // Board is copied each time in case the player accidentally modifies it somehow
      const whiteMove: [number,number] = this.player1.nextMove(Piece.W, new Board(board));
      if (!board.validMove(Piece.W, whiteMove)) {
        console.log('White attempted an invalid move, forfeits');
        winner = Piece.B;
      } else {
        board.setValue(Piece.W, whiteMove);
      }
      console.log(this.player1.label + ' (White) selects ' + JSON.stringify(whiteMove) + ' board is now ');
      console.log(board.toString());

      if (!board.isBoardFull) {
        const blackMove: [number,number] = this.player2.nextMove(Piece.B, new Board(board));
        if (!board.validMove(Piece.B, blackMove)) {
          console.log('Black attempted an invalid move, forfeits');
          winner = Piece.W;
        } else {
          board.setValue(Piece.B, blackMove);
        }
        console.log(this.player2.label + ' (Black) selects ' + JSON.stringify(blackMove) + ' board is now ');
        console.log(board.toString());
      }
    }

    if (!winner) {
      const whitePieces: number = board.piecesFound(Piece.W);
      if (whitePieces>32) {
        winner = this.player1.label + ' (White) is the winner';
      } else if (whitePieces<32) {
        winner = this.player2.label + ' (Black) is the winner';
      } else {
        winner = 'There is a TIE';
      }
    }

    console.log(winner);

    return board;
  }

}
