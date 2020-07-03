import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[cxrInputValidator]'
})
export class InputValidatorDirective {

  constructor(private _el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event) {
    const inputValue = this._el.nativeElement.value;

    this._el.nativeElement.value = inputValue.replace(/[^a-zA-Z/]*/g, '');
    if ( inputValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
  }
}
