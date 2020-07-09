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
  ];

  impressions = ['Cardiomegaly', 'Lung Lesion', 'Cardiomegaly', 'Cardiomegaly'];

  // age: number;
  // birthDate: '1984-05-02T00:00:00';
  // hospitalPatientId: '1000';
  // id: 'e3cbba88-83fe746c-6e35783c-9404b4bc-0c7ee9eb';
  // lastUpdate: '2020-07-07T08:44:25';
  // name: 'Salman';
  // referringPhysicianName: 'Mohan';
  // sex: 'M';
  // status: false;

  age: number;
  dateOfCreation: string;
  hospitalPatientId: string;
  status: boolean;
  name: string;
  sex: string;
  time: string;
  referringPhysicianName: string;
  patientInfo: any;

  comments =
    'Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum is simply dummy text of the printing and typesetting industry';
  clinicalHistory =
    'Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum is simply dummy text of the printing and typesetting industry';

  constructor() {}

  ngOnInit(): void {
     this.patientInfo = JSON.parse(sessionStorage.getItem('patientDetail'));
  }
}
