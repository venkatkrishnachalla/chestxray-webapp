import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
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
