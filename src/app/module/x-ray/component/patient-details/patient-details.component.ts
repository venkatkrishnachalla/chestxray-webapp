import { Component, OnInit } from '@angular/core';
import { PatientDetailData } from 'src/app/module/auth/interface.modal';

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
  patientDetails: PatientDetailData;
  constructor() {}

  /*** clas init function and bind patient details ***/
  ngOnInit(): void {
    let patient = history.state.patientDetails;
    if (patient === undefined) {
      patient = JSON.parse(sessionStorage.getItem('patientDetail'));
    }
    this.value = 50;
    if (patient) {
      this.PatientName = patient.name;
      this.PatientAge = patient.age;
      this.refPhysician = patient.referringPhysicianName;
      this.PatientGender = patient.sex;
      this.Date = patient.lastUpdate;
      this.Time = patient.lastUpdate;
    }
    this.history = '';
  }
}
