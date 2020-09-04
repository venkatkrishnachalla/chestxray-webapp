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
import { fabric } from 'fabric';
import html2pdf from 'html2pdf.js';
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
  canvasDynamicWidth: number;
  canvasDynamicHeight: number;
  canvasCorrectedWidth: number;
  canvasCorrectedHeight: number;
  xRayImage: any;
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

  /**
   * This is to get the dimensions for image container.
   * @param {void} empty - A empty param
   * @example
   * setCanvasDimension();
   */

  setCanvasDimension() {
    this.canvasDynamicWidth = 367;
    this.canvasDynamicHeight = 367;
    this.generateCanvas();
  }

  /**
   * This is to generate a canvas using fabric.js .
   * @param {void} empty - A empty param
   * @example
   * generateCanvas();
   */

  generateCanvas() {
    fabric.Image.fromURL(this.annotatedImage, (img) => {
      this.xRayImage = img;
      this.setCanvasBackground();
    });
  }

  /**
   * function to compare image vs container aspect ratio width .
   * @param {string} value - A string param
   * @param {string} value - A string param
   * @example
   * getWidthFirst(imageAspectRatio, containerAspectRatio);
   */

  getWidthFirst(imageAspectRatio, containerAspectRatio) {
    return imageAspectRatio > containerAspectRatio;
  }

  /**
   * This is to setting BackgroundImage for canvas block .
   * @param {void} empty - A empty param
   * @example
   * setCanvasBackground();
   */

  setCanvasBackground() {
    const imageAspectRatio = this.xRayImage.width / this.xRayImage.height;
    const containerAspectRatio =
      this.canvasDynamicWidth / this.canvasDynamicHeight;
    const widthFirst = this.getWidthFirst(
      imageAspectRatio,
      containerAspectRatio
    );

    if (widthFirst) {
      this.canvasCorrectedWidth = this.canvasDynamicWidth;
      this.canvasCorrectedHeight = this.canvasCorrectedWidth / imageAspectRatio;
    } else {
      this.canvasCorrectedHeight = this.canvasDynamicHeight;
      this.canvasCorrectedWidth = this.canvasCorrectedHeight * imageAspectRatio;
    }
  }

  /**
   * This is to make Pdf, when user clicks share buttons.
   * @param event - A event param is boolean
   * @example
   * makePdf();
   */
  makePdf(event) {
    this.spinnerService.show();
    this.showPrintFormPdf = event;
    const timestamp = Number(new Date());
    const hospitalPatientId = this.patientInfo.hospitalPatientId
      ? this.patientInfo.hospitalPatientId
      : this.patientInfo.name;
    this.pdfTitle = hospitalPatientId + '_' + timestamp;
    setTimeout(() => {
      const element = document.getElementById('element-to-print');
      html2pdf(element, {
        margin: 0,
        filename: this.pdfTitle + '.pdf',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 2, logging: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
      }).then((pdf: any) => {
        this.showPrintFormPdf = false;
        this.spinnerService.hide();
        this.toastrService.success(
          'filename: ' + this.pdfTitle + '.pdf',
          'X-ray report saved to downloads folder',
          {
            timeOut: 3000,
          }
        );
      });
    }, 0);
  }
}
