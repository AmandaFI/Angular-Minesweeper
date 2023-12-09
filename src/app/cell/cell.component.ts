import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CellState, CellStatus, Coords } from '../board/board.component';
import { CommonModule } from '@angular/common';
import { DoubleClickDirective } from '../double-click.directive';

@Component({
  selector: 'app-cell',
  standalone: true,
  imports: [CommonModule, DoubleClickDirective],
  templateUrl: './cell.component.html',
  styleUrl: './cell.component.css',
})
export class CellComponent implements OnInit, OnChanges {
  @Input() xCoord: number | null = null;
  @Input() yCoord: number | null = null;
  @Input() state: CellState | null = null;
  @Input() status: CellStatus | null = null;
  @Input() bombNeighboors: number | null = null;

  @Output() cellClickedEvent = new EventEmitter<Coords>();

  styles: Record<string, string> = {};
  singleClickTimeout: any;
  isSingleClick = false;

  // constructor rda antes de settar as properties recebidas por input
  // ngOnInit roda depois, ou seja, essas variaveis já tem valor

  constructor() {}
  ngOnInit(): void {
    this.initializaStyles();
    this.singleClickTimeout = undefined;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.initializaStyles();
  }

  initializaStyles() {
    this.styles = {
      width: '2rem',
      height: '2rem',
      'background-color': this.state === 'Closed' ? 'yellow' : 'blue',
      padding: '0',
      margin: '0',
    };
  }

  // Using directive
  singleClick(e: MouseEvent) {
    console.log('component single click');

    if (this.state !== 'Open' && this.xCoord !== null && this.yCoord !== null)
      this.cellClickedEvent.emit({ x: this.xCoord, y: this.yCoord });
  }

  doubleClick(e: MouseEvent) {
    console.log('component double click');

    //console.log(this.singleClickTimeout);
  }

  //clear timeout não estava limpando

  // Using directly the events
  // singleClick() {
  //   console.log('component single click');
  //   this.isSingleClick = true;
  //   setTimeout(() => {
  //     console.log(this.isSingleClick);
  //     if (!this.isSingleClick) return;
  //     if (this.state !== 'Open' && this.xCoord !== null && this.yCoord !== null)
  //       this.cellClickedEvent.emit({ x: this.xCoord, y: this.yCoord });
  //   }, 1000);
  // }

  // doubleClick() {
  //   console.log('component double click');
  //   this.isSingleClick = false;
  // }
}
