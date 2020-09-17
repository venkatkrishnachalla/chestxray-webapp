import { Component, OnInit, Input } from '@angular/core';
import { Time } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'cxr-patient-info',
  templateUrl: './patient-info.component.html',
  styleUrls: ['./patient-info.component.scss'],
})
export class PatientInfoComponent implements OnInit {
  @Input() patientInfo: Observable<void>;
  infoSubscription: any;
  patientDetail: any;
  showPatientInfo: boolean;
  history = '-';
  hideInfo: boolean;

  constructor() {}

  ngOnInit(): void {
    this.infoSubscription = this.patientInfo.subscribe((patientInfo: any) => {
      if (patientInfo) {
        this.patientDetail = patientInfo;
        this.showPatientInfo = true;
      }
      this.hideInfo = true;
    });
  }

  featureHide(): void {
    this.hideInfo = false;
  }
}
