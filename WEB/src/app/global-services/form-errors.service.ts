import { Injectable } from '@angular/core';

interface PatterType {
  requiredPattern?: string;
  actualValue?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FormsErrorsService {

  constructor() { }

  public formErrorInput = (inputError: object): string => {
    const inputErrorKey = Object.keys(inputError)[0];
    const inputErrorValue = Object.values(inputError)[0];
    let errorMessaage: string = '';
    switch (inputErrorKey) {
      case 'required':
        errorMessaage = 'Field is required';
        break;
      case 'pattern':
        errorMessaage = this.patternTypeError(inputErrorValue);
        break;
      case 'email':
        errorMessaage = 'Please enter valid email';
        break;
      case 'passwordInvalid':
        errorMessaage = "Passwords don't match";
        break;
      default:
        errorMessaage = 'Error on field';
        break;
    }
    return errorMessaage;
  };

  private patternTypeError = (pattern: PatterType): string => {
    let patterErrorMessage: string = '';
    switch (pattern.requiredPattern) {
      case '^[0-9]*$':
        patterErrorMessage = 'Field must be numbers'
        break;
    
      default:
        patterErrorMessage = 'Incorrect pattern'
        break;
    }
    return patterErrorMessage;
  }
}