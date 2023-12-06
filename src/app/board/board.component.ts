import { Component } from '@angular/core';
import { CellComponent } from '../cell/cell.component';
import { CommonModule } from '@angular/common';

export type Coords = {
  x: number;
  y: number;
};

export type Cell = {
  coords: Coords;
  status: CellStatus;
  opened: boolean;
  bombNeighboors: number | null;
};

export type CellStatus = 'Bomb' | 'Number' | 'Empty';

const BOARD_SIZE = 10;
const N_BOMBS = 50;

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CellComponent, CommonModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css',
})
export class BoardComponent {
  board: Cell[][] = [];
  bombCellsCoords: number[] = [];

  constructor() {
    this.initializeGame();
  }

  initializeGame() {
    this.fillBoard();
    this.choseBombCells(N_BOMBS);
    this.setBombNeighboorsCount();
  }

  fillBoard() {
    [...Array(BOARD_SIZE).keys()].forEach((item, xIndex) => {
      this.board[xIndex] = [];
      [...Array(BOARD_SIZE).keys()].forEach((item, yIndex) => {
        this.board[xIndex][yIndex] = {
          coords: { x: xIndex, y: yIndex },
          status: 'Empty',
          opened: false,
          bombNeighboors: null,
        };
      });
    });
  }

  // Desse jeito pode ter menos de n_bombs se acabar repetindo as coords random
  choseBombCells(n_bombs: number) {
    [...Array(n_bombs).keys()].forEach((item) => {
      const x = Math.floor(Math.random() * BOARD_SIZE);
      const y = Math.floor(Math.random() * BOARD_SIZE);

      this.board[x][y].status = 'Bomb';
    });
  }

  neighboorsCoords(cell: Cell) {
    const { x, y } = cell.coords;
    const coords = [];
    return [
      { x: x - 1, y: y - 1 },
      { x: x - 1, y },
      { x: x - 1, y: y + 1 },
      { x, y: y - 1 },
      { x, y: y + 1 },
      { x: x + 1, y: y - 1 },
      { x: x + 1, y },
      { x: x + 1, y: y + 1 },
    ];
  }

  checkNeighboors(cell: Cell) {
    if (cell.status === 'Bomb') return 0;
    const neighboors = this.neighboorsCoords(cell);
    let bombs = 0;
    neighboors.forEach(({ x, y }) => {
      if (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE)
        if (this.board[x][y].status === 'Bomb') bombs++;
    });
    return bombs;
  }

  setBombNeighboorsCount() {
    for (let x = 0; x < BOARD_SIZE; x++) {
      for (let y = 0; y < BOARD_SIZE; y++) {
        const bombNeighboors = this.checkNeighboors(this.board[x][y]);
        if (bombNeighboors) {
          this.board[x][y].status = 'Number';
          this.board[x][y].bombNeighboors = bombNeighboors;
        }
      }
    }
  }

  updateBoard(coords: Coords) {
    const { x, y } = coords;
    if (this.board[x][y].status === 'Bomb') window.alert('Game over.');
  }
}
