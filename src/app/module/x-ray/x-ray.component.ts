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
export class XRayComponent implements OnInit {
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
   * @param '{void}' empty - A empty param
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
   * @param '{string}' value - A string param
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
   * @param '{void}' empty - A empty param
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
   * @param '{void}' empty - A empty param
   * @example
   * submitReport();
   */

  submitReport() {
    this.disableSubmitBtn = true;
    let indexValue = 0;
    let indexValueDisease = 0;
    let mainSource = '';
    const annotationData = this.canvas.savedInfo['data'].ndarray[0];
    annotationData.Impression.forEach((element) => {
      element.index = indexValue;
      if (element.Source === 'ML' && mainSource !== 'ML+DR') {
        mainSource = 'ML';
      } else if (element.Source === 'DR' && mainSource === '') {
        mainSource = 'DR';
      } else if (element.Source === 'DR' && mainSource === 'ML') {
        mainSource = mainSource + '+DR';
      }
      indexValue++;
    });
    annotationData.diseases.forEach((element) => {
      delete element.index;
      if (element.freeHandDrawing) {
        element.type = 'freeHandDrawing';
        element.contours = [
          {
            Source: 'DR',
            isUpdated: false,
            isDeleted: false,
            coordinates: element.coordinatevalues,
          },
        ];
        element.ellipses = [];
        delete element.coordinatevalues;
      } else if (element.ellipses) {
        element.contours = [
          {
            coordinates: [],
            Source: 'DR',
            isUpdated: false,
            isDeleted: false,
          },
        ];
        element.ellipses.forEach((ellipse, index) => {
          delete ellipse.index;
          delete ellipse.id;
          delete ellipse.color;
          delete ellipse.name;
          delete ellipse.idvalue;
        });
      }
      element.idx = indexValueDisease;
      indexValueDisease++;
    });
    annotationData.Findings = {
      ADDITIONAL: [],
      'BONY THORAX': [],
      'CARDIAC SILHOUETTE': [],
      'COSTOPHRENIC ANGLES': [],
      'DOMES OF DIAPHRAGM': [],
      'HILAR/MEDIASTINAL': [],
      'LUNG FIELDS': [],
    };
    this.spinnerService.show();
    this.findings.findings.forEach((input) => {
      const output = input.split(':');
      let outputSub;
      let outputMain;
      if (input.indexOf(':') !== -1) {
        outputSub = output[1].split(',');
        outputMain = output[0];
      } else {
        outputSub = input.split(',');
        outputMain = 'ADDITIONAL';
      }
      const length = annotationData.Impression.length;
      if (outputSub.length > 0 && length !== 0) {
        outputSub.forEach((finalOutput) => {
          finalOutput = finalOutput.replace(/\//g, '').trim();
          const index = annotationData.Impression.findIndex(
            (x) => x.sentence === finalOutput
          );
          if (index === -1) {
            const impressionIndex = annotationData.Impression[length - 1].index;
            const newImpression = {
              index: impressionIndex + 1,
              sentence: output[1],
              Source: 'DR',
            };
            if (finalOutput !== '') {
              if (
                annotationData.Impression.findIndex(
                  (s) => s.sentence === finalOutput.trim()
                ) === -1 &&
                annotationData.diseases.findIndex(
                  (a) => a.name === finalOutput
                ) !== -1
              ) {
                annotationData.Impression.push(newImpression);
              }
              annotationData.Findings[outputMain].push(impressionIndex + 1);
            }
          } else {
            annotationData.Findings[outputMain].push(index);
          }
        });
      } else if (output[0] !== ' ' && length !== 0) {
        // tslint:disable-next-line: max-line-length
        const index = annotationData.Impression.findIndex(
          (x) => x.sentence === (output[1] ? output[1].trim() : '')
        );
        if (index === -1) {
          const impressionIndex = annotationData.Impression[length - 1].index;
          const newImpression = {
            index: impressionIndex + 1,
            sentence: output[1],
            Source: 'DR',
          };
          if (output[1] !== '') {
            // tslint:disable-next-line: max-line-length
            if (
              annotationData.Impression.findIndex(
                (s) => s.sentence === (output[1] ? output[1].trim() : '')
              ) === -1 &&
              annotationData.diseases.findIndex((a) => a.name === output[1]) !==
                -1
            ) {
              annotationData.Impression.push(newImpression);
            }
            annotationData.Findings[outputMain].push(impressionIndex + 1);
          }
        } else {
          annotationData.Findings[outputMain].push(index);
        }
      }
    });
    const FinalData = {
      data: {
        names: [{}],
        ndarray: [
          {
            xRayId: this.canvas.patientDetail.xRayList[0].xRayId,
            Findings: annotationData.Findings,
            Impression: annotationData.Impression,
            diseases: annotationData.diseases,
            updatedBy: this.canvas.patientDetail.xRayList[0].assignedTo,
            updatedOn: new Date().toJSON().slice(0, 10),
            Source: mainSource === '' ? 'DR' : mainSource,
          },
        ],
      },
    };
    if (this.canvas.patientDetail.xRayList[0].isAnnotated) {
      this.xrayService.updateSubmitReport(FinalData).subscribe(
        (response) => {
          this.spinnerService.hide();
          this.disableSubmitBtn = false;
          this.eventEmitterService.onStatusChange(true);
          this.toastrService.success('Report updated successfully');
        },
        (errorMessage: string) => {
          this.spinnerService.hide();
          this.disableSubmitBtn = false;
          this.toastrService.error('Failed to update annotated data');
        }
      );
    } else {
      this.xrayService.submitReport(FinalData).subscribe(
        (response) => {
          this.spinnerService.hide();
          this.disableSubmitBtn = false;
          this.eventEmitterService.onStatusChange(true);
          const updatePatientData = history.state.patientDetails;
          if (updatePatientData && updatePatientData.xRayList) {
            updatePatientData.xRayList[0].isAnnotated = true;
          } else {
            const patientInfo = JSON.parse(
              sessionStorage.getItem('patientDetail')
            );
            patientInfo.xRayList[0].isAnnotated = true;
            sessionStorage.setItem(
              'patientDetail',
              JSON.stringify(patientInfo)
            );
          }
          this.toastrService.success('Report submitted successfully');
          this.canvas.patientDetail.xRayList[0].isAnnotated = true;
        },
        (errorMessage: string) => {
          this.spinnerService.hide();
          this.disableSubmitBtn = false;
          this.toastrService.error('Failed to submit annotated data');
        }
      );
    }
  }
  /**
   * unsubscribe userSubscription event
   * @param {void} empty - A empty param
   * @example
   * ngOnDestroy();
   */
  // ngOnDestroy() {
  //   this.userSubscription.unsubscribe();
  // }
}
