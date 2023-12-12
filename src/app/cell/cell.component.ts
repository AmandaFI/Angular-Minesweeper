import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoubleClickDirective } from '../double-click.directive';
import { Cell } from '../models/cell';
import { Operation } from '../app.component';

@Component({
  selector: 'app-cell',
  standalone: true,
  imports: [CommonModule, DoubleClickDirective],
  templateUrl: './cell.component.html',
  styleUrl: './cell.component.css',
})
export class CellComponent {
  @Input() cell: Cell | null = null;
  @Output() cellClickEvent = new EventEmitter<Cell | null>();
  @Output() cellFlagged = new EventEmitter<Operation>();

  styles: Record<string, string> = {};
  isSingleClick = false;

  // Using directive
  singleClick(e: MouseEvent) {
    this.cellClickEvent.emit(this.cell);
  }

  doubleClick(e: MouseEvent) {
    this.cell?.flag();
    if (this.cell?.state != 'Open')
      this.cellFlagged.emit(
        this.cell?.state === 'Flagged' ? 'Decrement' : 'Increment'
      );
  }
}
