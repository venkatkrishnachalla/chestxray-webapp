import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
// EventEmitterService2 class implementation
export class EventEmitterService2 {
  invokeEyeIconFunction = new EventEmitter();
  invokePatientInfoStatusChange = new EventEmitter();
  invokePageNumberClick = new EventEmitter();
  invokeDialogClose = new EventEmitter();
  oneSignatureChanges = new BehaviorSubject({img: '', date: ''});
  invokerefreshRadiologistList = new EventEmitter();
  invokeshareEvent = new EventEmitter();
  invokeEnableSubmitBtn = new EventEmitter();
  invokeDeleteAllAnnotations = new EventEmitter();
  invokeDeleteConfirmation = new EventEmitter();
  invokeResetFindings = new EventEmitter();
  invokeMLrejection = new EventEmitter();
  invokeResetImpression = new EventEmitter();
  invokeNoFindings = new EventEmitter();
  invokeDisablePathologyBtns = new EventEmitter();


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

  /*** OnSignatureDialogClose event emit function  ***/
  OnSignatureDialogClose() {
    this.invokeDialogClose.emit();
  }

  refreshRadiologistList(){
    this.invokerefreshRadiologistList.emit();
  }
  shareEvent(filename, sign, signedDate){
    this.invokeshareEvent.emit({filename, sign, signedDate});
  }

  enableSubmitBtn(check, txt){
    this.invokeEnableSubmitBtn.emit({check, txt});
  }
  deleteAllAnnotations(txt, check, src){
    this.invokeDeleteAllAnnotations.emit({txt, check, src});
  }

  deleteConfirmation(check, txt){
    this.invokeDeleteConfirmation.emit({check, txt});
  }

  resetFindings(){
    this.invokeResetFindings.emit();
  }

  resetImpression(){
    this.invokeResetImpression.emit();
  }

  mlRejection(check, source){
    this.invokeMLrejection.emit({check, source});
  }
  nofindingsFromML(check, source){
    this.invokeNoFindings.emit({check, source});
  }
  disablePathologyButtons(check){
    this.invokeDisablePathologyBtns.emit(check);
  }
}

