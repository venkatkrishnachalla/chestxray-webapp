import { Injectable, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root',
})
export class EventEmitterService {
  invokeComponentFunction = new EventEmitter();
  invokeComponentData = new EventEmitter();
  invokeComponentEllipseData = new EventEmitter();
  invokeComponentFindingsData = new EventEmitter();
  invokeReportFunction = new EventEmitter();
  invokeReportData = new EventEmitter();
  invokeReportDataFunction = new EventEmitter();
  invokeFindingsDataFunction = new EventEmitter();
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
  onComponentFindingsDataShared(title) {
    this.invokeComponentFindingsData.emit(title);
  }
  onComponentReportButtonClick(title) {
    this.invokeReportFunction.emit(title);
  }
  onReportDataShared(title) {
    this.invokeReportData.emit(title);
  }
  onReportDataPatientDataShared(title) {
    this.invokeReportDataFunction.emit(title);
  }
  onImpressionDataShared(data){
    this.invokeFindingsDataFunction.emit(data);
  }
}
