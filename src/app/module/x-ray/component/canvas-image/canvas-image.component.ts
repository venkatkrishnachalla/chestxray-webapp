import {
  Component,
  OnInit,
  HostListener,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { fabric } from 'fabric';
import { SpinnerService } from 'src/app/module/shared/UI/spinner/spinner.service';
import { DashboardService } from 'src/app/service/dashboard.service';
import { EventEmitterService } from 'src/app/service/event-emitter.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { pathology } from 'src/app/constants/pathologyConstants';
import { Observable } from 'rxjs';
import { StateGroup } from '../../healthDetails';
import { xrayImageService } from 'src/app/service/canvasImage';

@Component({
  selector: 'cxr-canvas-image',
  templateUrl: './canvas-image.component.html',
  styleUrls: ['./canvas-image.component.scss'],
})
export class CanvasImageComponent implements OnInit {
  @ViewChild('pathologyModal') pathologyModal: TemplateRef<any>;
  @ViewChild('deleteObject') deleteObjectModel: TemplateRef<any>;
  @ViewChild('controls') controlsModel: TemplateRef<any>;
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
  ellipse: any;
  isDown: any;
  origX: any;
  origY: any;
  enableDrawEllipseMode: boolean;
  readonly constants = pathology;
  pathologyNames: any;
  searchModel: string;
  selectedDisease: string;
  patientImage: any;
  instanceId: any;
  patientId: string;

  constructor(
    private spinnerService: SpinnerService,
    private router: Router,
    private dashboardService: DashboardService,
    private eventEmitterService: EventEmitterService,
    private dialog: MatDialog,
    private xRayService: xrayImageService
  ) {}

  @HostListener('window:resize', [])
  public onResize() {
    this.setCanvasDimension();
    this.setCanvasBackground();
  }

  ngOnInit() {
    this.pathologyNames = this.constants.diseases;
    this.enableDrawEllipseMode = false;
    this.isDown = false;
    if (this.eventEmitterService.subsVar == undefined) {
      this.eventEmitterService.subsVar = this.eventEmitterService.invokeComponentFunction.subscribe(
        (title: string) => {
          switch (title) {
            case 'Draw Ellipse':
              this.drawEllipse();
              break;
            case 'Free Hand Drawing':
              this.freeHandDrawing();
              break;
            case 'Delete':
              this.deleteEllipse();
              break;
            default:
              break;
          }
        }
      );
    }
    this.spinnerService.show();
    this.canvas = new fabric.Canvas('at-id-x-ray-Canvas', { selection: false });
    // fabric.Object.prototype.transparentCorners = false;
    fabric.Object.prototype.cornerColor = 'white';
    fabric.Object.prototype.cornerStyle = 'circle';
    fabric.Object.prototype.borderColor = 'white';
    this.patientId = localStorage.getItem('InstanceUID');
    if (!this.instanceId) {
      this.getPatientInstanceId(this.patientId);
    } else if (!this.patientImage) {
      this.getPatientImage(this.instanceId);
    } else {
      this.setCanvasDimension();
      this.setCanvasBackground();
    }
    this.canvas.on('object:selected', (evt) => {
      let selectedObject = this.canvas.getActiveObject();
      this.canvas.setActiveObject(selectedObject);
      if (!this.enableDrawEllipseMode) {
        this.dialog.open(this.controlsModel, {
          panelClass: 'my-class',
          hasBackdrop: false,
        });
      }
    });
    this.canvas.on('selection:cleared', (evt) => {
      if (!this.enableDrawEllipseMode) {
        this.dialog.closeAll();
      }
    });
    this.canvas.on('object:moving', (evt) => {
      if (!this.enableDrawEllipseMode) {
        this.dialog.closeAll();
      }
    });
  }

  updateSearchModel(value) {
    this.searchModel = value;
  }

  deleteObject(eventData, target) {
    var canvas = target.canvas;
    canvas.remove(target);
    canvas.requestRenderAll();
  }

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
        console.log('this.PatientImage', this.PatientImage);
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
      top =
        -(this.xRayImage.height * scaleFactor - this.canvasDynamicHeight) / 2;
    } else {
      scaleFactor = this.canvasDynamicHeight / this.xRayImage.height;
      top = 0;
      left =
        -(this.xRayImage.width * scaleFactor - this.canvasDynamicWidth) / 2;
    }

    this.canvas.setBackgroundImage(
      this.xRayImage,
      this.canvas.requestRenderAll.bind(this.canvas),
      {
        opacity: 1,
        backgroundImageStretch: false,
        backgroundImageOpacity: 1,
        crossOrigin: 'anonymous',
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
  /**
   Register click function from another component
   */
  firstComponentFunction(title) {
    this.eventEmitterService.onComponentButtonClick(title);
  }

  /**Draw Ellipse Functionality */
  drawEllipse() {
    var origX, origY;
    this.canvas.isDrawingMode = false;
    this.enableDrawEllipseMode = true;
    this.canvas.observe('mouse:down', (e) => {
      if (this.enableDrawEllipseMode == true) {
        this.isDown = true;
        var pointer = this.canvas.getPointer(e.e);
        this.origX = pointer.x;
        this.origY = pointer.y;

        var ellipse = new fabric.Ellipse({
          width: 0,
          height: 0,
          left: pointer.x,
          top: pointer.y,
          opacity: 0.3,
          strokeWidth: 1,
          fill: 'rgb(255,127,80)',
          selectable: true,
        });

        this.canvas.add(ellipse);
        this.canvas.renderAll();
        this.canvas.setActiveObject(ellipse);
      }
    });
    this.canvas.observe('mouse:move', (e) => {
      if (!this.isDown) return;
      let pointer = this.canvas.getPointer(e.e);
      let activeObj = this.canvas.getActiveObject();
      if (this.origX > pointer.x) {
        activeObj.set({
          left: Math.abs(pointer.x),
        });
      }
      if (this.origY > pointer.y) {
        activeObj.set({
          top: Math.abs(pointer.y),
        });
      }
      activeObj.set({
        rx: Math.abs(this.origX - pointer.x) / 2,
      });
      activeObj.set({
        ry: Math.abs(this.origY - pointer.y) / 2,
      });
      activeObj.setCoords();
      this.canvas.setActiveObject(activeObj);
      this.canvas.renderAll();
    });

    this.canvas.observe('mouse:up', (e) => {
      this.isDown = false;
      // this.canvas.forEachObject(function(o) {
      //   o.set({selectable: true}).setCoords();
      // }).selection = true;
      if (this.enableDrawEllipseMode) {
        this.openPathologyModal();
      }
      this.enableDrawEllipseMode = false;
    });
  }

  deleteEllipse() {
    let activeObject = this.canvas.getActiveObject();
    if (activeObject) {
      this.dialog.open(this.deleteObjectModel, {
        panelClass: 'my-class',
        disableClose: true,
      });
    } else {
      alert('Please select object first');
    }
  }
  /**
   * Delete active object
   */
  deletePrediction() {
    let activeObject = this.canvas.getActiveObject();
    this.canvas.remove(activeObject);
    this.dialog.closeAll();
  }
  /**
   * Open pathology model
   */
  openPathologyModal() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.restoreFocus = false;
    dialogConfig.autoFocus = true;
    dialogConfig.role = 'dialog';
    this.dialog.open(this.pathologyModal, {
      height: '500px',
      width: '350px',
    });
  }
  /**
   * Search pathology functionality
   */
  onSelect(event, item) {
    if (item.length == 0) {
      this.selectedDisease = event.target.textContent;
    } else if (item == '') {
      this.selectedDisease = event.target.textContent;
    }
  }
  /**
   * Emitting selected disease to Impression component
   */
  savePrediction() {
    this.eventEmitterService.onComponentDataShared(this.selectedDisease);
    this.selectedDisease = '';
    this.dialog.closeAll();
  }
  /**
   * Close Pathology modal functionality
   */
  closePathologyModal() {
    this.selectedDisease = '';
    this.canvas.remove(this.canvas.getActiveObject());
    this.canvas.renderAll();
    this.dialog.closeAll();
    this.canvas.discardActiveObject();
  }

  /**
   * Free hand Drawing functionality
   */
  freeHandDrawing() {
    this.enableDrawEllipseMode = false;
    this.canvas.isDrawingMode = true;
    this.canvas.observe('mouse:down', (e) => {
      let pointer = this.canvas.getPointer(e.e);
      this.origX = pointer.x;
      this.origY = pointer.y;
      this.ellipse = new fabric.Ellipse({
        width: 0,
        height: 0,
        left: pointer.x,
        top: pointer.y,
        originX: 'left',
        originY: 'top',
        stroke: 'black',
        hoverCursor: 'pointer',
        selection: true,
        opacity: 0.3,
        strokeWidth: 1,
        fill: 'rgb(255,127,80)',
        rx: 0,
        ry: 0,
        angle: 0,
        hasRotatingPoint: false,
      });
      this.canvas.add(this.ellipse);
      this.canvas.renderAll();
      this.canvas.setActiveObject(this.ellipse);
    });
    this.canvas.observe('mouse:move', function (e) {
      if (!this.isDown) return;
      let pointer = this.canvas.getPointer(e.e);
      this.ellipse.set({
        rx: Math.abs(this.origX - pointer.x),
        ry: Math.abs(this.origY - pointer.y),
      });
      this.canvas.renderAll();
    });

    this.canvas.on('mouse:up', function (o) {
      this.isDown = false;
      this.canvas.isDrawingMode = false;
    });
  }
}
