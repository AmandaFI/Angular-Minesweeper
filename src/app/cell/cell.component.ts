import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CellState, CellStatus, Coords } from '../board/board.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cell.component.html',
  styleUrl: './cell.component.css',
})
export class CellComponent {
  @Input() xCoord: number | null = null;
  @Input() yCoord: number | null = null;
  @Input() state: CellState | null = null;
  @Input() status: CellStatus | null = null;
  @Input() bombNeighboors: number | null = null;

  @Output() cellClickedEvent = new EventEmitter<Coords>();

  constructor() {}

  updateBoard() {
    if (this.state !== 'Open' && this.xCoord !== null && this.yCoord !== null)
      this.cellClickedEvent.emit({ x: this.xCoord, y: this.yCoord });
  }
}
