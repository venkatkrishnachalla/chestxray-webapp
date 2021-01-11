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
import { EventEmitterService2 } from '../../service/event-emitter.service2';
import { XRayService } from 'src/app/service/x-ray.service';

@Component({
  selector: 'cxr-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
// ReportComponent class implementation
export class ReportComponent implements OnInit {
  patientInfo: any;
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
  signedDate: any;
  @ViewChild(CanvasImageComponent) canvas: CanvasImageComponent;
  @ViewChild(ImpressionComponent) impressions: ImpressionComponent;
  @ViewChild(FindingsComponent) findings: FindingsComponent;
  @ViewChild('content', { static: false }) content: ElementRef;
  readonly constants = staticContentHTML;
  signature:any;

  /*
   * constructor for ReportComponent class
   */

  constructor(
    private router: Router,
    private eventEmitterService: EventEmitterService,
    private eventEmitterService2: EventEmitterService2,
    private spinnerService: SpinnerService,
    private changeDetector: ChangeDetectorRef,
    private toastrService: ToastrService,
    private annotatedXrayService: XRayService,
  ) {
    this.eventEmitterService.commentSubject.subscribe((data) => {
      this.pdfComments = data;
      this.changeDetector.markForCheck();
    });
    this.eventEmitterService.findingsSubject.subscribe((data) => {
      this.pdfFindings = data;
      this.changeDetector.markForCheck();
    });
    this.eventEmitterService.onStatusChangeSubject.subscribe(
      (data: boolean) => {
        this.status = data === true ? 'Completed' : 'Not Started';
      }
    );
    this.eventEmitterService2.invokeshareEvent.subscribe((data) => {
      this.signature = data.sign;
      this.signedDate = data.signedDate;
      this.changeDetector.markForCheck();
      this.makePdf(data.filename);
    });
  }

  /**
   * This is a init function.
   * @param '{void}' empty - A empty param
   * @example
   * ngOnInit();
   */
  ngOnInit(): void {
    this.spinnerService.show();
    this.getSignature();
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
    if (this.patientInfo.xRayList[0].isAnnotated === false) {
      this.status = 'Not Started';
    } else {
      this.status = 'Completed';
    }
    setTimeout(() => {
      this.spinnerService.hide();
    }, 2500);
    sessionStorage.setItem('reportPageSelection', 'true');
  }

  getSignature(){
    this.annotatedXrayService.getSignature().subscribe(
      (response:any) => {
        const date = new Date(response.date).toLocaleString('es-CL')
        sessionStorage.setItem('signatureDateFromDB', JSON.stringify(date));
        sessionStorage.setItem('signatureFromDB', JSON.stringify(response.digitalSignature));
      },
      (errorMessage) => {
        // this.toastrService.error(errorMessage.error);
      }
    );
  }

  /**
   * This is a  impressionData function.
   * @param '{any}' any - A any param
   * @example
   * impressionData(event);
   */
  impressionData(event: any) {
    this.annotatedImpression = event;
  }

  /**
   * This is a  event to go back to xray page .
   * @param '{void}' empty - A empty param
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
   * @param '{string}' value - A string param
   * @example
   * enablePrint(event);
   */
  enablePrint(event) {
    this.showPrintForm = event;
  }

  /**
   * This is to get the dimensions for image container.
   * @param '{void}' empty - A empty param
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
   * @param '{void}' empty - A empty param
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
   * @param '{string}' value - A string param
   * @param '{string}' value - A string param
   * @example
   * getWidthFirst(imageAspectRatio, containerAspectRatio);
   */
  getWidthFirst(imageAspectRatio, containerAspectRatio) {
    return imageAspectRatio > containerAspectRatio;
  }

  /**
   * This is to setting BackgroundImage for canvas block .
   * @param '{void}' empty - A empty param
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
  makePdf(data) {
    this.spinnerService.show();
    this.showPrintFormPdf = true;
    this.pdfTitle = data;
    setTimeout(() => {
      const element = document.getElementById('element-to-print');
      html2pdf(element, {
        margin: 0,
        filename: this.pdfTitle,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 2, logging: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
      }).then((pdf: any) => {
        this.showPrintFormPdf = false;
        this.spinnerService.hide();
        this.toastrService.success(
          'filename: ' + this.pdfTitle,
          'X-ray report saved to downloads folder',
          {
            timeOut: 3000,
          }
        );
      });
    }, 0);
  }
}
