/*
  Just grabs the first open space starting from the upper left corner
*/

import {Board, Piece, Player} from "../model";

export class FirstOpen implements Player {
  public get label():string {
    return 'FirstOpen';
  }

  public nextMove(yourType: Piece, board: Board): [number, number] {
    let xToUse: number = null;
    let yToUse: number = null;
    for (let x=0;x<8 && xToUse===null;x++) {
      for (let y=0;y<8 && yToUse===null;y++) {
        const cur: Piece = board.valueOfXY(x,y);
        if (!cur) {
          xToUse = x;
          yToUse = y;
        }
      }
    }
    return [xToUse, yToUse];
  }

}
