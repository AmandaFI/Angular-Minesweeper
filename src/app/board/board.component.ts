import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CellComponent } from '../cell/cell.component';
import { CommonModule } from '@angular/common';
import { Board, Level } from '../models/board';
import { Cell } from '../models/cell';
import { Operation } from '../app.component';

const GAME_OVER_MESSAGE =
  'Game over, you spilled a cup of coffee. Do you want to start a new game ?';
const VICTORY_MESSAGE =
  'Congratulation, you found all the cups! Do you want to start a new game ?';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CellComponent, CommonModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css',
})
export class BoardComponent implements OnChanges {
  // Constructor roda antes da property de input chegar, OnInit roda depois
  @Input() level: Level = 'Easy';
  @Input() restart: boolean = false;
  @Output() cellFlagged = new EventEmitter<Operation>();

  board: Board = new Board(this.level);

  freezeGame = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['level']) this.board = new Board(this.level);
    if (changes['restart']) this.restartGame();
  }

  updateBoard(cell: Cell | null) {
    if (this.freezeGame || !cell) return;
    switch (cell.status) {
      case 'Bomb':
        this.gameOver();
        break;
      case 'Number':
        cell.open();
        this.board.incrementOpenCells();
        if (this.board.victory()) this.victory();
        break;
      case 'Empty':
        this.board.floodFill(cell);
        if (this.board.victory()) this.victory();
        break;
      default: {
        const _exhaustiveCheck: never = cell.status;
        break;
      }
    }
  }

  restartGame() {
    this.board = new Board(this.level);
    this.freezeGame = false;
    this.restart = false;
  }

  gameOver() {
    if (window.confirm(GAME_OVER_MESSAGE)) this.restartGame();
    else this.freezeGame = true;
  }

  victory() {
    if (window.confirm(VICTORY_MESSAGE)) this.restartGame();
    else this.freezeGame = true;
  }

  forwardEvent(operation: Operation) {
    this.cellFlagged.emit(operation);
  }
}
