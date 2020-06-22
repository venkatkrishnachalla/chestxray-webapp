import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { fabric } from 'fabric';
import { SpinnerService } from '../../shared/UI/spinner/spinner.service';

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

  constructor(private spinnerService: SpinnerService, private router: Router) {}

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
    console.log(this.canvasDynamicWidth, this.canvasDynamicHeight);
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
    // this._service
    //   .getPatientImage(instanceID)
    //   .subscribe((data: HealthViewProcess) => {
    //     this.PatientImage = 'data:image/png;base64,' + data;
    //     sessionStorage.setItem('PatientImage', this.PatientImage);
    //     this.setCanvasDimension();
    //     this.generateCanvas();
    //   });
    const data =
      'https://www.pyimagesearch.com/wp-content/uploads/2020/03/covid19_keras_xray_example.jpg';
    this.PatientImage =
      'data:image/jpeg;base64,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';
    sessionStorage.setItem('PatientImage', this.PatientImage);
    this.setCanvasDimension();
    this.generateCanvas();
    this.spinnerService.hide();
  }

  generateCanvas() {
    fabric.Image.fromURL(this.PatientImage, (img) => {
      this.xRayImage = img;
      this.setCanvasBackground();
    });
  }

  setCanvasBackground() {
    this.xRayImage.set({
      opacity: 1,
      scaleX: this.canvasDynamicWidth / this.xRayImage.width,
      scaleY: this.canvasDynamicHeight / this.xRayImage.height,
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
