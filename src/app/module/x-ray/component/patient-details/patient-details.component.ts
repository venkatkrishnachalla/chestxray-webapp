import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cxr-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.scss'],
})
export class PatientDetailsComponent implements OnInit {
  value: number;
  PatientName: string;
  PatientGender = 'F';
  PatientAge: string;
  refPhysician: string;
  Date: string;
  Time: string;
  history: string;
  constructor() {}

  ngOnInit(): void {
    this.value = 50;
    this.PatientName = 'Shilpa R.';
    this.PatientAge = '45yrs';
    this.refPhysician = 'Dr.Adam Walt';
    this.Date = '18-05-2020';
    this.Time = '16:15:30';
    this.history =
      'lorem ipsum sit amet, consetetur sadipscing, sed diam nonumy eirmod';
  }
}
