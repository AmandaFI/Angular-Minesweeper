import { Component } from '@angular/core';
import { CellComponent } from '../cell/cell.component';
import { CommonModule } from '@angular/common';
import { Board } from '../Classes/Board';
import { Cell } from '../Classes/Cell';

// TODO
// - escolher cores
// - colocar icones para bomba e flag
// - botão de reiniciar o jogo
// - quando clicar em bomba, encerrar o jogo
// - permitir escolher entre 3 tamanhos de tabuleir

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CellComponent, CommonModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css',
})
export class BoardComponent {
  board: Board = new Board('Medium');

  updateBoard(cell: Cell | null) {
    if (!cell) return;
    switch (cell.status) {
      case 'Bomb':
        window.alert('Game over.');
        break;
      case 'Number':
        cell.open();
        this.board.incrementOpenCells();
        this.board.victory(); // -------------------------
        break;
      case 'Empty':
        this.board.floodFill(cell);
        break;
      default:
        // const _exhaustiveCheck: never = this.board[x][y].status;
        break;
    }
  }
}
