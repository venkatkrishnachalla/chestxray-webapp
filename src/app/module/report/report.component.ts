import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EventEmitterService } from '../../service/event-emitter.service';
import { PatientDetailData, InvokeReportData } from '../auth/interface.modal';
import { CanvasImageComponent } from '../x-ray/component/canvas-image/canvas-image.component';
import { ImpressionComponent } from '../x-ray/component/impression/impression.component';
import { FindingsComponent } from '../x-ray/component/findings/findings.component';

@Component({
  selector: 'cxr-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent implements OnInit {
  patientInfo: PatientDetailData;
  showPrintForm = false;
  @ViewChild(CanvasImageComponent) canvas: CanvasImageComponent;
  @ViewChild(ImpressionComponent) impressions: ImpressionComponent;
  @ViewChild(FindingsComponent) findings: FindingsComponent;
  constructor(
    private router: Router,
    private eventEmitterService: EventEmitterService
  ) {}

  /*** class init function ***/
  ngOnInit(): void {
    this.showPrintForm = false;
    this.eventEmitterService.invokeReportDataFunction.subscribe((data: InvokeReportData) => {
      switch (data.title) {
        case 'patientInfo':
          this.patientInfo = data.data;
          break;
        default:
          break;
      }
    });
  }

  /*** event to go back to xray page ***/
  goBackToXray() {
    this.eventEmitterService.onComponentButtonClick({
      data: [],
      title: 'stateData',
    });
    this.router.navigate(['x-ray'], {
      state: { patientDetails: this.patientInfo },
    });
  }

  /*** event to enable print preview selector ***/
  enablePrint(event) {
    this.showPrintForm = event;
  }
}
