export type Coords = {
  x: number;
  y: number;
};

export type CellStatus = 'Bomb' | 'Number' | 'Empty';
export type CellState = 'Open' | 'Closed' | 'Flagged';

export class Cell {
  coords: Coords;
  status: CellStatus = 'Empty';
  state: CellState = 'Closed';
  bombNeighboors: number | null = null;

  constructor(coords: Coords) {
    this.coords = coords;
  }

  open() {
    this.state = 'Open';
  }

  flag() {
    if (this.state === 'Open') return;
    this.state = this.state === 'Closed' ? 'Flagged' : 'Closed';
  }

  neighboors() {
    const { x, y } = this.coords;
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
}
