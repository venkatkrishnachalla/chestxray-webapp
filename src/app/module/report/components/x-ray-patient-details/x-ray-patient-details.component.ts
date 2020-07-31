import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { EventEmitterService } from 'src/app/service/event-emitter.service';
import { XRayService } from 'src/app/service/x-ray.service';
import {
  PatientDetailData,
  ImpressionData,
  InvokeComponentData,
} from 'src/app/module/auth/interface.modal';

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
  pdfFindings: any;

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
        this.annotatedFindings = findings;
      });
    if (Object.keys(this.annotatedFindings).length === 0) {
      const findings = JSON.parse(sessionStorage.getItem('findings'));
      this.annotatedFindings = findings;
    }
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

  updateFindings(evt, index){
    this.annotatedFindings.splice(index, 1, evt.target.textContent.slice(2));
    this.eventEmitterService.findingsSubject.next(this.annotatedFindings);
  }
}
