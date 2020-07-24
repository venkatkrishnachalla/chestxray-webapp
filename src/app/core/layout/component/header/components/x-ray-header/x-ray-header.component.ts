import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/module/auth/auth.service';
import { Subscription } from 'rxjs';
import { PatientDetailData } from 'src/app/module/auth/interface.modal';
import User from 'src/app/module/auth/user.modal';

@Component({
  selector: 'cxr-x-ray-header',
  templateUrl: './x-ray-header.component.html',
  styleUrls: ['./x-ray-header.component.scss'],
})
export class XRayHeaderComponent implements OnInit, OnDestroy {
  patientID: string;
  isProcessed: boolean;
  isHospitalRadiologist: boolean;
  userSubscription: Subscription;
  patientDetails: PatientDetailData;

  constructor(public router: Router, private authService: AuthService) {}

  /*** init function ***/
  ngOnInit(): void {
    let patientDetail = history.state.patientDetails;
    if (patientDetail === undefined) {
      const patient = JSON.parse(sessionStorage.getItem('patientDetail'));
      patientDetail = patient;
    }
    this.patientID = patientDetail ? patientDetail.hospitalPatientId : '';
    this.isProcessed = patientDetail.status;

    this.userSubscription = this.authService.userSubject.subscribe(
      (user: User) => {
        if (user) {
          this.isHospitalRadiologist =
            user.userroles[0] === 'HospitalRadiologist' ? true : false;
        }
      }
    );
  }

  /*** unsubscribe userSubscription event ***/
  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
