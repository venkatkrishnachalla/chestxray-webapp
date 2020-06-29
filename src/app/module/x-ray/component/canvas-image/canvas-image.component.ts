import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { fabric } from 'fabric';
import { SpinnerService } from 'src/app/module/shared/UI/spinner/spinner.service';
import { DashboardService } from 'src/app/service/dashboard.service';
import { xrayImageService } from 'src/app/service/canvasImage';

@Component({
  selector: 'cxr-canvas-image',
  templateUrl: './canvas-image.component.html',
  styleUrls: ['./canvas-image.component.scss'],
})
export class CanvasImageComponent implements OnInit {
  isLoading: boolean;
  studiesId: string;
  PatientImage: any;
  canvas: any;
  canvasDynamicWidth: number;
  canvasDynamicHeight: number;
  xRayImage: any;
  scaleX: number;
  scaleY: number;
  show = false;
  patientImage: any;
  instanceId: any;
  patientId: string;

  constructor(
    private spinnerService: SpinnerService,
    private router: Router,
    private dashboardService: DashboardService,
    private xRayService: xrayImageService
  ) {}

  @HostListener('window:resize', [])
  public onResize() {
    this.setCanvasDimension();
    this.setCanvasBackground();
  }

  ngOnInit() {
    this.spinnerService.show();
    this.canvas = new fabric.Canvas('c');
    this.patientId = localStorage.getItem('InstanceUID');
    if(!this.instanceId){
      this.getPatientInstanceId(this.patientId);
    }
    else if(!this.patientImage) {
      this.getPatientImage(this.instanceId);
    } else {
      this.setCanvasDimension();
      this.setCanvasBackground();
    }
  }

  getPatientInstanceId(id){
    this.xRayService
    .getPatientInstanceId(id)
    .subscribe((patientInstanceIdResponse: any) => {
      this.instanceId = patientInstanceIdResponse[0].seriesList[0].instanceList[0].id;
      this.spinnerService.hide();
      this.getPatientImage(this.instanceId);
    });
  }

  setCanvasDimension() {
    this.canvasDynamicWidth = document.getElementById(
      'x-ray-aspect-ratio-container'
    ).clientWidth;
    this.canvasDynamicHeight = document.getElementById(
      'x-ray-aspect-ratio-container'
    ).clientHeight;
    this.canvas.setDimensions({
      width: this.canvasDynamicWidth,
      height: this.canvasDynamicHeight,
    });
  }

  /**
   * Get Patient Image
   * @param {string} instanceID Patient ID
   * @return void
   */
  getPatientImage(instanceID: string) {
    this.xRayService
      .getPatientImage(instanceID)
      .subscribe((PatientImageResponse: any) => {
        this.PatientImage = 'data:image/png;base64,' + PatientImageResponse;
        console.log("this.PatientImage", this.PatientImage)
        this.setCanvasDimension();
        this.generateCanvas();
      });
  }

  generateCanvas() {
    fabric.Image.fromURL(this.PatientImage, (img) => {
      this.xRayImage = img;
      this.setCanvasBackground();
    });
  }

  setCanvasBackground() {
    const canvasAspect = this.canvasDynamicWidth / this.canvasDynamicHeight;
    const imgAspect = this.xRayImage.width / this.xRayImage.height;
    let left, top, scaleFactor;

    if (this.xRayImage.width > this.xRayImage.height) {
      scaleFactor = this.canvasDynamicWidth / this.xRayImage.width;
      left = 0;
      top = -((this.xRayImage.height * scaleFactor) - this.canvasDynamicHeight) / 2;
    } else {
      scaleFactor = this.canvasDynamicHeight / this.xRayImage.height;
      top = 0;
      left = -((this.xRayImage.width * scaleFactor) - this.canvasDynamicWidth) / 2;
    }

    this.canvas.setBackgroundImage(
      this.xRayImage,
      this.canvas.requestRenderAll.bind(this.canvas),
      {
        opacity: 1,
        backgroundImageStretch: false,
        backgroundImageOpacity: 1,
        crossOrigin: "anonymous",
        top: top,
        left: left,
        originX: 'left',
        originY: 'top',
        scaleX: scaleFactor,
        scaleY: scaleFactor,
      }
    );
    this.spinnerService.hide();
  }

  onProcessClickHandler() {
    this.router.navigateByUrl('/doctor');
  }
}
