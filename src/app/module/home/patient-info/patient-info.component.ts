import { Component, OnInit } from '@angular/core';
import { Time } from '@angular/common';

@Component({
  selector: 'cxr-patient-info',
  templateUrl: './patient-info.component.html',
  styleUrls: ['./patient-info.component.scss'],
})
export class PatientInfoComponent implements OnInit {
  name: string = 'Pramoda';
  age: number = 25;
  patientId: number = 1001;
  status: string = 'Emergency';
  sex: string = 'Male';
  dateOfCreation: Date = new Date();
  time: Date = new Date();
  refPhysician: string = 'Prajwal';
  clinicalHistory: string;

  constructor() {}

  ngOnInit(): void {}
}
