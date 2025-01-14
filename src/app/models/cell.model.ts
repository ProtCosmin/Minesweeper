import { CellState } from "./cellstate.enum";

export class Cell {
  state: CellState;
  adjacentMines: number;
  row: number;
  column: number;

  constructor(row: number, column: number) {
    this.state = CellState.UNREVEALED;
    this.adjacentMines = 0;
    this.row = row;
    this.column = column;
  }

  addAdjacentMine(): void {
    this.adjacentMines++;
  }

  isMine(): boolean {
    return (
      this.state === CellState.MINE || this.state === CellState.FLAGGED_MINE
    );
  }
}
