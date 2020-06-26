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
  patientId: string;
  PatientImage: any;
  canvas: any;
  canvasDynamicWidth: number;
  canvasDynamicHeight: number;
  xRayImage: any;
  scaleX: number;
  scaleY: number;
  show = false;

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
    if (!this.PatientImage) {
      this.getPatientImage(this.patientId);
    } else {
      this.setCanvasDimension();
      this.setCanvasBackground();
    }
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
        console.log(this.PatientImage);
        this.setCanvasDimension();
        this.generateCanvas();
        this.spinnerService.hide();
      });
  }

  generateCanvas() {
    fabric.Image.fromURL(this.PatientImage, (img) => {
      this.xRayImage = img;
      this.setCanvasBackground();
    });
  }

  getWidthFirst(imageaspectratio, containeraspectratio) {
    return imageaspectratio > containeraspectratio;
  }

  setCanvasBackground() {
    let canvaswidth, canvasheight;
    const imageAspectRatio = this.xRayImage.width / this.xRayImage.height;
    const containerAspectRatio =
      this.canvasDynamicWidth / this.canvasDynamicHeight;
    let widthFirst = this.getWidthFirst(imageAspectRatio, containerAspectRatio);
    if (widthFirst) {
      canvaswidth = this.canvasDynamicWidth;
      canvasheight = canvaswidth / imageAspectRatio;
    } else {
      canvasheight = this.canvasDynamicHeight;
      canvaswidth = canvasheight * imageAspectRatio;
    }
    const center = this.canvas.getCenter();
    this.xRayImage.set({
      opacity: 1,
      width: canvaswidth,
      height: canvasheight,
      scaleX: 1,
      scaleY: 1,
      top: center.top,
      left: center.left,
      originX: 'center',
      originY: 'center',
    });
    this.canvas.setBackgroundImage(
      this.xRayImage,
      this.canvas.requestRenderAll.bind(this.canvas),
      {
        backgroundImageStretch: false,
        backgroundImageOpacity: 1,
        crossOrigin: 'anonymous',
      }
    );
  }

  onProcessClickHandler() {
    this.router.navigateByUrl('/doctor');
  }
}
