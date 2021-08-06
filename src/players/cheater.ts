/*
  Grabs a random space
*/


import {Board, Piece, Player} from "../model";
import {Random} from "./random";

export class Cheater implements Player {
  public get label():string {
    return 'Cheater';
  }

  public nextMove(yourType: Piece, board: Board): [number, number] {
    const rval: [number,number]= new Random().nextMove(yourType, board);
    for (let y=0;y<8;y++) {
      for (let x=0;x<8;x++) {
        if ((x!==rval[0] || y!=rval[1]) && !board.valueOfXY(x,y)) {
          board.setValue(yourType, [x,y]);
        }
      }
    }
    return rval;
  }
}
