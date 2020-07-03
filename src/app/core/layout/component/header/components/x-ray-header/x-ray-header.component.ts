import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cxr-x-ray-header',
  templateUrl: './x-ray-header.component.html',
  styleUrls: ['./x-ray-header.component.scss'],
})
export class XRayHeaderComponent implements OnInit {
  patientID: string;
  isProcessed: boolean;

  constructor() {}

  ngOnInit(): void {
    const patientDetail = JSON.parse(sessionStorage.getItem('patientDetail'));
    this.patientID = patientDetail.hospitalPatientId;
    this.isProcessed = false;
  }
}
