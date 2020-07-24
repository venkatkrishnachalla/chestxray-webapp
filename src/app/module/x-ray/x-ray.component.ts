import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Options } from 'ng5-slider';
import { Subject, Subscription } from 'rxjs';
import { XRayService } from 'src/app/service/x-ray.service';
import { SpinnerService } from '../shared/UI/spinner/spinner.service';
import { Router } from '@angular/router';
import { EventEmitterService } from 'src/app/service/event-emitter.service';
import { CanvasImageComponent } from './component/canvas-image/canvas-image.component';
import { ImpressionComponent } from './component/impression/impression.component';
import { FindingsComponent } from './component/findings/findings.component';
import { ActionPanelComponent } from './component/action-panel/action-panel.component';
import { AuthService } from '../auth/auth.service';
import User from '../auth/user.modal';
import { MlApiData } from '../auth/interface.modal';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'cxr-x-ray',
  templateUrl: './x-ray.component.html',
  styleUrls: ['./x-ray.component.scss'],
})
export class XRayComponent implements OnInit, OnDestroy {
  eventsSubject: Subject<any> = new Subject<any>();
  showAskAI = false;
  acceptStatus = false;
  value = 70;
  options: Options = {
    floor: 0,
    ceil: 100,
    vertical: true,
  };

  values = 50;
  option: Options = {
    floor: 0,
    ceil: 100,
    vertical: true,
  };
  mLResponse;
  displayCanvas = true;
  displayErrorBlock = false;
  isHospitalRadiologist: boolean;
  userSubscription: Subscription;
  @ViewChild(CanvasImageComponent) canvas: CanvasImageComponent;
  @ViewChild(ImpressionComponent) impressions: ImpressionComponent;
  @ViewChild(FindingsComponent) findings: FindingsComponent;
  @ViewChild(ActionPanelComponent) actionPanel: ActionPanelComponent;

  constructor(
    private xrayService: XRayService,
    private spinnerService: SpinnerService,
    private router: Router,
    private eventEmitterService: EventEmitterService,
    private anotatedXrayService: XRayService,
    private authService: AuthService,
    private toastrService: ToastrService
  ) {}

  /*** component init function ***/
  ngOnInit(): void {
    this.eventEmitterService.invokeReportFunction.subscribe((impressions) => {
      this.eventEmitterService.onReportDataShared(impressions);
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

  /*** open ask ai model when user clicks on ask ai button ***/
  openAskAI(event: any) {
    this.spinnerService.show();
    const patientImage = JSON.parse(sessionStorage.getItem('PatientImage'));
    this.xrayService
      .getAskAiDetails(patientImage.base64Image, patientImage.filename)
      .subscribe(
        (mLResponse: MlApiData) => {
          this.mLResponse = mLResponse;
          const mLArray = this.mLResponse.data.ndarray[0].diseases;
          this.eventsSubject.next(mLResponse);
          this.actionPanel.disableAskAiButton();
          this.spinnerService.hide();
          if (mLArray.length === 0 || mLArray === undefined) {
            this.toastrService.error('No ML Predictions found');
          } else {
            this.toastrService.success('ML Predictions updated successfully');
          }
        },
        (errorMessage: string) => {
          this.displayCanvas = false;
          this.displayErrorBlock = true;
          this.spinnerService.hide();
          this.eventEmitterService.onErrorMessage({
            data: errorMessage,
          });
        }
      );
  }

  /* close ask ai model when user clicks on reject button */
  // rejectAI(event: any) {
  //   this.showAskAI = event;
  // }

  /* pass ml predictions data to canvas component */
  // acceptAI(event) {
  //   this.showAskAI = false;
  //   this.acceptStatus = true;
  //   // this.eventsSubject.next(event);
  // }

  // report() {
  //   this.router.navigateByUrl('/report');
  // }

  /*** report button click event ***/

  generateReport() {
    this.eventEmitterService.onComponentReportButtonClick({ check: 'report' });
    this.canvas.onSubmitPatientDetails();
    this.impressions.getImpressionsToReport();
    this.findings.getFindingsToReport();
  }

  /*** unsubscribe userSubscription event ***/

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
