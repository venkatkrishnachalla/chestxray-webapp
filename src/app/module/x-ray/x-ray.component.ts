import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Options } from 'ng5-slider';
import { Subject, Subscription } from 'rxjs';
import { XRayService } from 'src/app/service/x-ray.service';
import { SpinnerService } from '../shared/UI/spinner/spinner.service';
import { Router } from '@angular/router';
import { EventEmitterService } from 'src/app/service/event-emitter.service';
import { CanvasImageComponent } from './component/canvas-image/canvas-image.component';
import { ImpressionComponent } from './component/impression/impression.component';
import { FindingsComponent } from './component/findings/findings.component';
import { ActionPanelComponent } from './component/action-panel/action-panel.component';
import { AuthService } from '../auth/auth.service';
import User from '../auth/user.modal';
import { MlApiData } from '../auth/interface.modal';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'cxr-x-ray',
  templateUrl: './x-ray.component.html',
  styleUrls: ['./x-ray.component.scss'],
})
// XRayComponent class implementation
export class XRayComponent implements OnInit, OnDestroy {
  eventsSubject: Subject<any> = new Subject<any>();
  showAskAI = false;
  acceptStatus = false;
  value = 70;
  options: Options = {
    floor: 0,
    ceil: 100,
    vertical: true,
  };

  values = 50;
  option: Options = {
    floor: 0,
    ceil: 100,
    vertical: true,
  };
  mLResponse;
  displayCanvas = true;
  displayErrorBlock = false;
  isHospitalRadiologist: boolean;
  disableReportBtn = false;
  userSubscription: Subscription;
  disableSubmitBtn: boolean;
  @ViewChild(CanvasImageComponent) canvas: CanvasImageComponent;
  @ViewChild(ImpressionComponent) impressions: ImpressionComponent;
  @ViewChild(FindingsComponent) findings: FindingsComponent;
  @ViewChild(ActionPanelComponent) actionPanel: ActionPanelComponent;

  /*
   * constructor for XRayComponent class
   */

  constructor(
    private xrayService: XRayService,
    private spinnerService: SpinnerService,
    private router: Router,
    private eventEmitterService: EventEmitterService,
    private anotatedXrayService: XRayService,
    private authService: AuthService,
    private toastrService: ToastrService
  ) {}

  /**
   * This is a init function.
   * @param {void} empty - A empty param
   * @example
   * ngOnInit();
   */

  ngOnInit(): void {
    this.disableSubmitBtn = false;
    this.eventEmitterService.invokeReportFunction.subscribe((impressions) => {
      this.eventEmitterService.onReportDataShared(impressions);
    });
    this.userSubscription = this.authService.userSubject.subscribe(
      (user: User) => {
        if (user) {
          this.isHospitalRadiologist =
            user.userroles[0] === 'HospitalRadiologist' ? true : false;
        }
      }
    );
  }

  /**
   * open ask ai model when user clicks on ask ai button
   * @param {string} value - A string param
   * @example
   * openAskAI(event);
   */

