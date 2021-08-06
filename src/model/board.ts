/*
  Wrapper for the board data
*/

import {Piece} from "./piece";

export class Board {
  private state: Piece[][] = Board.createDefaultState();

  constructor(toCopy?: Board) {
    if (toCopy) {

      this.state = toCopy.fullBoard;
    }
  }

  public get fullBoard(): Piece[][] {
    let rval: Piece[][]=[];
    for (let y=0;y<8;y++){
      rval.push(Object.assign([], this.state[y]));
    }
    return rval;
  }

  public static createDefaultState(): Piece[][] {
    const emptyRow: Piece[] = [null,null,null,null,null,null,null,null];
    const rval: Piece[][] = [
      Object.assign([], emptyRow),
      Object.assign([], emptyRow),
      Object.assign([], emptyRow),
      Object.assign([], emptyRow),
      Object.assign([], emptyRow),
      Object.assign([], emptyRow),
      Object.assign([], emptyRow),
      Object.assign([], emptyRow)
    ];
    rval[3][3] = Piece.W;
    rval[3][4] = Piece.B;
    rval[4][3] = Piece.B;
    rval[4][4] = Piece.W;
    return rval;
  }

  public valueOfXY(column: number, row: number): Piece {
    if (column === null || column===undefined || row===null || row===undefined
        || row<0 || row > 7 || column < 0 || column > 7) {
      throw new Error('Invalid row or column : '+column+' x ' + row);
    }
    return this.state[row][column];
  }


  public valueOf(coords: [number,number]): Piece {
    if (!this.validCoords(coords)) {
      throw new Error('Invalid coordinates : '+JSON.stringify(coords));
    }
    return this.valueOfXY(coords[0],coords[1]);
  }

  public validCoords(coords: [number,number]): boolean {
    return (coords && coords.length ===2 && coords[0]>=0 && coords[0]<8  && coords[1]>=0 && coords[1]<8);
  }

  public validMove(piece: Piece, coords: [number,number]): boolean {
    let rval: boolean = true;
    if (piece === null || piece === undefined) {
      rval = false;
    } else {
      const curValue: Piece = this.valueOfXY(coords[0], coords[1]);
      if (curValue !== null) {
        rval = false;
      }
    }
    return rval;
  }

  private findAndApply(piece: Piece, startCoords: [number, number], tx: (coords: [number,number])=>[number,number]): void {
    const nextPiece: [number,number] = this.findNextPiece(piece, startCoords, tx);
    if (nextPiece) {
      this.applyChange(piece, startCoords, nextPiece, tx);
    }
  }

  private applyChange(piece:Piece, startCoords: [number, number], endCoords: [number, number],  tx: (coords: [number,number])=>[number,number]): void {
    if (!piece || !startCoords || !endCoords || !this.validCoords(startCoords) || !this.validCoords(endCoords)) {
      throw new Error('Invalid apply change');
    }
    let cur: [number, number] = startCoords;
    while (this.validCoords(cur) && (cur[0]!==endCoords[0] || cur[1]!=endCoords[1])) {
        cur = tx(cur);
        if (this.validCoords(cur)) {
          this.state[cur[1]][cur[0]] = piece;
        }
    }
  }

  public findNextPiece(piece: Piece, startCoords: [number, number], tx: (coords: [number,number])=>[number,number]): [number,number] {
    if (!piece || !this.validCoords(startCoords) || !tx) {
      throw new Error('Invalid find next piece arguments');
    }
    let rval: [number, number] = null;
    let toTest: [number, number] = tx(startCoords);
    let emptyFound: boolean = false;
    while (!rval && !emptyFound && this.validCoords(toTest)) {
      const curValue: Piece = this.valueOf(toTest);
      if (curValue === piece) {
        rval = toTest;
      } else if (curValue===null) {
        emptyFound = true;
      } else {
        toTest = tx(toTest);
      }
    }
    return rval;
  }

  public setValue(piece: Piece, coords: [number,number]): void {
    if (this.validMove(piece, coords)) {
      this.state[coords[1]][coords[0]] = piece;
      this.findAndApply(piece, coords, (c) => [c[0]+1, c[1]]); // East
      this.findAndApply(piece, coords, (c) => [c[0]-1, c[1]]); // West
      this.findAndApply(piece, coords, (c) => [c[0], c[1]+1]); // South
      this.findAndApply(piece, coords, (c) => [c[0], c[1]-1]); // North
      this.findAndApply(piece, coords, (c) => [c[0]+1, c[1]+1]); // Southeast
      this.findAndApply(piece, coords, (c) => [c[0]+1, c[1]-1]); // Northeast
      this.findAndApply(piece, coords, (c) => [c[0]-1, c[1]+1]); // Southwest
      this.findAndApply(piece, coords, (c) => [c[0]-1, c[1]-1]); // Northwest
    } else {
      throw new Error('Invalid move : ' + piece + ' at ' + coords[0] + ' x ' + coords[1]);
    }
  }

  public toString(): string {
    let rval: string = '';
    for (let y=0;y<8;y++) {
      for (let x=0;x<8;x++) {
        const value: Piece = this.valueOfXY(x, y);
        rval += (value) ? value : '.';
      }
      rval += '\n';
    }
    return rval;
  }

  public get emptySpacesRemaining(): number {
    return this.piecesFound(null);
  }

  public piecesFound(type: Piece): number {
    if (type !== null && type !==Piece.W && type!==Piece.B) {
      throw new Error('Invalid type to check : '+type);
    }
    let count: number = 0;
    for (let x=0;x<8;x++) {
      for (let y=0;y<8;y++) {
        const value: Piece = this.valueOfXY(x, y);
        count += (value===type) ? 1 : 0;
      }
    }
    return count;
  }

  public get isBoardFull(): boolean {
    return this.emptySpacesRemaining === 0 ;
  }

  public get spacesConsumed(): number {
    return 64 - this.emptySpacesRemaining;
  }

}
