/*
  Runs the game
*/

import {Board, Piece, Player} from "./model";

export class Game {
  private _currentTurn: Piece;
  private _currentStep: number;
  private _currentBoard: Board;
  private _winner: Piece;

  constructor(private player1: Player, private player2: Player) {
    if (!player1 || !player2 || !player1.label || !player1.nextMove || !player2.label || !player2.nextMove) {
      throw new Error('One of the player objects is invalid');
    }
    this._currentBoard = new Board();
    this._currentTurn = Piece.W;
    this._currentStep = 0;
    this._winner = null;
  }

  public get currentBoardCopy(): Board {
    // Always copy to prevent modification
    return new Board(this._currentBoard);
  }

  public get currentTurn(): Piece {
    return this._currentTurn;
  }

  public get currentStep(): number {
    return this._currentStep;
  }

  public get isComplete(): boolean {
    return this._currentBoard.emptySpacesRemaining === 0 || !!this._winner; // In case of forfeit
  }

  public get winner(): Piece {
    return this._winner;
  }

  public get isTie(): boolean {
    return this.isComplete && !this.winner;
  }

  public static oppositePlayer(p: Piece): Piece {
    if (!p) {
      return null;
    } else {
      return (p===Piece.W) ? Piece.B : Piece.W;
    }
  }

  public playerByPiece(piece: Piece): Player {
    const player: Player = (piece === Piece.W) ? this.player1: this.player2;
    return player;
  }

  public advance(): Board {
    let rval: Board = null;
    if (this.isComplete) {
      // Already done
    } else {
      const player: Player = this.playerByPiece(this.currentTurn);

      // Board is copied each time in case the player accidentally modifies it somehow
      const move: [number,number] = player.nextMove(this.currentTurn, this.currentBoardCopy);
      if (!this._currentBoard.validMove(this.currentTurn, move)) {
        console.log(this.currentTurn + ' attempted an invalid move, forfeits');
        this._winner = Game.oppositePlayer(this.currentTurn);
      } else {
        this._currentBoard.setValue(this.currentTurn, move);
      }
      console.log(player.label + ' ('+this._currentTurn+') selects ' + JSON.stringify(move) + ' board is now ('+this.currentStep+')');
      console.log(this._currentBoard.toString());

      this._currentStep++;
      this._currentTurn = Game.oppositePlayer(this._currentTurn);
    }
    if (this._currentBoard.isBoardFull) {
      const whiteSpace: number = this._currentBoard.piecesFound(Piece.W);
      if (whiteSpace>32) {
        this._winner = Piece.W;
      } else if (whiteSpace<32) {
        this._winner = Piece.B;
      }
    }
    return this.currentBoardCopy;
  }

  public run(): Board {
    let next: Board = this.advance();
    while (!this.isComplete) {
      next = this.advance();
    }
    if (this.isTie) {
      console.log('The result is a tie');
    } else {
      console.log(this.playerByPiece(this.winner).label + ' ('+this.winner + ') Wins, '+next.piecesFound(this.winner) + ' to ' + next.piecesFound(Game.oppositePlayer(this.winner)));
    }

    return next;
  }

}
