import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[cxrPhoneNumber]'
})
export class PhoneNumberDirective {

  constructor(private _el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event) {
    const phoneNumberValue = this._el.nativeElement.value;

    this._el.nativeElement.value = phoneNumberValue.replace(/[^0-9/]*/g, '');
    if ( phoneNumberValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
  }
}
