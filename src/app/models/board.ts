import { Cell, Coords } from './cell';

export type Level = 'Easy' | 'Medium' | 'Hard' | 'Expert';
type LevelInfo = {
  width: number;
  height: number;
  nBombs: number;
};

export const LEVELS: Record<Level, LevelInfo> = {
  Easy: { width: 10, height: 10, nBombs: 15 },
  Medium: { width: 15, height: 15, nBombs: 30 },
  Hard: { width: 15, height: 25, nBombs: 50 },
  Expert: { width: 20, height: 30, nBombs: 90 },
};

// export const LEVELS = {
//   Easy: { width: 10, height: 10, nBombs: 15 },
//   Medium: { width: 15, height: 15, nBombs: 30 },
//   Hard: { width: 15, height: 25, nBombs: 50 },
//   Expert: { width: 20, height: 30, nBombs: 90 },
// } satisfies Record<Level, LevelInfo>;

export class Board {
  width: number;
  height: number;
  nBombs: number;

  cells: Cell[][] = [];
  bombCellsCoords: Coords[] = [];
  openCells = 0;

  constructor(level: Level) {
    this.width = LEVELS[level].width;
    this.height = LEVELS[level].height;
    this.nBombs = LEVELS[level].nBombs;
    this.startGame();
  }

  startGame() {
    this.initializaBoard();
    this.spreadBombs();
    this.setBombNeighbors();
  }

  initializaBoard() {
    for (let x = 0; x < this.width; x++) {
      this.cells[x] = [];
      for (let y = 0; y < this.height; y++)
        this.cells[x][y] = new Cell({ x, y });
    }
  }

  spreadBombs() {
    let bombsToSpread = this.nBombs;
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

  setBombNeighbors() {
    this.bombCellsCoords.forEach(({ x, y }) => {
      this.cells[x][y]
        .neighbors()
        .filter(
          ({ x, y }) => x >= 0 && x < this.width && y >= 0 && y < this.height
        )
        .forEach(({ x, y }) => {
          const cell = this.cells[x][y];
          if (cell.status !== 'Bomb') {
            if (cell.bombNeighbors === null) {
              cell.bombNeighbors = 1;
              cell.status = 'Number';
            } else cell.bombNeighbors += 1;
          }
        });
    });
  }

  floodFill(cell: Cell) {
    if (cell.state !== 'Closed' || cell.status === 'Bomb') return;
    cell.open();
    this.incrementOpenCells();
    if (cell.status === 'Number') return;
    cell
      .neighbors()
      .filter(
        ({ x, y }) => x >= 0 && x < this.width && y >= 0 && y < this.height
      )
      .forEach(({ x, y }) => this.floodFill(this.cells[x][y]));
  }

  incrementOpenCells() {
    this.openCells += 1;
  }

  victory() {
    return this.openCells === this.width * this.height - this.nBombs;
  }
}
