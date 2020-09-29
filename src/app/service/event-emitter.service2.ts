import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
// EventEmitterService2 class implementation
export class EventEmitterService2 {
  invokeEyeIconFunction = new EventEmitter();
  invokePatientInfoStatusChange = new EventEmitter();

  constructor() {}

  /*** onEyeIconClick event emit function  ***/
  onEyeIconClick(data) {
    this.invokeEyeIconFunction.emit(data);
  }

  /*** onEyeIconClick event emit function  ***/
  patientInfoStatusChange(data) {
    this.invokePatientInfoStatusChange.emit(data);
  }
}
