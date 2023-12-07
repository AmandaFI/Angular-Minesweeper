import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appDoubleClick]',
  standalone: true,
})
export class DoubleClickDirective {
  @Output() singleClick = new EventEmitter();
  @Output() doubleClick = new EventEmitter();

  isSingleClick = false;
  singleClickTimeout: any = undefined;

  constructor() {}

  @HostListener('click', ['$event']) onClick(e: any) {
    this.isSingleClick = true;
    console.log('directive single click');
    this.singleClickTimeout = setTimeout(() => {
      if (this.isSingleClick) this.singleClick.emit(e);
    }, 250);
  }

  @HostListener('dbclick', ['$event']) onDbClick(e: any) {
    this.isSingleClick = false;
    clearTimeout(this.singleClickTimeout);
    this.doubleClick.emit(e);
  }
}
