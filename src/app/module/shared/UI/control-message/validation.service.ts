import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
    const config = {
    required: 'is required',
    minLengthArray: 'minLengthArray',
    email: 'is Invalid',
    pattern: 'is Invalid',
    max: `Max value is ${validatorValue.max}`,
    min: `Min value is ${validatorValue.min}`,
    invalidPassword:
    'Invalid password. Password must be at least 6 characters long, and contain a number.',
    minlength: `Minimum length ${validatorValue.requiredLength} Characters`,
    maxlength: `Maximun length ${validatorValue.requiredLength} Characters`,
    mustMatch: 'should must match'
    };
    return config[validatorName];
    }
}
