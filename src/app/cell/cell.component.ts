import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CellState, CellStatus, Coords } from '../board/board.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cell.component.html',
  styleUrl: './cell.component.css',
})
export class CellComponent implements OnInit {
  @Input() xCoord: number | null = null;
  @Input() yCoord: number | null = null;
  @Input() state: CellState | null = null;
  @Input() status: CellStatus | null = null;
  @Input() bombNeighboors: number | null = null;

  @Output() cellClickedEvent = new EventEmitter<Coords>();

  styles: Record<string, string> = {};
  singleClickTimeout: any;

  // constructor rda antes de settar as properties recebidas por input
  // ngOnInit roda depois, ou seja, essas variaveis já tem valor

  constructor() {}

  ngOnInit(): void {
    this.styles = {
      width: '2rem',
      height: '2rem',
      'font-style': 'normal',
    };
  }

  cellClick() {
    this.singleClickTimeout = setTimeout(() => {
      if (this.state !== 'Open' && this.xCoord !== null && this.yCoord !== null)
        this.cellClickedEvent.emit({ x: this.xCoord, y: this.yCoord });
    }, 1000);
  }

  cellDoubleClick() {
    clearTimeout(this.singleClickTimeout);
    this.singleClickTimeout = undefined;
    console.log('double');
  }
}
