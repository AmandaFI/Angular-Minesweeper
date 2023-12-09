import { Component } from '@angular/core';
import { CellComponent } from '../cell/cell.component';
import { CommonModule } from '@angular/common';

export type Coords = {
  x: number;
  y: number;
};

export type CellStatus = 'Bomb' | 'Number' | 'Empty';
export type CellState = 'Open' | 'Closed' | 'Flagged';

export type Cell = {
  coords: Coords;
  status: CellStatus;
  state: CellState;
  bombNeighboors: number | null;
};

const BOARD_WIDTH = 15;
const BOARD_HEIGHT = 20;
const N_BOMBS = 30;

// TODO
// - escolher cores
// - colocar icones para bomba e flag
// - botão de reiniciar o jogo
// - quando clicar em bomba, encerrar o jogo
// - permitir escolher entre 3 tamanhos de tabuleir

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
  openCells = 0;

  constructor() {
    this.initializeGame();
  }

  initializeGame() {
    this.fillBoard();
    this.spreadBombs(N_BOMBS);
    this.setCellBombCountNeighboors();
  }

  fillBoard() {
    for (let xIndex = 0; xIndex < BOARD_WIDTH; xIndex++) {
      this.board[xIndex] = [];
      for (let yIndex = 0; yIndex < BOARD_HEIGHT; yIndex++) {
        this.board[xIndex][yIndex] = {
          coords: { x: xIndex, y: yIndex },
          status: 'Empty',
          state: 'Closed',
          bombNeighboors: null,
        };
      }
    }
  }

  spreadBombs(n_bombs: number) {
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
    ].filter(
      ({ x, y }) => x >= 0 && x < BOARD_WIDTH && y >= 0 && y < BOARD_HEIGHT
    );
  }

  countBombNeighboors(cell: Cell) {
    if (cell.status === 'Bomb') return 0;
    const neighboors = this.neighboorsCoords(cell.coords);
    let bombs = 0;
    neighboors.forEach(({ x, y }) => {
      if (this.board[x][y].status === 'Bomb') bombs++;
    });
    return bombs;
  }

  setCellBombCountNeighboors() {
    for (let x = 0; x < BOARD_WIDTH; x++) {
      for (let y = 0; y < BOARD_HEIGHT; y++) {
        const bombNeighboors = this.countBombNeighboors(this.board[x][y]);
        if (bombNeighboors) {
          this.board[x][y].status = 'Number';
          this.board[x][y].bombNeighboors = bombNeighboors;
        }
      }
    }
  }

  victory() {
    return this.openCells === BOARD_WIDTH * BOARD_HEIGHT - N_BOMBS;
  }

  openCell({ x, y }: Coords) {
    this.board[x][y].state = 'Open';
    this.openCells++;
    if (this.victory()) window.alert('Victory!');
  }

  floodFill(coords: Coords) {
    const { x, y } = coords;
    if (
      this.board[x][y].state !== 'Closed' ||
      this.board[x][y].status === 'Bomb'
    )
      return;
    this.openCell(coords);
    if (this.board[x][y].status === 'Number') return;
    this.neighboorsCoords(coords).forEach((item) => this.floodFill(item));
  }

  updateBoard(coords: Coords) {
    const { x, y } = coords;
    switch (this.board[x][y].status) {
      case 'Bomb':
        window.alert('Game over.');
        break;
      case 'Number':
        this.openCell(coords);
        break;
      case 'Empty':
        this.floodFill(coords);
        break;
      default:
        // const _exhaustiveCheck: never = this.board[x][y].status;
        break;
    }
  }
}
