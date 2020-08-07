import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { EventEmitterService } from 'src/app/service/event-emitter.service';
import { XRayService } from 'src/app/service/x-ray.service';
import {
  PatientDetailData,
  ImpressionData,
  InvokeComponentData,
} from 'src/app/module/auth/interface.modal';
import { fabric } from 'fabric';

@Component({
  selector: 'cxr-x-ray-patient-details',
  templateUrl: './x-ray-patient-details.component.html',
  styleUrls: ['./x-ray-patient-details.component.scss'],
})
export class XRayPatientDetailsComponent implements OnInit {
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

  constructor(
    private eventEmitterService: EventEmitterService,
    private xrayAnnotatedImpression: XRayService,
    private changeDetector: ChangeDetectorRef
  ) {
    this.eventEmitterService.commentSubject.subscribe((data) => {
      this.pdfComments = data;
      this.changeDetector.markForCheck();
    });
    this.eventEmitterService.findingsSubject.subscribe((data) => {
      this.pdfFindings = data;
      this.changeDetector.markForCheck();
    });
  }

  /*** class init function ***/
  ngOnInit(): void {
    this.patientInfo = history.state.patientDetails;
    this.eventEmitterService.commentSubject.next('');
    this.annotatedImage = sessionStorage.getItem('annotatedImage');
    if (this.patientInfo === undefined) {
      const patientInfo = JSON.parse(sessionStorage.getItem('patientDetail'));
      this.patientInfo = patientInfo;
    }
    // tslint:disable-next-line: no-conditional-assignment
    if (this.patientInfo.status === false) {
      this.status = 'Drafted';
    } else {
      this.status = 'Unreported';
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

    this.xrayAnnotatedImpression
      .xrayAnnotatedImpressionsService()
      .subscribe((impression: ImpressionData) => {
        this.annotatedImpression = impression;
      });

    // if (Object.keys(this.annotatedImpression).length === 0) {
    //   const impression = JSON.parse(sessionStorage.getItem('impression'));
    //   this.annotatedImpression = impression;
    // }

    if (
      this.annotatedImpression !== undefined &&
      this.annotatedImpression !== null
    ) {
      const impression = JSON.parse(sessionStorage.getItem('impression'));
      this.annotatedImpression = impression;
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
    this.setCanvasDimension();
  }

  /*** function to store impressions data ***/
  storeImpressions(impression) {
    // tslint:disable-next-line: forin
    for (const i in impression) {
      this.impressions.push(impression[i]);
    }
  }

  /*** function to emit patient details ***/
  storePatientDetails() {
    this.eventEmitterService.onReportDataPatientDataShared({
      data: this.patientInfo,
      title: 'patientInfo',
    });
  }

  commentsChange(data) {
    this.eventEmitterService.commentSubject.next(data);
  }

  updateFindings(evt, index) {
    this.annotatedFindings.splice(index, 1, evt.target.textContent.slice(2));
    this.eventEmitterService.findingsSubject.next(this.annotatedFindings);
  }

  /*** get the dimensions for image container ***/
  setCanvasDimension() {
    this.canvasDynamicWidth = 367;
    this.canvasDynamicHeight = 367;
    this.generateCanvas();
  }

  /*** generate a canvas using fabric.js ***/
  generateCanvas() {
    fabric.Image.fromURL(this.annotatedImage, (img) => {
      this.xRayImage = img;
      this.setCanvasBackground();
    });
  }

  /*** function to compare image vs container aspect ratio width ***/
  getWidthFirst(imageAspectRatio, containerAspectRatio) {
    return imageAspectRatio > containerAspectRatio;
  }

  /*** setting BackgroundImage for canvas block ***/
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
}
