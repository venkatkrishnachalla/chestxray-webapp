import { Component, OnInit } from '@angular/core';
import { EventEmitterService } from 'src/app/service/event-emitter.service';
import { XRayService } from 'src/app/service/x-ray.service';

@Component({
  selector: 'cxr-x-ray-patient-details',
  templateUrl: './x-ray-patient-details.component.html',
  styleUrls: ['./x-ray-patient-details.component.scss'],
})
export class XRayPatientDetailsComponent implements OnInit {
  findings = [];
  patientInfo: any;
  status: string;
  annotatedImpression: string;
  annotatedFindings: string;

  impressions = [];
  abnormalityColor = [];
  comments: string;
  clinicalHistory = '';

  constructor(
    private eventEmitterService: EventEmitterService,
    private xrayAnnotatedImpression: XRayService
  ) {}

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
    this.eventEmitterService.invokeComponentFunction.subscribe((data: any) => {
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
    });

    this.xrayAnnotatedImpression
      .xrayAnnotatedImpressionsService()
      .subscribe((impression) => {
        this.annotatedImpression = impression;
      });

    if (Object.keys(this.annotatedImpression).length === 0) {
      const impression = JSON.parse(sessionStorage.getItem('impression'));
      this.annotatedImpression = impression;
    }

    this.xrayAnnotatedImpression
      .xrayAnnotatedFindingsService()
      .subscribe((findings) => {
        this.annotatedFindings = findings;
      });
    if (Object.keys(this.annotatedFindings).length === 0) {
      const findings = JSON.parse(sessionStorage.getItem('findings'));
      this.annotatedFindings = findings;
    }
  }
  storeImpressions(impression) {
    // tslint:disable-next-line: forin
    for (const i in impression) {
      this.impressions.push(impression[i]);
    }
  }
  storePatientDetails() {
    this.eventEmitterService.onReportDataPatientDataShared({
      data: this.patientInfo,
      title: 'patientInfo',
    });
  }
}
