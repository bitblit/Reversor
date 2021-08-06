/*
  Grabs a random space
*/


import {Board, Piece, Player} from "../model";

export class Random implements Player {
  public get label():string {
    return 'Random';
  }

  public nextMove(yourType: Piece, board: Board): [number, number] {
    let xToUse: number = null;
    let yToUse: number = null;
    while (xToUse === null) {
      const x: number = Math.floor(Math.random() * 8);
      const y: number = Math.floor(Math.random() * 8);
      const cur: Piece = board.valueOfXY(x,y);
      if (!cur) {
        xToUse = x;
        yToUse = y;
      }
    }
    return [xToUse, yToUse];
  }
}
