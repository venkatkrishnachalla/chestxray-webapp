import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EventEmitterService } from '../../service/event-emitter.service';
import { PatientDetailData, InvokeReportData } from '../auth/interface.modal';
import { CanvasImageComponent } from '../x-ray/component/canvas-image/canvas-image.component';
import { ImpressionComponent } from '../x-ray/component/impression/impression.component';
import { FindingsComponent } from '../x-ray/component/findings/findings.component';
import { SpinnerService } from '../shared/UI/spinner/spinner.service';

@Component({
  selector: 'cxr-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
// ReportComponent class implementation  
export class ReportComponent implements OnInit {
  patientInfo: PatientDetailData;
  showPrintForm = false;
  @ViewChild(CanvasImageComponent) canvas: CanvasImageComponent;
  @ViewChild(ImpressionComponent) impressions: ImpressionComponent;
  @ViewChild(FindingsComponent) findings: FindingsComponent;
  
/*  
* constructor for ReportComponent class  
*/ 
  constructor(
    private router: Router,
    private eventEmitterService: EventEmitterService,
    private spinnerService: SpinnerService
  ) {}

/**  
* This is a init function.  
* @param {void} empty - A empty param  
* @example  
* ngOnInit();
*/ 
  ngOnInit(): void {
    this.spinnerService.show();
    this.showPrintForm = false;
    this.eventEmitterService.invokeReportDataFunction.subscribe(
      (data: InvokeReportData) => {
        switch (data.title) {
          case 'patientInfo':
            this.patientInfo = data.data;
            break;
          default:
            break;
        }
      }
    );
    setTimeout(() => {
      this.spinnerService.hide();
    }, 2500);
  }

  /**  
* This is a  event to go back to xray page .  
* @param {void} empty - A empty param  
* @example  
* goBackToXray();
*/ 
  goBackToXray() {
    this.eventEmitterService.onComponentButtonClick({
      data: [],
      title: 'stateData',
    });
    this.router.navigate(['x-ray'], {
      state: { patientDetails: this.patientInfo },
    });
  }

/**  
* This is a event to enable print preview selector.  
* @param {string} value - A string param 
* @example  
* enablePrint(event);
*/ 
  enablePrint(event) {
    this.showPrintForm = event;
  }
}
