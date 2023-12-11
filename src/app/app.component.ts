import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { BoardComponent } from './board/board.component';
import { CellComponent } from './cell/cell.component';
import { DoubleClickDirective } from './double-click.directive';
import { LEVELS, Level } from './Classes/Board';

export type Operation = 'Increment' | 'Decrement';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    BoardComponent,
    CellComponent,
    DoubleClickDirective,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'minesweeper';

  level: Level = 'Easy';
  bombsRemaining = LEVELS[this.level].n_bombs;

  changeLevel(level: Level) {
    this.level = level;
    this.bombsRemaining = LEVELS[level].n_bombs;
  }

  updateDisplay(operation: any) {
    switch (operation) {
      case 'Increment':
        this.bombsRemaining++;
        break;
      case 'Decrement':
        this.bombsRemaining--;
        break;
      default:
        break;
    }
  }

  restartGame() {}
}
