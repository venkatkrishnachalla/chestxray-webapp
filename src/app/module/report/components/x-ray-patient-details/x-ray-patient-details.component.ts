import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { EventEmitterService } from 'src/app/service/event-emitter.service';
import { EventEmitterService2 } from 'src/app/service/event-emitter.service2';
import { XRayService } from 'src/app/service/x-ray.service';
import {
  PatientDetailData,
  ImpressionData,
  InvokeComponentData,
} from 'src/app/module/auth/interface.modal';
import { fabric } from 'fabric';
import { staticContentHTML } from 'src/app/constants/staticContentHTML';
import { AuthService } from 'src/app/module/auth/auth.service';
import User from 'src/app/module/auth/user.modal';
import { Subscription } from 'rxjs';
@Component({
  selector: 'cxr-x-ray-patient-details',
  templateUrl: './x-ray-patient-details.component.html',
  styleUrls: ['./x-ray-patient-details.component.scss'],
})
// XRayPatientDetailsComponent class implementation
export class XRayPatientDetailsComponent implements OnInit, OnDestroy {
  findings = [];
  patientInfo: PatientDetailData;
  status: string;
  annotatedImpression: ImpressionData;
  annotatedFindings: any;
  impressions = [];
  abnormalityColor = [];
  comments: string;
  clinicalHistory = '';
  pdfComments: string;
  annotatedImage: string;
  canvasDynamicWidth: number;
  canvasDynamicHeight: number;
  canvasCorrectedWidth: number;
  canvasCorrectedHeight: number;
  xRayImage: any;
  pdfFindings: string;
  readonly constants = staticContentHTML;
  reportPageText: {
    patientDetails: string;
    clinicalHistory: string;
    impressions: string;
    findings: string;
    commentsAndRecommendations: string;
  };
  @Output() impressionEvent = new EventEmitter();
  isHospitalRadiologist: boolean;
  userSubscription: Subscription;
  printStatus = 'Completed';

  /*
   * constructor for XRayPatientDetailsComponent class
   */
  constructor(
    private eventEmitterService: EventEmitterService,
    private eventEmitterService2: EventEmitterService2,
    private xrayAnnotatedImpression: XRayService,
    private changeDetector: ChangeDetectorRef,
    private authService: AuthService
  ) {
    this.eventEmitterService.commentSubject.subscribe((data) => {
      this.pdfComments = data;
      this.changeDetector.markForCheck();
    });
    this.eventEmitterService.findingsSubject.subscribe((data) => {
      this.pdfFindings = data;
      const findings = JSON.stringify(this.pdfFindings);
      sessionStorage.setItem('findings', findings);
      this.changeDetector.markForCheck();
    });
    this.eventEmitterService.onStatusChangeSubject.subscribe(
      (data: boolean) => {
        this.status = data === true ? 'Completed' : 'Not Started';
      }
    );
  }

  /**
   * This is a class init function.
   * @param '{void}' empty - A empty param
   * @example
   * ngOnInit();
   */
  ngOnInit(): void {
    this.reportPageText = this.constants.reportPage;
    this.patientInfo = history.state.patientDetails;
    this.eventEmitterService.commentSubject.next('');
    this.annotatedImage = sessionStorage.getItem('annotatedImage');
    if (this.patientInfo === undefined) {
      const patientInfo = JSON.parse(sessionStorage.getItem('patientDetail'));
      this.patientInfo = patientInfo;
    }
    // tslint:disable-next-line: no-conditional-assignment
    if (this.patientInfo.xRayList[0].isAnnotated === false) {
      this.status = 'Not Started';
    } else {
      this.status = 'Completed';
    }
    this.eventEmitterService.invokeComponentFunction.subscribe(
      (data: InvokeComponentData) => {
        switch (data.title) {
          case 'stateData':
            this.storePatientDetails();
            break;
          case 'impression':
            this.storeImpressions(data);
            break;
          default:
            break;
        }
      }
    );
    this.eventEmitterService2.invokePatientInfoStatusChange.subscribe(
      (data) => {
        this.status = 'Completed';
      }
    );

    this.xrayAnnotatedImpression
      .xrayAnnotatedImpressionsService()
      .subscribe((impression: ImpressionData) => {
        this.annotatedImpression = impression;
        this.impressionEvent.emit(this.annotatedImpression);
      });

    if (
      this.annotatedImpression !== undefined &&
      this.annotatedImpression !== null
    ) {
      const impression = JSON.parse(sessionStorage.getItem('impression'));
      this.annotatedImpression = impression;
      this.impressionEvent.emit(this.annotatedImpression);
    }

    this.xrayAnnotatedImpression
      .xrayAnnotatedFindingsService()
      .subscribe((findings: any[]) => {
        if (findings.indexOf(' ') !== -1) {
          findings.splice(findings.indexOf(' '), 1);
        }
        this.annotatedFindings = findings;
        this.eventEmitterService.findingsSubject.next(this.annotatedFindings);
      });
    if (Object.keys(this.annotatedFindings).length === 0) {
      const findings = JSON.parse(sessionStorage.getItem('findings'));
      this.annotatedFindings = findings;
      this.eventEmitterService.findingsSubject.next(this.annotatedFindings);
    }

    this.userSubscription = this.authService.userSubject.subscribe(
      (user: User) => {
        if (user) {
          this.isHospitalRadiologist =
            user.userroles[0] === 'HospitalRadiologist' ? true : false;
        }
      }
    );
    this.setCanvasDimension();
  }

