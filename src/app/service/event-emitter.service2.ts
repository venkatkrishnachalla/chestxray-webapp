import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EventEmitterService2 {
  invokeEyeIconFunction = new EventEmitter();


  constructor() {}

  /*** onEyeIconClick event emit function  ***/
  onEyeIconClick(data) {
    this.invokeEyeIconFunction.emit(data);
  }
}
