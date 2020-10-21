import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
// EventEmitterService2 class implementation
export class EventEmitterService2 {
  invokeEyeIconFunction = new EventEmitter();
  invokePatientInfoStatusChange = new EventEmitter();
  invokePageNumberClick = new EventEmitter();

  constructor() {}

  /*** onEyeIconClick event emit function  ***/
  onEyeIconClick(data) {
    this.invokeEyeIconFunction.emit(data);
  }

  /*** onEyeIconClick event emit function  ***/
  patientInfoStatusChange(data) {
    this.invokePatientInfoStatusChange.emit(data);
  }

  /*** onPaginationNumberClick event emit function  ***/
  onPageNumberClick(page, size) {
    this.invokePageNumberClick.emit({page, size});
  }
}
