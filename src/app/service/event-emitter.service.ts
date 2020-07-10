import { Injectable, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root',
})
export class EventEmitterService {
  invokeComponentFunction = new EventEmitter();
  invokeComponentData = new EventEmitter();

  invokeReportFunction = new EventEmitter();
  invokeReportData = new EventEmitter();
  subsVar: Subscription;


  private annotatedXrayImpressionSubject = new BehaviorSubject<any>({});
  constructor() {}
  onComponentButtonClick(title) {
    this.invokeComponentFunction.emit(title);
  }
  onComponentDataShared(title) {
    this.invokeComponentData.emit(title);
  }
  onComponentReportButtonClick(title) {
    this.invokeReportFunction.emit(title);
  }
  onReportDataShared(title) {
    this.invokeReportData.emit(title);
  }

  xrayAnnotatedImpressions(event) {
    this.annotatedXrayImpressionSubject.next(event);
  }

  xrayAnnotatedImpressionsService() {
    this.annotatedXrayImpressionSubject.asObservable();
  }
}
