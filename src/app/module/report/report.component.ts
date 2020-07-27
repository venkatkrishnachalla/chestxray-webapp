import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EventEmitterService } from '../../service/event-emitter.service';
import { CanvasImageComponent } from '../x-ray/component/canvas-image/canvas-image.component';
import { ImpressionComponent } from '../x-ray/component/impression/impression.component';
import { FindingsComponent } from '../x-ray/component/findings/findings.component';

@Component({
  selector: 'cxr-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent implements OnInit {
  patientInfo: [];
  showPrintForm = false;
  @ViewChild(CanvasImageComponent) canvas: CanvasImageComponent;
  @ViewChild(ImpressionComponent) impressions: ImpressionComponent;
  @ViewChild(FindingsComponent) findings: FindingsComponent;
  constructor(
    private router: Router,
    private eventEmitterService: EventEmitterService
  ) {}

  ngOnInit(): void {
    this.eventEmitterService.invokeReportDataFunction.subscribe((data: any) => {
      switch (data.title) {
        case 'patientInfo':
          this.patientInfo = data.data;
          break;
        default:
          break;
      }
    });
  }

  goBackToXray() {
    this.eventEmitterService.onComponentButtonClick({
      data: [],
      title: 'stateData',
    });
    this.router.navigate(['x-ray'], {
      state: { patientDetails: this.patientInfo },
    });
  }

  enablePrint(event) {
    this.showPrintForm = event;
  }
}
