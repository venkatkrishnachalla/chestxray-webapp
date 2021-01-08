import { Component, Input, ViewChild, OnInit, HostListener, ElementRef,Output,
  EventEmitter, TemplateRef} from '@angular/core';
import { XRayService } from 'src/app/service/x-ray.service';
import { SpinnerService } from '../../../shared/UI/spinner/spinner.service';
import { ToastrService } from 'ngx-toastr';
import { EventEmitterService2 } from '../../../../service/event-emitter.service2';
import { EventEmitterService } from '../../../../service/event-emitter.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/module/auth/auth.service';
import User from 'src/app/module/auth/user.modal';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'cxr-signature',
  template: `
  <input type="file" class="input-file" (change)="handle($event)" />
  <mat-radio-group aria-label="Select an option">
    <mat-radio-button *ngIf="showSignatureRadio" value="exist" (click)="radioFun('exist')" [checked]='showSignatureRadio'>Do you want to use existing signature?</mat-radio-button><br />
    <img alt="No Image" [src]="savedImage" *ngIf="showSignature"><br />
    <mat-radio-button value="new" (click)="radioFun('new')" [checked]="!showSignatureRadio">Draw new signature below</mat-radio-button>
    <mat-card *ngIf="showSignatureCard">
      <mat-card-content>
        <canvas #sigPad width="600" height="200" (mousedown)="onMouseDown($event)"
        (mousemove)="onMouseMove($event)"></canvas>
      </mat-card-content>
  </mat-card>
  </mat-radio-group>
  <button mat-button class="primary" *ngIf="shareButtonClicked" (click)="shareReport()">Share Report</button>
  <button mat-button class="primary" *ngIf="printBtnClicked" (click)="useInReport()"
      printSectionId="print-section"
      printTitle="{{ pdfTitle }}"
      ngxPrint
      styleSheetFile="assets/css/patient-details.css" [disabled]='disableSave'>Use this signature</button>
  <button mat-button class="primary" *ngIf="displayBtn1 && !printBtnClicked && !shareButtonClicked" (click)="delete()">Delete signature</button>
  <button mat-button class="primary" *ngIf="displayBtn2 && !printBtnClicked && !shareButtonClicked" (click)="save()" [disabled]='disableSave'>save</button>
  <button mat-button class="primary" *ngIf="displayBtn3" (click)="clear()">clear</button>
  <ng-template #deleteObject>
    <div class="container">
    <h2 class="deleteSignature"></h2>
    <mat-dialog-content id="deleteSignature" align="center">
      <h2>Are you sure ?</h2>
      <div class="sub-delete-title">
        Do you really want to delete this Signature?
      </div>
    </mat-dialog-content>
    <mat-dialog-actions id="deleteSignature" align="center">
      <button
        class="deleteSignature"
        mat-raised-button
        (click)="deleteSignature()"
        [mat-dialog-close]="true"
        cdkFocusInitial
        style='color: #000000 !important'
      >
        DELETE
      </button>
      <button (click)="cancelDelete()" style='color: #000000 !important' class="cancelSignature" mat-raised-button mat-dialog-close>
        CANCEL
      </button>
    </mat-dialog-actions>
    </div>
  </ng-template>`,
  styles: [`
    mat-card{
      margin: 2%;
      border: 1px solid;

    }
    .input-file {
      display: none;
    }
    button.primary{
      margin: 10px;
      border: 1px solid;
      background-color: lavenderblush;
      float: right;
      margin-right: 15px;
    }
    mat-label{
      margin-left: 15px;
    }
    mat-dialog-content#deleteSignature {
      display: table-cell;
      padding: 10px 25px 23px 20px;
      border-radius: 7px;
      color: white;
      min-height: 300px;
      width: 350px;
      h2 {
        font-weight: 400;
        padding-bottom: 1rem;
      }
      .sub-delete-title {
        font-size: 1.3rem;
      }
    }
    mat-dialog-actions#deleteSignature {
      justify-content: space-between;
      margin-top: 0.8rem;
      .deleteSignature {
        width: 110px !important;
        height: 35px !important;
        font-size: 1.5rem !important;
        background-color: #5d5f64 !important;
      }
      .deleteSignature:hover {
        background-color: #ff4d4d !important;
      }
      .cancelSignature {
        width: 110px !important;
        height: 35px !important;
        font-size: 1.5rem !important;
        background-color: #5d5f64 !important;
      }
      .cancelSignature:hover {
        background-color: rgb(159, 160, 159) !important;
      }
    }
    .backdropClass{
      z-index: 1000 !important;
    }
  `]
})
export class SignatureComponent implements OnInit {
  @Output() printEvent = new EventEmitter();
  @Input() name: string;
  @Input() printBtnClicked: boolean;
  @Input() shareButtonClicked: boolean;
  @Output() shareEvent = new EventEmitter();
  private elementRef: ElementRef;
  @ViewChild('sigPad') set controlElRef(elementRef: ElementRef) {
    this.elementRef = elementRef;
  }
  sigPadElement;
  context;
  isDrawing = false;
  img;
  storeSignature:boolean = false;
  savedImage:any;
  showSignature: boolean = false;
  showSignatureRadio: boolean = true;
  displayBtn1: boolean = true;
  displayBtn2: boolean = false;
  displayBtn3: boolean = false;
  showSignatureCard: boolean = true;
  disableSave: boolean = true;
  patientInfo:any;
  pdfTitle:string;
  isHospitalRadiologist: boolean;
  userSubscription: Subscription;
  clickedPrintBtn:boolean = true;
  @ViewChild('deleteObject') deleteObjectModel: TemplateRef<any>;
  showPrintFormPdf: boolean = false;
  // showPrintForm: boolean = false;
  cxrPrintHeaderName = 'CXR Radiological Report';
  reportPageText: {
    patientDetails: string;
    clinicalHistory: string;
    impressions: string;
    findings: string;
    commentsAndRecommendations: string;
  };