  /**
   * This is a function to store impressions data .
   * @param '{string}' value - A string param
   * @example
   * storeImpressions(impression);
   */
  storeImpressions(impression) {
    // tslint:disable-next-line: forin
    for (const i in impression) {
      this.impressions.push(impression[i]);
    }
  }

  /**
   * This is a  function to emit patient details .
   * @param '{void}' empty - A empty param
   * @example
   * storePatientDetails();
   */
  storePatientDetails() {
    this.eventEmitterService.onReportDataPatientDataShared({
      data: this.patientInfo,
      title: 'patientInfo',
    });
  }

  /**
   * This is a commentsChange function.
   * @param '{any}' data - A array param
   * @example
   * commentsChange(data);
   */
  commentsChange(data) {
    this.eventEmitterService.commentSubject.next(data);
  }

  /**
   * This is a updateFindings function.
   * @param '{string}' value - A string param
   * @param '{string}' value - A string param
   * @example
   * updateFindings(evt, index);
   */
  updateFindings(evt, index) {
    this.annotatedFindings.splice(index, 1, evt.target.textContent.slice(2));
    this.eventEmitterService.findingsSubject.next(this.annotatedFindings);
  }

  /**
   * This is to get the dimensions for image container.
   * @param '{void}' empty - A empty param
   * @example
   * setCanvasDimension();
   */
  setCanvasDimension() {
    this.canvasDynamicWidth = 367;
    this.canvasDynamicHeight = 367;
    this.generateCanvas();
  }

  /**
   * This is to generate a canvas using fabric.js .
   * @param '{void}' empty - A empty param
   * @example
   * generateCanvas();
   */
  generateCanvas() {
    fabric.Image.fromURL(this.annotatedImage, (img) => {
      this.xRayImage = img;
      this.setCanvasBackground();
    });
  }

  /**
   * function to compare image vs container aspect ratio width .
   * @param '{string}' value - A string param
   * @param '{string}' value - A string param
   * @example
   * getWidthFirst(imageAspectRatio, containerAspectRatio);
   */
  getWidthFirst(imageAspectRatio, containerAspectRatio) {
    return imageAspectRatio > containerAspectRatio;
  }

  /**
   * This is to setting BackgroundImage for canvas block .
   * @param '{void}' empty - A empty param
   * @example
   * setCanvasBackground();
   */
  setCanvasBackground() {
    const imageAspectRatio = this.xRayImage.width / this.xRayImage.height;
    const containerAspectRatio =
      this.canvasDynamicWidth / this.canvasDynamicHeight;
    const widthFirst = this.getWidthFirst(
      imageAspectRatio,
      containerAspectRatio
    );

    if (widthFirst) {
      this.canvasCorrectedWidth = this.canvasDynamicWidth;
      this.canvasCorrectedHeight = this.canvasCorrectedWidth / imageAspectRatio;
    } else {
      this.canvasCorrectedHeight = this.canvasDynamicHeight;
      this.canvasCorrectedWidth = this.canvasCorrectedHeight * imageAspectRatio;
    }
  }

  /**
   * This is on unsubscribe user subscription after moving out from this component
   * @param '{void}' empty - A empty param
   * @example
   * ngOnDestroy();
   */
  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
