import { AfterViewInit, Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appAutofocus]',
  standalone: true,
})
export class Autofocus implements AfterViewInit {
  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    console.log(this.el);
    this.el.nativeElement.focus();
  }
}
