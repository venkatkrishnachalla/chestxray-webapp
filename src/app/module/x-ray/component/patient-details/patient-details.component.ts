import { Component, OnInit, OnDestroy } from '@angular/core';
import { PatientDetailData } from 'src/app/module/auth/interface.modal';
import { Subscription } from 'rxjs';
import { EventEmitterService } from 'src/app/service/event-emitter.service';

@Component({
  selector: 'cxr-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.scss'],
})
export class PatientDetailsComponent implements OnInit, OnDestroy {
  value: number;
  PatientName: string;
  PatientGender: string;
  PatientAge: string;
  refPhysician: string;
  Date: string;
  Time: string;
  history: string;
  patientDetails: PatientDetailData;
  _subscription: Subscription;

  constructor(private eventEmitterService: EventEmitterService) {
    this._subscription = this.eventEmitterService.invokePrevNextButtonDataFunction.subscribe(
      (patientId: string) => {
        this.getPatientDetails();
      }
    );
  }

  /*** class init function and bind patient details ***/
  ngOnInit(): void {
    this.getPatientDetails();
  }

  /*** get patient detail function ****/
  getPatientDetails() {
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

  /*** on destroy event subscription ***/
  ngOnDestroy() {
    this._subscription.unsubscribe();
  }
}
