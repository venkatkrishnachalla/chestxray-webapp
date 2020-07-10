import { InputValidatorDirective } from './input-validator.directive';

describe('InputValidatorDirective', () => {
  const elementRefSpy = jasmine.createSpyObj('ElementRef', ['nativeElementopen']);
  it('should create an instance', () => {
    const directive = new InputValidatorDirective(elementRefSpy);
    expect(directive).toBeTruthy();
  });
});
