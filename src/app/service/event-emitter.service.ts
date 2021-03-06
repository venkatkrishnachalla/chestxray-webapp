import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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
  invokeDisplayErrorMessage = new EventEmitter();
  invokeFindingsDataFunction = new EventEmitter();
  invokePrevNextButtonDataFunction = new EventEmitter();
  invokeAskAiButtonDataFunction = new EventEmitter();
  commentSubject = new BehaviorSubject('');
  findingsSubject = new BehaviorSubject('');
  invokeImpressionFunction = new EventEmitter();
  onStatusChangeFunction = new EventEmitter();

  constructor() {}

  /*** onComponentButtonClick event emit function ***/
  onComponentButtonClick(title) {
    this.invokeComponentFunction.emit(title);
  }

  /*** onComponentDataShared event emit function ***/
  onComponentDataShared(title) {
    this.invokeComponentData.emit(title);
  }

  /*** onComponentEllipseDataShared event emit function ***/
  onComponentEllipseDataShared(title) {
    this.invokeComponentEllipseData.emit(title);
  }

  /*** onComponentFindingsDataShared event emit function ***/
  onComponentFindingsDataShared(title) {
    this.invokeComponentFindingsData.emit(title);
  }

  /*** onComponentReportButtonClick event emit function ***/
  onComponentReportButtonClick(title) {
    this.invokeReportFunction.emit(title);
  }

  /*** onReportDataShared event emit function ***/
  onReportDataShared(title) {
    this.invokeReportData.emit(title);
  }

  /*** onReportDataPatientDataShared event emit function ***/
  onReportDataPatientDataShared(title) {
    this.invokeReportDataFunction.emit(title);
  }

  /*** onErrorMessage event emit function ***/
  onErrorMessage(title) {
    this.invokeDisplayErrorMessage.emit(title);
  }

  /*** onImpressionDataShared event emit function ***/
  onImpressionDataShared(data) {
    this.invokeFindingsDataFunction.emit(data);
  }

  /*** event to capture prev and next button click event emit function ***/
  onPrevNextButtonClick(data) {
    this.invokePrevNextButtonDataFunction.emit(data);
  }

  /*** event to capture ask ai success state ***/
  onAskAiButtonClick(data) {
    this.invokeAskAiButtonDataFunction.emit(data);
  }
  /*** event to capture ask ai success state ***/
  onImpressionCheckboxClick(data) {
    this.invokeImpressionFunction.emit(data);
  }

  onStatusChange(data){
    this.onStatusChangeFunction.emit(data);
  }
  
}
