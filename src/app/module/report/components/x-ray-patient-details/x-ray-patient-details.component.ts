import { Component, OnInit } from '@angular/core';
import { EventEmitterService } from 'src/app/service/event-emitter.service';
import {
  DISEASE_COLOR_MAPPING,
  RANDOM_COLOR,
} from 'src/app/constants/findingColorConstants';
import { XRayService } from 'src/app/service/x-ray.service';

@Component({
  selector: 'cxr-x-ray-patient-details',
  templateUrl: './x-ray-patient-details.component.html',
  styleUrls: ['./x-ray-patient-details.component.scss'],
})
export class XRayPatientDetailsComponent implements OnInit {
  findings = [];
  patientInfo: any;
  annotatedImpression: string;

  impressions = [];
  abnormalityColor = [];
  comments = '';
  clinicalHistory = '';

  constructor(private eventEmitterService: EventEmitterService,
              private xrayAnnotatedImpression: XRayService) {}

  ngOnInit(): void {
    this.patientInfo = history.state.patientDetails;
    this.eventEmitterService.subsVar = this.eventEmitterService.invokeComponentFunction.subscribe(
        (data: any) => {
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
      .subscribe((impression) => {
        this.annotatedImpression = impression;
      });
  }
  storeImpressions(impression){
    // tslint:disable-next-line: forin
    for (const i in impression) {
      this.impressions.push(impression[i]);
    }
  }
  storePatientDetails(){
      this.eventEmitterService.onReportDataPatientDataShared({data: this.patientInfo, title: 'patientInfo'});
  }
}
