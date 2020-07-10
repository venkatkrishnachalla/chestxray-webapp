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
  patient: any;
  constructor() {}

  ngOnInit(): void {
    this.patient = JSON.parse(sessionStorage.getItem('patientDetail'));
    this.value = 50;
    this.PatientName = this.patient.name;
    this.PatientAge = this.patient.age;
    this.refPhysician = this.patient.referringPhysicianName;
    this.PatientGender = this.patient.sex;
    this.Date = this.patient.lastUpdate;
    this.Time = this.patient.lastUpdate;
    this.history = '';
  }
}
