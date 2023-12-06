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
  state: CellState;
  bombNeighboors: number | null;
};

export type CellStatus = 'Bomb' | 'Number' | 'Empty';
export type CellState = 'Open' | 'Closed' | 'Flagged';

const BOARD_WIDTH = 5;
const BOARD_HEIGHT = 5;
const N_BOMBS = 3;

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
    [...Array(BOARD_WIDTH).keys()].forEach((item, xIndex) => {
      this.board[xIndex] = [];
      [...Array(BOARD_HEIGHT).keys()].forEach((item, yIndex) => {
        this.board[xIndex][yIndex] = {
          coords: { x: xIndex, y: yIndex },
          status: 'Empty',
          state: 'Closed',
          bombNeighboors: null,
        };
      });
    });
  }

  // Desse jeito pode ter menos de n_bombs se acabar repetindo as coords random
  choseBombCells(n_bombs: number) {
    if (n_bombs >= BOARD_WIDTH * BOARD_HEIGHT) return;
    while (n_bombs > 0) {
      const x = Math.floor(Math.random() * BOARD_WIDTH);
      const y = Math.floor(Math.random() * BOARD_HEIGHT);
      if (this.board[x][y].status !== 'Bomb') {
        this.board[x][y].status = 'Bomb';
        n_bombs--;
      }
    }
  }

  neighboorsCoords(coords: Coords) {
    const { x, y } = coords;
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
    const neighboors = this.neighboorsCoords(cell.coords);
    let bombs = 0;
    neighboors.forEach(({ x, y }) => {
      if (x >= 0 && x < BOARD_WIDTH && y >= 0 && y < BOARD_HEIGHT)
        if (this.board[x][y].status === 'Bomb') bombs++;
    });
    return bombs;
  }

  setBombNeighboorsCount() {
    for (let x = 0; x < BOARD_WIDTH; x++) {
      for (let y = 0; y < BOARD_HEIGHT; y++) {
        const bombNeighboors = this.checkNeighboors(this.board[x][y]);
        if (bombNeighboors) {
          this.board[x][y].status = 'Number';
          this.board[x][y].bombNeighboors = bombNeighboors;
        }
      }
    }
  }

  floodFill(coords: Coords) {
    const { x, y } = coords;
    if (
      this.board[x][y].status !== 'Empty' ||
      this.board[x][y].state !== 'Closed'
    )
      return;
    this.board[x][y].state = 'Open';

    this.neighboorsCoords(coords).forEach((item) => {
      const { x, y } = item;
      if (x >= 0 && x < BOARD_WIDTH && y >= 0 && y < BOARD_HEIGHT)
        this.floodFill(item);
    });
  }

  updateBoard(coords: Coords) {
    const { x, y } = coords;
    console.log(this.board[x][y].status);
    switch (this.board[x][y].status) {
      case 'Bomb':
        window.alert('Game over.');
        break;
      case 'Number':
        this.board[x][y].state = 'Open';
        break;
      case 'Empty':
        this.floodFill(coords);
        break;
      default:
        //eslint-disable-next-line no-case-declarations, @typescript-eslint/no-unused-vars
        // const _exhaustiveCheck: never = this.board[x][y].status;
        break;
    }
  }
}
