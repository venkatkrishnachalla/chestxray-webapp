import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cxr-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.scss'],
})
export class PatientDetailsComponent implements OnInit {
  value: number;
  PatientName: string;
  PatientGender: string;
  PatientAge: string;
  refPhysician: string;
  Date: string;
  Time: string;
  history: string;
  constructor() {}

  ngOnInit(): void {
    const patient = JSON.parse(localStorage.getItem('patientDetail'));
    this.value = 50;
    this.PatientName = patient.name;
    this.PatientAge = patient.age;
    this.refPhysician = patient.referringPhysicianName;
    this.PatientGender = patient.sex;
    this.Date = patient.lastUpdate;
    this.Time = patient.lastUpdate;
    this.history =
      'lorem ipsum sit amet, consetetur sadipscing, sed diam nonumy eirmod';
  }
}
