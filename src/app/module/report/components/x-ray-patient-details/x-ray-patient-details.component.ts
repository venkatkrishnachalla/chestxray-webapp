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
  findings = [
    'Lungs are clear, no evidence of pulmonary parenchymal masses or consolidations.',
    'Normal hilar vascular markings',
    'both costophrenic angles are clear',
    'there is cardiomegaly',
    'the mediastinum is within normal limits',
  ];

  // impression = ['Cardiomegaly', 'Lung Lesion', 'Cardiomegaly', 'Cardiomegaly'];
  patientInfo: any;
  annotatedImpression: string;

  impressions = [];
  abnormalityColor = [];
  comments =
    'Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum is simply dummy text of the printing and typesetting industry';
  clinicalHistory =
    'Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum is simply dummy text of the printing and typesetting industry';

  constructor(private eventEmitterService: EventEmitterService,
              private xrayAnnotatedImpression: XRayService) {}

  ngOnInit(): void {
    this.patientInfo = JSON.parse(sessionStorage.getItem('patientDetail'));
    this.eventEmitterService.invokeReportFunction.subscribe((impression) => {
      // tslint:disable-next-line: forin
      for (const i in impression) {
        this.impressions.push(impression[i]);
      }
    });

    this.xrayAnnotatedImpression
      .xrayAnnotatedImpressionsService()
      .subscribe((impression) => {
        this.annotatedImpression = impression;
      });
  }
}
