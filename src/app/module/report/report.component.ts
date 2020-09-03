import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { EventEmitterService } from '../../service/event-emitter.service';
import {
  PatientDetailData,
  InvokeReportData,
  ImpressionData,
} from '../auth/interface.modal';
import { CanvasImageComponent } from '../x-ray/component/canvas-image/canvas-image.component';
import { ImpressionComponent } from '../x-ray/component/impression/impression.component';
import { FindingsComponent } from '../x-ray/component/findings/findings.component';
import { SpinnerService } from '../shared/UI/spinner/spinner.service';
import { staticContentHTML } from 'src/app/constants/staticContentHTML';
import { ToastrService } from 'ngx-toastr';
declare var jsPDF: any;
@Component({
  selector: 'cxr-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
// ReportComponent class implementation
export class ReportComponent implements OnInit {
  patientInfo: PatientDetailData;
  showPrintForm = false;
  showPrintFormPdf = false;
  annotatedImage: string;
  status: string;
  pdfTitle: string;
  reportPageText: {
    patientDetails: string;
    clinicalHistory: string;
    impressions: string;
    findings: string;
    commentsAndRecommendations: string;
  };
  clinicalHistory: any;
  annotatedImpression: ImpressionData;
  pdfFindings: string;
  pdfComments: string;
  cxrPrintHeaderName = 'CXR Radiological Report';
  @ViewChild(CanvasImageComponent) canvas: CanvasImageComponent;
  @ViewChild(ImpressionComponent) impressions: ImpressionComponent;
  @ViewChild(FindingsComponent) findings: FindingsComponent;
  @ViewChild('content', { static: false }) content: ElementRef;
  readonly constants = staticContentHTML;

  /*
   * constructor for ReportComponent class
   */

  constructor(
    private router: Router,
    private eventEmitterService: EventEmitterService,
    private spinnerService: SpinnerService,
    private changeDetector: ChangeDetectorRef,
    private toastrService: ToastrService
  ) {
    this.eventEmitterService.commentSubject.subscribe((data) => {
      this.pdfComments = data;
      this.changeDetector.markForCheck();
    });
    this.eventEmitterService.findingsSubject.subscribe((data) => {
      this.pdfFindings = data;
      this.changeDetector.markForCheck();
    });
  }

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
    this.reportPageText = this.constants.reportPage;
    this.patientInfo = history.state.patientDetails;
    this.annotatedImage = sessionStorage.getItem('annotatedImage');
    if (this.patientInfo === undefined) {
      const patientInfo = JSON.parse(sessionStorage.getItem('patientDetail'));
      this.patientInfo = patientInfo;
    }
    if (this.patientInfo.status === false) {
      this.status = 'Drafted';
    } else {
      this.status = 'Unreported';
    }
    setTimeout(() => {
      this.spinnerService.hide();
    }, 2500);
  }

  impressionData(event: any) {
    this.annotatedImpression = event;
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

  makePdf(event) {
    this.spinnerService.show();
    this.showPrintFormPdf = event;
    const timestamp = Number(new Date());
    const hospitalPatientId = this.patientInfo.hospitalPatientId
      ? this.patientInfo.hospitalPatientId
      : this.patientInfo.name;
    this.pdfTitle = hospitalPatientId + '_' + timestamp;
    setTimeout(() => {
      const doc = new jsPDF();
      doc.addHTML(this.content.nativeElement, () => {
        doc.save(this.pdfTitle + '.pdf');
        this.toastrService.success(
          'filename: ' + this.pdfTitle + '.pdf',
          'X-ray report saved to downloads folder',
          {
            timeOut: 3000,
          }
        );
        this.showPrintFormPdf = false;
        this.spinnerService.hide();
      });
    }, 250);
  }
}
