import { Component, OnInit } from '@angular/core';

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
    'Normal hilar vascular markings',
    'both costophrenic angles are clear',
    'there is cardiomegaly',
    'the mediastinum is within normal limits',
  ];

  impressions = [
    'Cardiomegaly',
    'Lung Lesion',
    'Cardiomegaly',
    'Cardiomegaly',
    'Lung Lesion',
    'Cardiomegaly',
  ];

  comments = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum is simply dummy text of the printing and typesetting industry';
  clinicalHistory = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum is simply dummy text of the printing and typesetting industry';

  constructor() {}

  ngOnInit(): void {}
}
