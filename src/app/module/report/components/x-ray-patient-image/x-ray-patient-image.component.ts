import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { XRayService } from 'src/app/service/x-ray.service';
import { PatientDetailData } from 'src/app/module/auth/interface.modal';
import { fabric } from 'fabric';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/module/auth/auth.service';
import User from 'src/app/module/auth/user.modal';
@Component({
  selector: 'cxr-x-ray-patient-image',
  templateUrl: './x-ray-patient-image.component.html',
  styleUrls: ['./x-ray-patient-image.component.scss'],
})

// XRayPatientImageComponent class implementation
export class XRayPatientImageComponent implements OnInit {
  patientImage: any;
  xrayAnnotatedImage: string;
  xrayAnnotatedImpression: string;
  patientInfo: PatientDetailData;
  pdfTitle: string;
  isHospitalRadiologist: boolean;
  userSubscription: Subscription;
  mailText: string;
  emailBody: string;
  @Output() printEvent = new EventEmitter();
  @Output() shareEvent = new EventEmitter();

  /*
   * constructor for XRayPatientImageComponent class
   */
  constructor(
    private annotatedXrayService: XRayService,
    private authService: AuthService
  ) {}

  /**
   * This is a init function.
   * @param - A empty param
   * @example
   * ngOnInit();
   */
  ngOnInit(): void {
    this.patientInfo = history.state.patientDetails;
    if (this.patientInfo === undefined) {
      const patientInfo = JSON.parse(sessionStorage.getItem('patientDetail'));
      this.patientInfo = patientInfo;
    }
    const timestamp = Number(new Date());
    const hospitalPatientId = this.patientInfo.hospitalPatientId
      ? this.patientInfo.hospitalPatientId
      : this.patientInfo.name;
    this.pdfTitle = hospitalPatientId + '_' + timestamp;
    this.annotatedXrayService
      .getAnnotatedImageData()
      .subscribe((xrayAnnotatedImage: string) => {
        this.xrayAnnotatedImage = xrayAnnotatedImage;
        if (Object.keys(this.xrayAnnotatedImage).length === 0) {
          const image = sessionStorage.getItem('annotatedImage');
          this.xrayAnnotatedImage = image;
        }
      });
    this.userSubscription = this.authService.userSubject.subscribe(
      (user: User) => {
        if (user) {
          this.isHospitalRadiologist =
            user.userroles[0] === 'HospitalRadiologist' ? true : false;
        }
      }
    );
  }

  /**
   * This is a print button click emit function.
   * @param - A empty param
   * @example
   * printClick();
   */
  printClick() {
    this.printEvent.emit(true);
  }

  /**
   * This is a shareButtonEvent button click emit function.
   * @param - A empty param
   * @example
   * shareButtonEvent();
   */
  shareButtonEvent() {
    this.shareEvent.emit(true);
    const formattedBody =
      'X-ray Report for patient: ' + this.patientInfo.name + '\n' + '\n';
    const mailToLink =
      'mailto:?subject=Chest-rAi-Report&body=' +
      encodeURIComponent(formattedBody);
    location.href = mailToLink;
  }
}
