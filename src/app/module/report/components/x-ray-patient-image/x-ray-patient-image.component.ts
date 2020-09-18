import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { XRayService } from 'src/app/service/x-ray.service';
import { PatientDetailData } from 'src/app/module/auth/interface.modal';
import { fabric } from 'fabric';
import { CanvasImageComponent } from 'src/app/module/x-ray/component/canvas-image/canvas-image.component';
import { SpinnerService } from '../../../shared/UI/spinner/spinner.service';
import { ToastrService } from 'ngx-toastr';
import { XRayPatientDetailsComponent } from '../x-ray-patient-details/x-ray-patient-details.component';
import { EventEmitterService } from 'src/app/service/event-emitter.service';
import { constants } from 'buffer';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/module/auth/auth.service';
import User from 'src/app/module/auth/user.modal';
@Component({
  selector: 'cxr-x-ray-patient-image',
  templateUrl: './x-ray-patient-image.component.html',
  styleUrls: ['./x-ray-patient-image.component.scss'],
})

// XRayPatientImageComponent class implementation
export class XRayPatientImageComponent implements OnInit, OnDestroy {
  patientImage: any;
  xrayAnnotatedImage: string;
  xrayAnnotatedImpression: string;
  patientInfo: any;
  pdfTitle: string;
  annotatedFindings: any;
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
    private authService: AuthService,
    private spinnerService: SpinnerService,
    private toastrService: ToastrService,
    private eventEmitterService: EventEmitterService
  ) {
    this.eventEmitterService.findingsSubject.subscribe((data) => {
      this.annotatedFindings = data;
    });
  }

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
    this.annotatedXrayService
      .xrayAnnotatedFindingsService()
      .subscribe((findings: any[]) => {
        if (findings.indexOf(' ') !== -1) {
          findings.splice(findings.indexOf(' '), 1);
        }
        this.annotatedFindings = findings;
        this.eventEmitterService.findingsSubject.next(this.annotatedFindings);
      });
    if (Object.keys(this.annotatedFindings).length === 0) {
      const findings = JSON.parse(sessionStorage.getItem('findings'));
      this.annotatedFindings = findings;
      this.eventEmitterService.findingsSubject.next(this.annotatedFindings);
    }
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
   * This is a shareButtonEvent button click emit function.
   * @param - A empty param
   * @example
   * shareButtonEvent();
   */
  shareButtonEvent() {
    document.querySelector('input').click();
    const timestamp = Number(new Date());
    const hospitalPatientId = this.patientInfo.hospitalPatientId
      ? this.patientInfo.hospitalPatientId
      : this.patientInfo.name;
    const fileName = hospitalPatientId + '_' + timestamp + '.pdf';
    this.shareEvent.emit(fileName);
    const formattedBody =
      'X-ray Report for patient: ' +
      this.patientInfo.name +
      '\n\n\n' +
      '*** This is an automatically generated text...' +
      '\n' +
      'please attach the x-ray report from downloads folder.' +
      '\n' +
      'filename: ' +
      fileName +
      '\n\n';
    const mailToLink =
      'mailto:?subject=Chest-rAi-Report&body=' +
      encodeURIComponent(formattedBody);
    location.href = mailToLink;
  }

  /**
   * This is a print button click emit function.
   * @param {void} empty - A empty param
   * @example
   * printClick();
   */

  printClick() {
    this.printEvent.emit(true);
  }
  /**
   * This is a submit button click function.
   * @param {void} empty - A empty param
   * @example
   * submitReport();
   */

  submitReport() {
    let indexValue = 0;
    let indexValueDisease = 0;
    const data = sessionStorage.getItem('x-ray_Data');
    // tslint:disable-next-line: no-string-literal
    const annotationData = JSON.parse(data)['data'].ndarray[0];
    annotationData.Impression.forEach((element) => {
      element.index = indexValue;
      indexValue++;
    });
    annotationData.diseases.forEach((element) => {
      delete element.index;
      (element.contours = [{}]),
        element.ellipses.forEach((ellipse) => {
          delete ellipse.index;
          delete ellipse.type;
          delete ellipse.id;
          delete ellipse.color;
          delete ellipse.name;
          delete ellipse.idvalue;
        });
      element.idx = indexValueDisease;
      indexValueDisease++;
    });

    if (Object.keys(annotationData.Findings).length === 0) {
      annotationData.Findings = {
        additional: [],
        bonythorax: [],
        cardiacsilhouette: [],
        costophrenicangles: [],
        domesofdiaphragm: [],
        hilarmediastinal: [],
        lungfields: [],
      };
    }
    this.spinnerService.show();
    this.annotatedFindings.forEach((input) => {
      const output = input.split(':');
      let outputSub;
      let outputMain;
      if (input.indexOf(':') !== -1) {
        outputSub = output[1].split(',');
        outputMain = output[0]
          .toLowerCase()
          .replace(/\//g, '')
          .replace(/ /g, '');
      } else {
        outputSub = input.split(',');
        outputMain = 'additional';
      }
      if (outputSub.length > 1) {
        outputSub.forEach((finalOutput) => {
          finalOutput = finalOutput.replace(/\//g, '').replace(/ /g, '');
          const index = annotationData.Impression.findIndex(
            (x) => x.sentence === finalOutput
          );
          if (index === -1) {
            const length = annotationData.Impression.length;
            const impressionIndex = annotationData.Impression[length - 1].index;
            const newImpression = {
              index: impressionIndex + 1,
              sentence: finalOutput,
            };
            if (finalOutput !== '') {
              if (
                annotationData.Impression.findIndex(
                  (s) => s.sentence === finalOutput.trim()
                ) === -1
              ) {
                annotationData.Impression.push(newImpression);
              }
              annotationData.Findings[outputMain].push(impressionIndex + 1);
            }
          } else {
            annotationData.Findings[outputMain].push(index);
          }
        });
      } else if (output[0] !== ' ') {
        // tslint:disable-next-line: max-line-length
        const index = annotationData.Impression.findIndex(
          (x) => x.sentence === (output[1] ? output[1].trim() : '')
        );
        if (index === -1) {
          const length = annotationData.Impression.length;
          const impressionIndex = annotationData.Impression[length - 1].index;
          const newImpression = {
            index: impressionIndex + 1,
            sentence: output[1],
          };
          if (output[1] !== '') {
            if (
              annotationData.Impression.findIndex(
                (s) => s.sentence === (output[1] ? output[1].trim() : '')
              ) === -1
            ) {
              annotationData.Impression.push(newImpression);
            }
            annotationData.Findings[outputMain].push(impressionIndex + 1);
          }
        } else {
          annotationData.Findings[outputMain].push(index);
        }
      }
    });
    const FinalData = {
      studyId: this.patientInfo.studyId,
      seriesId: this.patientInfo.seriesId,
      findings: annotationData.Findings,
      impressions: annotationData.Impression,
      diseases: annotationData.diseases,
      updatedBy: this.patientInfo.assignedTo,
      updatedOn: new Date().toJSON().slice(0, 10),
    };
    this.annotatedXrayService.submitReport(FinalData).subscribe(
      (response) => {
        this.spinnerService.hide();
        this.toastrService.success('Report submitted successfully');
        this.patientInfo.isAnnotated = true;
      },
      (errorMessage: string) => {
        this.spinnerService.hide();
        this.toastrService.error('Failed to submit annotated data');
      }
    );
  }

  /**
   * This is on handle event to capture file details
   * @param {void} empty - A empty param
   * @example
   * handle();
   */
  handle(e) {
    const fileEvent = e;
  }

  /**
   * This is on unsubscribe user subscription after moving out from this component
   * @param {void} empty - A empty param
   * @example
   * ngOnDestroy();
   */

  // ngOnDestroy() {
  //   this.userSubscription.unsubscribe();
  // }
}
