import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

type AlertType = 'ERROR' | 'SUCCESS' | 'WARNING' | 'INFO';

@Injectable({
  providedIn: 'root',
})
// SnackbarService class implementation  
export class SnackbarService {
  constructor(private _snackBar: MatSnackBar) {}
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
      /**  
* This is a open function.  
* @param {string} value - A string param
* @param {string} value - A string param
* @example  
* open(message, type);
*/ 
  open(message: string = 'Operation Successful', type: AlertType = 'SUCCESS') {
    this._snackBar.open(message, 'X', {
      panelClass: 'error-snackbar',
      duration: 3000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }
}
