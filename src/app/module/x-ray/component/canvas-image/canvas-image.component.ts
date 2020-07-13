import {
  Component,
  OnInit,
  HostListener,
  Input,
  OnDestroy,
  TemplateRef,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { Router } from '@angular/router';
import { fabric } from 'fabric';
import { SpinnerService } from 'src/app/module/shared/UI/spinner/spinner.service';
import { DashboardService } from 'src/app/service/dashboard.service';
import { EventEmitterService } from 'src/app/service/event-emitter.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { pathology } from 'src/app/constants/pathologyConstants';
import { StateGroup } from '../../healthDetails';
import { xrayImageService } from 'src/app/service/canvasImage';
import { Observable, Subscription, Subject } from 'rxjs';
import { XRayService } from 'src/app/service/x-ray.service';

@Component({
  selector: 'cxr-canvas-image',
  templateUrl: './canvas-image.component.html',
  styleUrls: ['./canvas-image.component.scss'],
})
export class CanvasImageComponent implements OnInit, OnDestroy {
  private eventsSubscription: Subscription;
  @Input() events: Observable<void>;
  @ViewChild('pathologyModal') pathologyModal: TemplateRef<any>;
  @ViewChild('deleteObject') deleteObjectModel: TemplateRef<any>;
  @ViewChild('controls') controlsModel: TemplateRef<any>;
  @Output() annotatedXrayEvent = new EventEmitter();
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
  canvasCorrectedHeight: number;
  canvasCorrectedWidth: number;
  left: any;
  top: any;
  scaleFactor: any;
  updateDisease: boolean;
  activeIcon: any;
  patientDetail: any;
  processedImage: any;

  constructor(
    private spinnerService: SpinnerService,
    private eventEmitterService: EventEmitterService,
    private dialog: MatDialog,
    private xRayService: xrayImageService,
    private annotatedXrayService: XRayService,
    private router: Router
  ) {}

  @HostListener('window:resize', [])
  public onResize() {
    this.setCanvasDimension();
    this.setCanvasBackground();
  }

  /* initialization method */
  ngOnInit() {
    this.pathologyNames = this.constants.diseases;
    this.enableDrawEllipseMode = false;
    this.isDown = false;
    if (this.eventEmitterService.subsVar === undefined) {
      this.eventEmitterService.subsVar = this.eventEmitterService.invokeComponentFunction.subscribe(
        (data: any) => {
          switch (data.title) {
            case 'Draw Ellipse':
              this.drawEllipse(data);
              break;
            case 'Free Hand Drawing':
              this.freeHandDrawing(data);
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
    this.eventsSubscription = this.events.subscribe((mlResponse: any) =>
      this.mlApiEllipseLoop(mlResponse)
    );
    this.canvas = new fabric.Canvas('at-id-x-ray-Canvas', { selection: false });
    fabric.Object.prototype.cornerColor = 'white';
    fabric.Object.prototype.cornerStyle = 'circle';
    fabric.Object.prototype.borderColor = 'white';
    this.patientDetail = history.state.patientDetails;
    this.PatientImage = sessionStorage.getItem('PatientImage');
    const isUser = sessionStorage.getItem('isIndividualRadiologist');
    this.patientId = this.patientDetail ? this.patientDetail.id : '';

    if (this.PatientImage && isUser === 'true') {
      this.setCanvasDimension();
      this.generateCanvas();
    } else if (!this.instanceId) {
      this.getPatientInstanceId(this.patientId);
    } else if (!this.PatientImage) {
      this.getPatientImage(this.instanceId);
    } else {
      this.setCanvasDimension();
      this.generateCanvas();
    }

    this.canvas.on('object:selected', (evt) => {
      const bodyRect = document.body.getBoundingClientRect();
      const right = bodyRect.right - this.canvas.getActiveObject().left;
      const top = this.canvas.getActiveObject().top - bodyRect.top;
      if (!this.enableDrawEllipseMode && this.canvas.isDrawingMode === false) {
        this.dialog.open(this.controlsModel, {
          panelClass: 'my-class',
          hasBackdrop: false,
          position: { right: right - 390 + 'px', top: top + 'px' },
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
  /**
   * Get Patient Instance ID
   * @param patientId Patient ID
   * @return void
   */

  /**
   * Get Patient Instance ID
   * @param patientId Patient ID
   * @return void
   */

  /* retrieve patient instance id from server */
  getPatientInstanceId(id) {
    this.xRayService
      .getPatientInstanceId(id)
      .subscribe((patientInstanceIdResponse: any) => {
        this.instanceId =
          patientInstanceIdResponse[0].seriesList[0].instanceList[0].id;
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
   * @param instanceID Patient ID
   * @return void
   */

  /* retrieve patient image from server */
  getPatientImage(instanceID: string) {
    this.xRayService
      .getPatientImage(instanceID)
      .subscribe((PatientImageResponse: any) => {
        this.PatientImage = 'data:image/png;base64,' + PatientImageResponse;
        sessionStorage.setItem('PatientImage', this.PatientImage);
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

  getWidthFirst(imageAspectRatio, containerAspectRatio) {
    return imageAspectRatio > containerAspectRatio;
  }

  /* setting BackgroundImage for canvas block */
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

    this.canvas.setWidth(this.canvasCorrectedWidth);
    this.canvas.setHeight(this.canvasCorrectedHeight);

    this.xRayImage.set({
      opacity: 1,
      scaleX: this.canvasCorrectedWidth / this.xRayImage.width,
      scaleY: this.canvasCorrectedHeight / this.xRayImage.height,
    });
    this.canvas.setBackgroundImage(
      this.xRayImage,
      this.canvas.renderAll.bind(this.canvas),
      {
        backgroundImageStretch: true,
        backgroundImageOpacity: 1,
        crossOrigin: 'anonymous',
      }
    );
    this.canvas.renderAll();
    this.spinnerService.hide();
  }

  /* draw ellipse, when user hits ask ai accept button */
  mlApiEllipseLoop(mlList: any) {
    const mLArray = mlList.data.ndarray[0];
    mLArray.Impression.forEach((impression: any) => {
      const impressionObject = {title: 'impression', id: impression[0], name: impression[1] };
      this.eventEmitterService.onComponentDataShared(impressionObject);
    });
    mLArray.diseases.forEach((disease: any) => {
      disease.ellipses.forEach((ellipse: any) => {
        ellipse.id = ellipse.index;
        ellipse.coordX = ellipse.x;
        ellipse.coordY = ellipse.y;
        ellipse.coordA = ellipse.a;
        ellipse.coordB = ellipse.b;
        ellipse.coordAngle = ellipse.r;
        ellipse.color = disease.color;
        this.drawEllipse([], true, ellipse);
      });
    });
  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }

  /**
   * Register click function from another component
   */
  firstComponentFunction(title) {
    this.eventEmitterService.onComponentButtonClick(title);
  }

  /**
   * Draw Ellipse Functionality 
   */
  drawEllipse(data, isMlAi?, diseaseItem?) {
    this.updateDisease = false;
    this.canvas.isDrawingMode = false;
    this.enableDrawEllipseMode = true;
    if (isMlAi) {
      const canvasScaleX = this.xRayImage.width / this.canvas.width;
      const canvasScaleY = this.xRayImage.height / this.canvas.height;
      this.canvas.add(
        new fabric.Ellipse({
          id: diseaseItem.id,
          disease: diseaseItem.diseases,
          left: (diseaseItem.x as any) / canvasScaleX,
          top: (diseaseItem.y as any) / canvasScaleY,
          rx: (diseaseItem.a as any) / canvasScaleX / 2,
          ry: (diseaseItem.b as any) / canvasScaleY / 2,
          angle: diseaseItem.r,
          stroke: 'white',
          strokeWidth: 2,
          fill: '',
          selectable: true,
        })
      );
    } else {
      this.activeIcon = data;
      if (!this.activeIcon.active) {
        this.enableDrawEllipseMode = false;
      } else {
        this.canvas.observe('mouse:down', (e) => {
          if (this.enableDrawEllipseMode === true) {
            this.isDown = true;
            const pointer = this.canvas.getPointer(e.e);
            this.origX = pointer.x;
            this.origY = pointer.y;

            const ellipse = new fabric.Ellipse({
              width: 0,
              height: 0,
              left: pointer.x,
              top: pointer.y,
              strokeWidth: 2,
              stroke: 'white',
              fill: '',
              selectable: true,
            });
            this.canvas.add(ellipse);
            this.canvas.renderAll();
            this.canvas.setActiveObject(ellipse);
          }
        });
        this.canvas.observe('mouse:move', (e) => {
          if (!this.isDown){
            return;
          }
          const pointer = this.canvas.getPointer(e.e);
          const activeObj = this.canvas.getActiveObject();
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
          if (this.enableDrawEllipseMode) {
            this.openPathologyModal();
          }
          this.enableDrawEllipseMode = false;
          this.canvas.defaultCursor = 'default';
        });
      }
    }
  }
  deleteEllipse() {
    const activeObject = this.canvas.getActiveObject();
    if (activeObject) {
      this.dialog.open(this.deleteObjectModel, {
        height: '240px',
        width: '320px',
        disableClose: true,
      });
    } else {
      alert('Please select object first');
    }
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
      width: '320px',
      disableClose: true,
    });
  }
  /**
   * Search pathology functionality
   */
  onSelect(event, item) {
    if (item.length === 0) {
      this.selectedDisease = event.target.textContent.replace(
        /[^a-zA-Z ]/g,
        ''
      );
    } else if (item === '') {
      this.selectedDisease = event.target.textContent.replace(/[^a-zA-Z]/g, '');
    }
  }
  /**
   * Emitting selected disease to Impression component
   */
  savePrediction() {
    const random = Math.floor(Math.random() * 100 + 1);
    this.canvas.getActiveObject().id = random;
    const selectedObject = { id: random, name: this.selectedDisease };
    this.eventEmitterService.onComponentDataShared(selectedObject);
    this.selectedDisease = '';
    this.activeIcon.active = false;
    this.dialog.closeAll();
  }

  /**
   * Delete active object
   */
  deletePrediction() {
    const selectedObject = {
      id: this.canvas.getActiveObject().id,
      check: 'delete',
    };
    this.eventEmitterService.onComponentButtonClick(selectedObject);
    const activeObject = this.canvas.getActiveObject();
    this.canvas.remove(activeObject);
    this.dialog.closeAll();
  }
  /**
   * Update active object
   */
  updatePrediction() {
    const selectedObject = {
      id: this.canvas.getActiveObject().id,
      check: 'update',
      name: this.selectedDisease,
    };
    this.eventEmitterService.onComponentButtonClick(selectedObject);
    this.selectedDisease = '';
    this.dialog.closeAll();
  }
  /**
   * Close Pathology modal functionality
   */
  closePathologyModal() {
    this.selectedDisease = '';
    if (!this.updateDisease) {
      this.canvas.remove(this.canvas.getActiveObject());
      this.canvas.renderAll();
      this.activeIcon.active = false;
    }
    this.dialog.closeAll();
  }

  /**
   * Free hand Drawing functionality
   */
  freeHandDrawing(data) {
    this.activeIcon = data;
    if (data.active) {
      this.updateDisease = false;
      this.enableDrawEllipseMode = false;
      this.canvas.isDrawingMode = true;
      this.canvas.freeDrawingBrush.color = 'white';
      this.canvas.freeDrawingBrush.width = 2;
      this.canvas.observe('object:added', (e) => {
        const object = e.target;
        this.canvas.setActiveObject(object);
        this.save();
      });
    } else {
      this.canvas.isDrawingMode = false;
    }
  }
  save() {
    if (this.canvas.isDrawingMode) {
      this.dialog.open(this.pathologyModal, {
        panelClass: 'my-class',
        disableClose: true,
      });
      this.canvas.isDrawingMode = false;
    }
  }
  updateEllipse() {
    this.updateDisease = true;
    this.dialog.open(this.pathologyModal, {
      panelClass: 'my-class',
      disableClose: true,
    });
  }
  onSubmitPatientDetails() {
    this.processedImage = this.canvas.toDataURL('image/png');
    this.annotatedXrayService.xrayAnnotatedService(this.processedImage);
    this.router.navigate(['report'], { state: { patientDetails: this.patientDetail } });
    // this.router.navigateByUrl('/report');
  }
}
