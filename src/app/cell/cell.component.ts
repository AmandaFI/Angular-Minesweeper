import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoubleClickDirective } from '../double-click.directive';
import { Cell } from '../Classes/Cell';
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

  // constructor roda antes de settar as properties recebidas por input
  // ngOnInit roda depois, ou seja, essas variaveis já tem valor

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
