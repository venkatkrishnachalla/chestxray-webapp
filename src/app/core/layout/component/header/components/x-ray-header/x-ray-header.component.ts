import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/module/auth/auth.service';
import { Subscription } from 'rxjs';
import {
  PatientDetailData,
  PatientListData,
} from 'src/app/module/auth/interface.modal';
import User from 'src/app/module/auth/user.modal';
import { EventEmitterService } from 'src/app/service/event-emitter.service';

@Component({
  selector: 'cxr-x-ray-header',
  templateUrl: './x-ray-header.component.html',
  styleUrls: ['./x-ray-header.component.scss'],
})
// XRayHeaderComponent class implementation
export class XRayHeaderComponent implements OnInit, OnDestroy {
  patientID: string;
  isProcessed: boolean;
  isHospitalRadiologist: boolean;
  userSubscription: Subscription;
  patientDetails: PatientDetailData;
  patientRows: PatientListData;
  currentIndex: number;
  currentPatientData: PatientDetailData;
  disablePrevious: boolean;
  disableNext: boolean;
  component: {
    patientId: number;
    name: string;
    gender: string;
    age: number;
    priority: string;
    referenceDoctor: string;
    date: string;
    desc: string;
    status: string;
    instanceID: string;
  };

  /*
   * constructor for XRayHeaderComponent class
   */

  constructor(
    public router: Router,
    private authService: AuthService,
    private eventEmitterService: EventEmitterService
  ) {}

  /**
   * This is a init function.
   * @param '{void}' empty - A empty param
   * @example
   * ngOnInit();
   */

  ngOnInit(): void {
    let patientDetail = history.state.patientDetails;
    if (patientDetail === undefined) {
      const patient = JSON.parse(sessionStorage.getItem('patientDetail'));
      patientDetail = patient;
    }
    this.patientID = patientDetail ? patientDetail.hospitalPatientId : '';
    this.isProcessed = patientDetail.isAnnotated;

    this.userSubscription = this.authService.userSubject.subscribe(
      (user: User) => {
        if (user) {
          this.isHospitalRadiologist =
            user.userroles[0] === 'HospitalRadiologist' ? true : false;
        }
      }
    );
    this.eventEmitterService.onStatusChangeFunction.subscribe((data) => {
      this.isProcessed = data;
    });
    this.prevNextFunction();
  }

  /**
   * This is a prev and next data filter function.
   * @param '{null}' - A null param
   * @example
   * prevNextFunction();
   */

  prevNextFunction() {
    this.patientRows = JSON.parse(sessionStorage.getItem('patientRows'));
    if (this.patientRows.length > 0) {
      const lastIndex = this.patientRows[this.patientRows.length - 1].index;
      this.currentIndex = this.patientRows.findIndex(
        (a) => a.hospitalPatientId === this.patientID
      );
      this.currentPatientData = this.patientRows[this.currentIndex];
      this.isProcessed = this.currentPatientData.isAnnotated;
      this.disablePrevious = this.currentIndex === 0 ? true : false;
      this.disableNext = this.currentIndex === lastIndex ? true : false;
    }
  }

  /**
   * This is a event to change xray page next patient function.
   * @param '{null}' - A null param
   * @example
   * nextPatient();
   */

  nextPatient() {
    const currIndex = this.currentIndex + 1;
    const filterData = this.patientRows[currIndex];
    const patientDetail = JSON.stringify(filterData);
    sessionStorage.removeItem('x-ray_Data');
    sessionStorage.removeItem('impression');
    sessionStorage.removeItem('findings');
    sessionStorage.removeItem('PatientImage');
    sessionStorage.setItem('patientDetail', patientDetail);
    sessionStorage.setItem('askAiSelection', 'false');
    this.patientID = filterData.hospitalPatientId;
    history.pushState(filterData, 'patientDetails', 'x-ray');
    this.eventEmitterService.onPrevNextButtonClick(filterData.id);
    this.prevNextFunction();
  }

  /**
   * This is a event to change xray page previous patient function.
   * @param '{null}' - A null param
   * @example
   * previousPatient();
   */

  previousPatient() {
    const currIndex = this.currentIndex - 1;
    const filterData = this.patientRows[currIndex];
    const patientDetail = JSON.stringify(filterData);
    sessionStorage.removeItem('x-ray_Data');
    sessionStorage.removeItem('impression');
    sessionStorage.removeItem('findings');
    sessionStorage.setItem('patientDetail', patientDetail);
    sessionStorage.setItem('askAiSelection', 'false');
    this.patientID = filterData.hospitalPatientId;
    history.pushState(filterData, 'patientDetails', 'x-ray');
    this.eventEmitterService.onPrevNextButtonClick(filterData.id);
    this.prevNextFunction();
  }

  /**
   * This is a unsubscribe userSubscription event function.
   * @param '{null}' - A null param
   * @example
   * ngOnDestroy();
   */

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
