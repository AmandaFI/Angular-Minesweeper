import { Cell, Coords } from './Cell';

export type Level = 'Easy' | 'Medium' | 'Hard' | 'Expert';
type LevelInfo = {
  width: number;
  height: number;
  n_bombs: number;
};

const levels: Record<Level, LevelInfo> = {
  Easy: { width: 10, height: 10, n_bombs: 15 },
  Medium: { width: 15, height: 15, n_bombs: 30 },
  Hard: { width: 20, height: 20, n_bombs: 40 },
  Expert: { width: 30, height: 30, n_bombs: 60 },
};

export class Board {
  width: number;
  height: number;
  n_bombs: number;

  cells: Cell[][] = [];
  bombCellsCoords: Coords[] = [];
  openCells = 0;

  constructor(level: Level) {
    this.width = levels[level].width;
    this.height = levels[level].height;
    this.n_bombs = levels[level].n_bombs;
    this.startGame();
  }

  startGame() {
    this.initializaBoard();
    this.spreadBombs();
    this.setBombNeighboors();
  }

  initializaBoard() {
    for (let x = 0; x < this.width; x++) {
      this.cells[x] = [];
      for (let y = 0; y < this.height; y++)
        this.cells[x][y] = new Cell({ x, y });
    }
  }

  spreadBombs() {
    let bombsToSpread = this.n_bombs;
    while (bombsToSpread > 0) {
      const x = Math.floor(Math.random() * this.width);
      const y = Math.floor(Math.random() * this.height);
      if (this.cells[x][y].status !== 'Bomb') {
        this.cells[x][y].status = 'Bomb';
        this.bombCellsCoords.push({ x, y });
        bombsToSpread--;
      }
    }
  }

  setBombNeighboors() {
    this.bombCellsCoords.forEach(({ x, y }) => {
      this.cells[x][y]
        .neighboors()
        .filter(
          ({ x, y }) => x >= 0 && x < this.width && y >= 0 && y < this.height
        )
        .forEach(({ x, y }) => {
          const cell = this.cells[x][y];
          if (cell.bombNeighboors === null) {
            cell.bombNeighboors = 1;
            cell.status = 'Number';
          } else cell.bombNeighboors += 1;
        });
    });
  }

  floodFill(cell: Cell) {
    if (cell.state !== 'Closed' || cell.status === 'Bomb') return;
    cell.open();
    if (cell.status === 'Number') return;
    cell
      .neighboors()
      .filter(
        ({ x, y }) => x >= 0 && x < this.width && y >= 0 && y < this.height
      )
      .forEach(({ x, y }) => this.floodFill(this.cells[x][y]));
  }

  incrementOpenCells() {
    this.openCells += 1;
  }

  victory() {
    return this.openCells === this.width * this.height - this.n_bombs;
  }
}
