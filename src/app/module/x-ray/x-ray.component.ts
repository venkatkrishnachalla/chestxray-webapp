import { Component, OnInit, ViewChild } from '@angular/core';
import { Options } from 'ng5-slider';
import { Subject } from 'rxjs';
import { XRayService } from 'src/app/service/x-ray.service';
import { SpinnerService } from '../shared/UI/spinner/spinner.service';
import { Router } from '@angular/router';
import { EventEmitterService } from 'src/app/service/event-emitter.service';
import { CanvasImageComponent } from './component/canvas-image/canvas-image.component';
import { ImpressionComponent } from './component/impression/impression.component';
import { FindingsComponent } from './component/findings/findings.component';

@Component({
  selector: 'cxr-x-ray',
  templateUrl: './x-ray.component.html',
  styleUrls: ['./x-ray.component.scss'],
})
export class XRayComponent implements OnInit {
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
  mLResponse: any[];
  @ViewChild(CanvasImageComponent) canvas: CanvasImageComponent;
  @ViewChild(ImpressionComponent) impressions: ImpressionComponent;
  @ViewChild(FindingsComponent) findings: FindingsComponent;

  constructor(
    private xrayService: XRayService,
    private spinnerService: SpinnerService,
    private router: Router,
    private eventEmitterService: EventEmitterService,
    private anotatedXrayService: XRayService
  ) {}

  ngOnInit(): void {
    this.eventEmitterService.invokeReportFunction.subscribe((impressions) => {
      this.eventEmitterService.onReportDataShared(impressions);
    });
  }

  /* open ask ai model when user clicks on ask ai button */
  openAskAI(event: any) {
    // this.showAskAI = !this.showAskAI;
    this.spinnerService.show();
    const patientImage = JSON.parse(sessionStorage.getItem('PatientImage'));
    this.xrayService.getAskAiDetails(patientImage.base64Image, patientImage.filename).subscribe(
      (mLResponse: any) => {
        this.mLResponse = mLResponse;
        this.eventsSubject.next(mLResponse);
        this.spinnerService.hide();
      },
      (errorMessage: any) => {
        this.spinnerService.hide();
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

  generateReport() {
    this.eventEmitterService.onComponentReportButtonClick({ check: 'report' });
    this.canvas.onSubmitPatientDetails();
    this.impressions.getImpressionsToReport();
    this.findings.getFindingsToReport();
  }
}
