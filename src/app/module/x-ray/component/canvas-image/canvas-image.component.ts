import {
  Component,
  OnInit,
  HostListener,
  Input,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';
import { fabric } from 'fabric';
import { SpinnerService } from 'src/app/module/shared/UI/spinner/spinner.service';
import { DashboardService } from 'src/app/service/dashboard.service';
import { xrayImageService } from 'src/app/service/canvasImage';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'cxr-canvas-image',
  templateUrl: './canvas-image.component.html',
  styleUrls: ['./canvas-image.component.scss'],
})
export class CanvasImageComponent implements OnInit, OnDestroy {
  private eventsSubscription: Subscription;
  @Input() events: Observable<void>;
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
  left: any;
  top: any;
  scaleFactor: any;

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

  /* initialization method */
  ngOnInit() {
    this.spinnerService.show();
    this.eventsSubscription = this.events.subscribe((mlResponse: any) =>
      this.drawEllipse(mlResponse)
    );
    this.canvas = new fabric.Canvas('c');
    this.patientId = localStorage.getItem('InstanceUID');
    if (!this.instanceId) {
      this.getPatientInstanceId(this.patientId);
    } else if (!this.patientImage) {
      this.getPatientImage(this.instanceId);
    } else {
      this.setCanvasDimension();
      this.setCanvasBackground();
    }
  }

  /* retrieve instance id */
  getPatientInstanceId(id) {
    this.xRayService
      .getPatientInstanceId(id)
      .subscribe((patientInstanceIdResponse: any) => {
        this.instanceId =
          patientInstanceIdResponse[0].seriesList[0].instanceList[0].id;
        this.spinnerService.hide();
        this.getPatientImage(this.instanceId);
      });
  }

  /* setting dimension for canvas container */
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

  /* retrieve patient image from server */
  getPatientImage(instanceID: string) {
    this.xRayService
      .getPatientImage(instanceID)
      .subscribe((PatientImageResponse: any) => {
        this.PatientImage = 'data:image/png;base64,' + PatientImageResponse;
        this.setCanvasDimension();
        this.generateCanvas();
      });
  }

  /* generate a canvas using fabric.js */
  generateCanvas() {
    fabric.Image.fromURL(this.PatientImage, (img) => {
      this.xRayImage = img;
      this.setCanvasBackground();
    });
  }

  getWidthFirst(imageaspectratio, containeraspectratio) {
    return imageaspectratio > containeraspectratio;
  }

  /* setting BackgroundImage for canvas block */
  setCanvasBackground() {
    const canvasAspect = this.canvasDynamicWidth / this.canvasDynamicHeight;
    const imgAspect = this.xRayImage.width / this.xRayImage.height;

    if (this.xRayImage.width > this.xRayImage.height) {
      // this.scaleFactor = this.canvasDynamicWidth / this.xRayImage.width;
      this.scaleFactor = this.canvasDynamicHeight / this.xRayImage.height;
      this.left = 0;
      this.top =
        -(this.xRayImage.height * this.scaleFactor - this.canvasDynamicHeight) /
        2;
    } else {
      this.scaleFactor = this.canvasDynamicHeight / this.xRayImage.height;
      this.top = 0;
      this.left =
        -(this.xRayImage.width * this.scaleFactor - this.canvasDynamicWidth) /
        2;
    }

    this.canvas.setBackgroundImage(
      this.xRayImage,
      this.canvas.requestRenderAll.bind(this.canvas),
      {
        opacity: 1,
        backgroundImageStretch: false,
        backgroundImageOpacity: 1,
        crossOrigin: 'anonymous',
        top: this.top,
        left: this.left,
        originX: 'left',
        originY: 'top',
        scaleX: this.scaleFactor,
        scaleY: this.scaleFactor,
      }
    );
    this.spinnerService.hide();
  }

  /* draw ellipse, when user hits ask ai accept button */
  drawEllipse(mlList: any) {
    const canvasScaleX = this.xRayImage.width / this.canvas.width;
    const canvasScaleY = this.xRayImage.height / this.canvas.height;
    mlList.forEach((diseaseItem) => {
      this.canvas.add(
        new fabric.Ellipse({
          id: diseaseItem.id,
          disease: diseaseItem.diseases,
          left: (diseaseItem.coordX as any) / canvasScaleX,
          top: (diseaseItem.coordY as any) / canvasScaleY,
          fill: diseaseItem.color,
          opacity: 0.3,
          selectable: true,
          originX: 'center',
          originY: 'center',
          rx: (diseaseItem.coordA as any) / canvasScaleX / 2,
          ry: (diseaseItem.coordB as any) / canvasScaleY / 2,
          angle: diseaseItem.coordAngle,
          stroke: 'black',
          hoverCursor: 'pointer',
        })
      );
    });
  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }
}