  constructor(
    private annotatedXrayService: XRayService,
    private spinnerService: SpinnerService,
    private toastrService: ToastrService,
    private eventEmitterService2: EventEmitterService2,
    private eventEmitterService: EventEmitterService,
    private authService: AuthService,
    private dialog: MatDialog,
  ){
  }

  ngOnInit() {
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
      this.savedImage = JSON.parse(sessionStorage.getItem('signatureFromDB'));
      if (this.savedImage){
        this.showSignature = true;
        this.img = JSON.parse(sessionStorage.getItem('signatureFromDB'));
        this.printEvent.emit(true);
        if (!this.isHospitalRadiologist) {
          this.eventEmitterService.onStatusChangeSubject.next(true);
        }
        this.eventEmitterService2.oneSignatureChanges.next(this.img);
      }
      else{
        this.showSignatureCard = true;
        this.showSignature = false;
        this.displayBtn1 = false;
        this.displayBtn2 = true;
        this.displayBtn3 = true;
        this.showSignatureRadio = false;
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

  radioFun(check){
    if (check === 'exist'){
      this.showSignature = true;
      this.displayBtn1 = true;
      this.displayBtn2 = false;
      this.displayBtn3 = false;
      this.clear();
      this.img = JSON.parse(sessionStorage.getItem('signatureFromDB'));
      this.printEvent.emit(true);
      if (!this.isHospitalRadiologist) {
        this.eventEmitterService.onStatusChangeSubject.next(true);
      }
      this.eventEmitterService2.oneSignatureChanges.next(this.img);
      if (this.printBtnClicked){
        this.disableSave = false;
      }
    }
    else{
      if (this.savedImage && !this.printBtnClicked && this.showSignature && !this.shareButtonClicked){
        alert('Please delete existing signature before drawing new one');
        event.preventDefault();
        return;
      }
      this.showSignatureCard = true;
      this.showSignature = false;
      this.displayBtn1 = false;
      this.displayBtn2 = true;
      if (this.printBtnClicked){
        this.displayBtn3 = true;
        this.disableSave = true;
      }
    }
  }

  useInReport(){
    this.printBtnClicked = false;
    this.eventEmitterService2.OnSignatureDialogClose();
  }

  /**
   * This is on handle event to capture file details
   * @param '{any}' any - A any param
   * @example
   * handle(e);
   */
  handle(e) {
    const fileEvent = e;
  }
  
  shareReport(){
    this.shareButtonClicked = false;
    if (this.showSignature === true){
      this.img = JSON.parse(sessionStorage.getItem('signatureFromDB'));
    } else{
      this.img = this.sigPadElement.toDataURL("image/png");
    }
    document.querySelector('input').click();
    const timestamp = Number(new Date());
    const hospitalPatientId = this.patientInfo.hospitalPatientId
      ? this.patientInfo.hospitalPatientId
      : this.patientInfo.name;
    const fileName = hospitalPatientId + '_' + timestamp + '.pdf';
    this.eventEmitterService2.shareEvent(fileName, this.img);
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
    this.eventEmitterService2.OnSignatureDialogClose();
  }

  ngAfterViewInit(){
    if (this.printBtnClicked){
      this.disableSave = false;
    }
    this.sigPadElement = this.elementRef.nativeElement;
    this.context = this.sigPadElement.getContext('2d');
    this.context.strokeStyle = '#3742fa';
    // if (this.savedImage){
    //   this.showSignatureCard = false;
    // }
    // else{
      this.showSignatureCard = true;
    // }
  }


  @HostListener('document:mouseup', ['$event'])
  onMouseUp(e) {
    this.isDrawing = false;
  }

  onMouseDown(e) {
    if (this.showSignature === true){
      return;
    }
    this.isDrawing = true;
    const coords = this.relativeCoords(e);
    this.context.moveTo(coords.x, coords.y);
  }

  onMouseMove(e) {
    if (this.isDrawing) {
      const coords = this.relativeCoords(e);
      this.context.lineTo(coords.x, coords.y);
      this.context.strokeStyle = '#3742fa';
      this.context.stroke();
      this.disableSave = false;
      this.img = this.sigPadElement.toDataURL("image/png");
      this.printEvent.emit(true);
      if (!this.isHospitalRadiologist) {
        this.eventEmitterService.onStatusChangeSubject.next(true);
      }
      this.eventEmitterService2.oneSignatureChanges.next(this.img);
    }
  }

  private relativeCoords(event) {
    const bounds = event.target.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    return { x: x, y: y };
  }

  clear() {
    this.context.clearRect(0, 0, this.sigPadElement.width, this.sigPadElement.height);
    this.context.beginPath();
    this.disableSave = true;
    if (this.printBtnClicked){
      this.img = this.sigPadElement.toDataURL("image/png");
      this.eventEmitterService.onStatusChangeSubject.next(true);
      this.eventEmitterService2.oneSignatureChanges.next(this.img);
    }
  }

  deleteSignature(){
    this.spinnerService.show();
    this.annotatedXrayService.deleteSignature().subscribe(
      (response) => {
        this.showSignatureRadio = false;
        this.showSignature = false;
        this.showSignatureCard = true;
        this.displayBtn1 = false;
        this.displayBtn2 = true;
        this.displayBtn3 = true;
        sessionStorage.removeItem('signatureFromDB');
        this.spinnerService.hide();
        this.toastrService.success('Signature deleted successfully');
      },
      (errorMessage) => {
        this.spinnerService.hide();
        this.toastrService.error(errorMessage.error);
      }
    );
  }

  delete(){
    this.dialog.open(this.deleteObjectModel, {
      height: '240px',
      width: '320px',
      disableClose: true,
      closeOnNavigation: true,
      backdropClass: 'backdropClass',
    });
  }

  /**
   * This is cancelDelete function
   * @param '{void}' empty - A empty param
   * @example
   * cancelDelete();
   */
  cancelDelete() {
    this.dialog.closeAll();
  }

  save() {
    this.spinnerService.show();
    this.img = this.sigPadElement.toDataURL("image/png");
    this.annotatedXrayService.saveSignature(this.img).subscribe(
      (response) => {
        sessionStorage.removeItem('signatureFromDB');
        sessionStorage.setItem('signatureFromDB', JSON.stringify(this.img));
        this.eventEmitterService2.OnSignatureDialogClose();
        this.spinnerService.hide();
        this.toastrService.success('Signature saved successfully');
      },
      (errorMessage) => {
        this.spinnerService.hide();
        this.toastrService.error(errorMessage.error);
      }
    );
  }

}