  openAskAI(event: any) {
    this.spinnerService.show();
    const patientImage = JSON.parse(sessionStorage.getItem('PatientImage'));
    this.xrayService
      .getAskAiDetails(patientImage.base64Image, patientImage.filename)
      .subscribe(
        (mLResponse: MlApiData) => {
          this.mLResponse = mLResponse;
          const mLArray = this.mLResponse.data.ndarray[0].diseases;
          this.eventsSubject.next(mLResponse);
          this.eventEmitterService.onAskAiButtonClick('success');
          this.spinnerService.hide();
          if (mLArray.length === 0 || mLArray === undefined) {
            this.toastrService.info('No significant abnormality detected');
          } else {
            this.toastrService.success('ML Annotations updated successfully');
          }
        },
        (errorMessage: string) => {
          this.displayCanvas = false;
          this.displayErrorBlock = true;
          this.spinnerService.hide();
          this.eventEmitterService.onErrorMessage({
            data: errorMessage,
          });
        }
      );
  }

/**  
 * report button click event
 * @param {void} empty - A empty param  
 * @example  
 * generateReport();
 */ 
  generateReport() {
    this.disableReportBtn = true;
    this.canvas.onSubmitPatientDetails();
    this.impressions.getImpressionsToReport();
    this.findings.getFindingsToReport();
    this.eventEmitterService.onComponentReportButtonClick({ check: 'report' });
  }
/**  
 * report button click event
 * @param {void} empty - A empty param  
 * @example  
 * submitReport();
 */ 
submitReport() {
  this.disableSubmitBtn = true;
  let indexValue = 0;
  let indexValueDisease = 0;
  
  const annotationData = this.canvas.savedInfo['data'].ndarray[0];
  annotationData.Impression.forEach(element => {
    element.index = indexValue;
    indexValue++;
  });
  annotationData.diseases.forEach(element => {
    delete element.index;
    element.contours = [
      {}
    ],
    element.ellipses.forEach(ellipse => {
      delete ellipse.index;
      delete ellipse.type;
      delete ellipse.id;
      delete ellipse.color;
      delete ellipse.name;
      delete ellipse.idvalue;
    });
    element.idx = indexValueDisease;
    indexValueDisease++;
  });
  
  if (Object.keys(annotationData.Findings).length === 0){
      
      annotationData.Findings = {
        additional: [],
        bonythorax: [],
        cardiacsilhouette: [],
        costophrenicangles: [],
        domesofdiaphragm: [],
        hilarmediastinal: [],
        lungfields: []
      };
  }
  this.spinnerService.show();
  this.findings.findings.forEach(input => {
    const output = input.split(':');
    let outputSub;
    let outputMain;
    if (input.indexOf(':') !== -1){
      outputSub = output[1].split(',');
      outputMain = output[0].toLowerCase().replace(/\//g, '').replace(/ /g, '');
    }
    else{
      outputSub = input.split(',');
      outputMain = 'additional';
    }
    if (outputSub.length > 1){
      outputSub.forEach(finalOutput => {
        finalOutput = finalOutput.replace(/\//g, '').replace(/ /g, '');
        
        const index = annotationData.Impression.findIndex(x => x.sentence === finalOutput);
        if (index === -1){
          const length = annotationData.Impression.length;
          const impressionIndex = annotationData.Impression[length - 1].index;
          const newImpression = {
            index: impressionIndex + 1, 
            sentence: finalOutput
          };
          if (finalOutput !== ''){
            if (annotationData.Impression.findIndex(s => s.sentence === finalOutput.trim()) === -1){
              annotationData.Impression.push(newImpression);
            }
            annotationData.Findings[outputMain].push(impressionIndex + 1);
          }
        }
        else{
          annotationData.Findings[outputMain].push(index);
        }
      });
    }
    else if (output[0] !== ' '){
      // tslint:disable-next-line: max-line-length
      const index =  annotationData.Impression.findIndex(x => x.sentence === (output[1] ? output[1].trim() : '') );
      if (index === -1){
        const length = annotationData.Impression.length;
        const impressionIndex = annotationData.Impression[length - 1].index;
        const newImpression = {
          index: impressionIndex + 1, 
          sentence: output[1]
        };
        if (output[1] !== ''){
          // tslint:disable-next-line: max-line-length
          if (annotationData.Impression.findIndex(s => s.sentence === (output[1] ? output[1].trim() : '')) === -1){
            annotationData.Impression.push(newImpression);
          }
          annotationData.Findings[outputMain].push(impressionIndex + 1);
        }
      }
      else{
        annotationData.Findings[outputMain].push(index);
      }
    }
  });
  const FinalData = {
    studyId: this.canvas.patientDetail.studyId,
    seriesId: this.canvas.patientDetail.seriesId,
    findings: annotationData.Findings,
    impressions: annotationData.Impression,
    diseases: annotationData.diseases,
    updatedBy: this.canvas.patientDetail.assignedTo,
    updatedOn: new Date().toJSON().slice(0, 10)
  };
  this.xrayService
    .submitReport(FinalData)
    .subscribe(
      (response) => {
        this.spinnerService.hide();
        this.disableSubmitBtn = false;
        this.toastrService.success('Report submitted successfully');
        this.eventEmitterService.onStatusChange('true');
      },
      (errorMessage: string) => {
        this.spinnerService.hide();
        this.disableSubmitBtn = false;
        this.toastrService.error('Failed to submit annotated data');
      }
    );
}
/**  
 * unsubscribe userSubscription event 
 * @param {void} empty - A empty param  
 * @example  
 * ngOnDestroy();
 */ 
  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
