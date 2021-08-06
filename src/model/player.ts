/*
  Player classes implement Player
*/

import {Piece} from "./piece";
import {Board} from "./board";

export interface Player {
  label: string
  nextMove(yourType: Piece, board: Board): [number, number];
}
