import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Cell, Coords } from '../board/board.component';
import { CommonModule } from '@angular/common';
import { DoubleClickDirective } from '../double-click.directive';

@Component({
  selector: 'app-cell',
  standalone: true,
  imports: [CommonModule, DoubleClickDirective],
  templateUrl: './cell.component.html',
  styleUrl: './cell.component.css',
})
export class CellComponent implements OnInit {
  @Input() cell: Cell | null = null;

  @Output() cellClickedEvent = new EventEmitter<Coords>();

  styles: Record<string, string> = {};
  isSingleClick = false;

  // constructor rda antes de settar as properties recebidas por input
  // ngOnInit roda depois, ou seja, essas variaveis já tem valor

  constructor() {}

  ngOnInit(): void {}

  // Using directive
  singleClick(e: MouseEvent) {
    if (
      this.cell?.state !== 'Open' &&
      !(this.cell?.coords.x == null) &&
      !(this.cell?.coords.y == null)
    )
      this.cellClickedEvent.emit({
        x: this.cell.coords.x,
        y: this.cell.coords.y,
      });
  }

  doubleClick(e: MouseEvent) {
    if (!this.cell) return;

    if (this.cell.state === 'Closed') this.cell.state = 'Flagged';
    else if (this.cell.state === 'Flagged') this.cell.state = 'Closed';
  }

  //clear timeout não estava limpando

  // Using directly the events
  // singleClick() {
  //   this.isSingleClick = true;
  //   setTimeout(() => {
  //     if (!this.isSingleClick) return;
  //     if (this.state !== 'Open' && this.xCoord !== null && this.yCoord !== null)
  //       this.cellClickedEvent.emit({ x: this.xCoord, y: this.yCoord });
  //   }, 1000);
  // }

  // doubleClick() {
  //   this.isSingleClick = false;
  // }
}
