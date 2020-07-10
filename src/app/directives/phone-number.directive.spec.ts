import { PhoneNumberDirective } from './phone-number.directive';

describe('PhoneNumberDirective', () => {
  const elementRefSpy = jasmine.createSpyObj('ElementRef', ['nativeElementopen']);
  it('should create an instance', () => {
    const directive = new PhoneNumberDirective(elementRefSpy);
    expect(directive).toBeTruthy();
  });
});
