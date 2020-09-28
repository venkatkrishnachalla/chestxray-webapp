import { Component, OnInit, Input, HostListener } from '@angular/core';
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

  /*
   * constructor for PatientInfoComponent class
   */

  constructor() {}

  /**
   * This is a init function, retrieve current user details.
   * @param '{void}' empty - A empty param
   * @example
   * ngOnInit();
   */

  ngOnInit(): void {
    this.infoSubscription = this.patientInfo.subscribe((patientInfo: any) => {
      if (patientInfo) {
        this.patientDetail = patientInfo;
        this.showPatientInfo = true;
      }
      this.hideInfo = true;
    });
  }

  /**
   * This is a featureHide function.
   * @param '{void}' empty - A empty param
   * @example
   * featureHide();
   */

  featureHide(): void {
    this.hideInfo = false;
  }

  /**
   * This is a HostListener function.
   * @param '{void}' empty - A empty param
   * @example
   * HostListener();
   */

  @HostListener('document:click', ['$event'])

  /**
   * This is a clickout function.
   * @param '{void}' empty - A empty param
   * @example
   * clickout();
   */
  clickout() {
    this.hideInfo = false;
  }
}
