import { Injectable, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';

@Injectable({
  providedIn: 'root',
})
export class EventEmitterService {
  invokeComponentFunction = new EventEmitter();
  invokeComponentData = new EventEmitter();
  invokeComponentEllipseData = new EventEmitter();
  subsVar: Subscription;

  constructor() {}
  onComponentButtonClick(title) {
    this.invokeComponentFunction.emit(title);
  }
  onComponentDataShared(title) {
    this.invokeComponentData.emit(title);
  }
  onComponentEllipseDataShared(title) {
    this.invokeComponentEllipseData.emit(title);
  }
}
