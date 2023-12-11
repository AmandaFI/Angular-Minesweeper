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
import { Board, Level } from '../Classes/Board';
import { Cell } from '../Classes/Cell';
import { Operation } from '../app.component';

// TODO
// - colocar icones para bomba e flag
// - botão de reiniciar o jogo

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
  @Output() cellFlagged = new EventEmitter<Operation>();

  board: Board = new Board(this.level);

  freezeGame = false;
  gameOverMessage =
    'Game over, you spilled a cup of coffee. Do you want to start a new game ?';
  victoryMessage =
    'Congratulation, you found all the cups! Do you want to start a new game ?';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['level']) this.board = new Board(this.level);
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
      default:
        // const _exhaustiveCheck: never = this.board[x][y].status;
        break;
    }
  }

  restartGame() {
    this.board = new Board(this.level);
    this.freezeGame = false;
  }

  gameOver() {
    if (window.confirm(this.gameOverMessage)) this.restartGame();
    else this.freezeGame = true;
  }

  victory() {
    if (window.confirm(this.victoryMessage)) this.restartGame();
    else this.freezeGame = true;
  }

  forwardEvent(operation: Operation) {
    this.cellFlagged.emit(operation);
  }
}
