import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cxr-x-ray-header',
  templateUrl: './x-ray-header.component.html',
  styleUrls: ['./x-ray-header.component.scss'],
})
export class XRayHeaderComponent implements OnInit {
  patientID: string;
  isProcessed: boolean;
  patientDetails: [];

  constructor() { }

  ngOnInit(): void {
    const patientDetail = history.state.patientDetails;
    this.patientID = patientDetail ? patientDetail.hospitalPatientId : '';
    this.isProcessed = false;
  }
}
