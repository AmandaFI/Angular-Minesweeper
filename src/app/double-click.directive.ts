import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appDoubleClick]',
  standalone: true,
})
export class DoubleClickDirective {
  @Output() singleClick = new EventEmitter();
  @Output() doubleClick = new EventEmitter();

  isSingleClick = false;

  constructor() {}

  @HostListener('click', ['$event']) onClick(e: MouseEvent) {
    this.isSingleClick = true;
    setTimeout(() => {
      if (this.isSingleClick) this.singleClick.emit(e);
    }, 250);
  }

  @HostListener('dblclick', ['$event']) onDbClick(e: MouseEvent) {
    this.isSingleClick = false;
    this.doubleClick.emit(e);
  }
}
