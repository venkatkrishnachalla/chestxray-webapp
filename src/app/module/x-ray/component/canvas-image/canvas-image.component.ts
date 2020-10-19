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
  ElementRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { fabric } from 'fabric';
import { SpinnerService } from 'src/app/module/shared/UI/spinner/spinner.service';
import { DashboardService } from 'src/app/service/dashboard.service';
import { EventEmitterService } from 'src/app/service/event-emitter.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { pathology } from 'src/app/constants/pathologyConstants';
import {
  StateGroup,
  SaveEllipse,
  SaveFreeHandDrawing,
  UpdateEllipse,
  UpdateFreeHandDrawing,
} from '../../healthDetails';
import { XRayImageService } from 'src/app/service/canvasImage';
import { Observable, Subscription, Subject } from 'rxjs';
import { XRayService } from 'src/app/service/x-ray.service';
import {
  DISEASE_COLOR_MAPPING,
  RANDOM_COLOR,
} from '../../../../constants/findingColorConstants';
import { ToastrService } from 'ngx-toastr';
import {
  PatientDetailData,
  MlApiData,
  InvokeComponentData,
} from 'src/app/module/auth/interface.modal';
import { timeStamp } from 'console';
import * as cloneDeep from 'lodash/cloneDeep';
import { DomSanitizer } from '@angular/platform-browser';
import { EventEmitterService2 } from '../../../../service/event-emitter.service2';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { constants } from 'os';
import { NgxIndexedDBService } from 'ngx-indexed-db';

@Component({
  selector: 'cxr-canvas-image',
  templateUrl: './canvas-image.component.html',
  styleUrls: ['./canvas-image.component.scss'],
})
// CanvasImageComponent class implementation
export class CanvasImageComponent implements OnInit, OnDestroy {
  private eventsSubscription: Subscription;
  @Input() events: Observable<void>;
  @ViewChild('pathologyModal') pathologyModal: TemplateRef<any>;
  @ViewChild('deleteObject') deleteObjectModel: TemplateRef<any>;
  @ViewChild('controls') controlsModel: TemplateRef<any>;
  @ViewChild('myDiv') myDiv: ElementRef;
  @Output() annotatedXrayEvent = new EventEmitter();
  isLoading: boolean;
  studiesId: string;
  PatientImage: string;
  canvas: any;
  canvasDynamicWidth: number;
  canvasDynamicHeight: number;
  xRayImage: any;
  scaleX: number;
  scaleY: number;
  show = false;
  ellipse: any;
  isDown: boolean;
  origX: any;
  origY: any;
  enableDrawEllipseMode: boolean;
  readonly constants = pathology;
  pathologyNames: any;
  searchModel: string;
  selectedDisease: string;
  instanceId: string;
  patientId: string;
  canvasCorrectedHeight: number;
  canvasCorrectedWidth: number;
  updateDisease: boolean;
  activeIcon: any;
  patientDetail: PatientDetailData;
  ellipseList: any[];
  findingsList: any[];
  processedImage: string;
  showError: boolean;
  errorMessage: string;
  errorStatus: any;
  canvasScaleX: number;
  canvasScaleY: number;
  savedObjects = [];
  mlArray: MlApiData;
  getObject: boolean;
  selectedObjectPrediction: any;
  addedEllipse = [];
  mlPrediction = [];
  selectedPathArray = [];
  sessionSelectedFreeDrawObject = [];
  coordinateList = [];
  freeHandDrawStroke: any;
  impressionArray = [];
  sessionSelectedEllipseObject = [];
  sampleData: object;
  savedInfo: object;
  selectedDiseases = false;
  selectedMainDisease = false;
  selectedSubDisease = false;
  type = '';
  left;
  top;
  _subscription: Subscription;
  zoomInEnable: boolean;
  shiftKeyDown: boolean;
  mouseDownPoint: null;
  resize: boolean;
  Direction = {
    LEFT: 0,
    UP: 1,
    RIGHT: 2,
    DOWN: 3,
  };
  isChangeable: boolean;
  scaleFactor: number;
  displayScaleFactor: number;
  fixedScale: number;
  displayScaleFactorBlock: boolean;
  brightnessRange: number;
  contrastRange: number;
  checkBrightnessContrast: string;
  brightness: any;
  contrast: any;
  scalingProperties: any;
  savedAnnotations: any;
  diffusePathologyNames: any;
  diseaseType: string;
  diffuseObject: any;
  objectAngle: number;
  lockRotation: boolean;
  enableFreeHandDrawing: boolean;
  freeHandDraw: any;
  objectSelected: boolean;
  selctedObjectArray: any;
  objectModified: boolean;

  /*
   * constructor for CanvasImageComponent class
   */
  constructor(
    private spinnerService: SpinnerService,
    private eventEmitterService: EventEmitterService,
    private dialog: MatDialog,
    private xRayService: XRayImageService,
    private annotatedXrayService: XRayService,
    private router: Router,
    private toastrService: ToastrService,
    private sanitizer: DomSanitizer,
    private eventEmitterService2: EventEmitterService2,
    private dbService: NgxIndexedDBService
  ) {
    this._subscription = this.eventEmitterService.invokePrevNextButtonDataFunction.subscribe(
      (patientId: string) => {
        if (patientId) {
          this.prevNextPatientChange(patientId);
        }
      }
    );
  }

  /**
   * This is a host listener when resizing window.
   * @param '{string}' value - A string param
   * @param' {any}' array - A array param
   * @example
   * HostListener('window:resize', []);
   */
  @HostListener('window:resize', [])
  public onResize() {
    this.canvasDynamicHeight = 0;
    this.canvasDynamicWidth = 0;
    this.canvasScaleX = 0;
    this.canvasScaleY = 0;
    this.resize = true;
    this.canvas.clear(fabric.Ellipse);
    this.canvas.clear(fabric.Path);
    this.resetZoom();
    this.keepPositionInBounds(this.canvas);
    this.setCanvasDimension();
    this.setCanvasBackground();
    this.getSessionEllipse();
    this.getSessionFreeHandDrawing();
  }

  /**
   * This is a init function.
   * @param '{void}' empty - A empty param
   * @example
   * ngOnInit();
   */
  ngOnInit() {
    this.isChangeable = true;
    this.shiftKeyDown = false;
    this.displayScaleFactor = 1.0;
    this.displayScaleFactorBlock = false;
    this.resize = false;
    sessionStorage.removeItem('ellipse');
    let patientInfo = history.state.patientDetails;
    if (patientInfo === undefined) {
      patientInfo = JSON.parse(sessionStorage.getItem('patientDetail'));
    }
    if (patientInfo.xRayList[0].isAnnotated) {
      this.getStoredAnnotations(patientInfo.xRayList[0].xRayId);
    }
    this.savedInfo = {
      data: {
        names: [],
        ndarray: [
          {
            Findings: {},
            Impression: [],
            diseases: [],
          },
        ],
      },
      meta: {},
    };
    this.pathologyNames = this.constants.diseases;
    this.enableDrawEllipseMode = false;
    this.isDown = false;
    this.eventEmitterService.brightnessValue.subscribe((data: number) => {
      this.getBrightness(data);
    });
    this.eventEmitterService.contrastValue.subscribe((data: number) => {
      this.getContrast(data);
    });
    this.eventEmitterService.invokeComponentFunction.subscribe(
      (data: InvokeComponentData) => {
        switch (data.title) {
          case 'Draw Ellipse':
            this.drawEllipse(data);
            break;
          case 'Free Hand Drawing':
            this.freeHandDrawing(data);
            break;
          case 'pathology':
            this.diffusePathology(data);
            break;
          case 'Delete':
            break;
          default:
            break;
        }
      }
    );
    this.eventEmitterService.invokeImpressionFunction.subscribe(
      (data: InvokeComponentData) => {
        switch (data.title) {
          case 'All':
            // tslint:disable-next-line:no-string-literal
            this.ellipseLists(data['check'], '');
            break;
          case 'Single':
            this.showHideAnnotations(data);
            break;
          case 'showAll':
            this.isChangeable = true;
            break;
          case 'hideAll':
            this.isChangeable = false;
            break;
          default:
            break;
        }
      }
    );
    this.eventEmitterService.deleteDiffuseImpression.subscribe((data: any) => {
      this.deleteEllipse(data);
    });
    this.spinnerService.show();
    this.eventsSubscription = this.events.subscribe(
      (mlResponse: any) => {
        // tslint:disable-next-line: no-string-literal
        this.savedInfo['data'].ndarray[0].Findings =
          mlResponse.data.ndarray[0].Findings;
        mlResponse.data.ndarray[0].Impression.forEach((element) => {
          element.source = 'ML';
          // tslint:disable-next-line: no-string-literal
          this.savedInfo['data'].ndarray[0].Impression.push(element);
        });
        mlResponse.data.ndarray[0].diseases.forEach((element) => {
          element.isMlAi = true;
          element.source = 'ML';
          // tslint:disable-next-line: no-string-literal
          this.savedInfo['data'].ndarray[0].diseases.push(element);
        });
        sessionStorage.setItem('x-ray_Data', JSON.stringify(this.savedInfo));
        this.mlApiEllipseLoop(mlResponse, '');
      },
      (errorMessage: any) => {
        this.showError = true;
        this.spinnerService.hide();
        this.eventEmitterService.onErrorMessage({
          data: errorMessage,
        });
      }
    );
    this.canvas = new fabric.Canvas('at-id-x-ray-Canvas', {
      preserveObjectStacking: true,
      selection: false,
    });
    fabric.Object.prototype.cornerColor = 'white';
    fabric.Object.prototype.cornerStyle = 'circle';
    fabric.Object.prototype.borderColor = 'white';
    // double click event for reset zoom of image
    this.canvas.on('mouse:dblclick', (options) => {
      this.resetZoom();
      this.keepPositionInBounds(this.canvas);
    });
    // Zoom-In Zoom-Out in part starts
    this.canvas.on('mouse:down', (options) => {
      const pointer = this.canvas.getPointer(options.e, true);
      this.mouseDownPoint = new fabric.Point(pointer.x, pointer.y);
    });
    this.canvas.on('mouse:up', (options) => {
      this.mouseDownPoint = null;
    });
    this.canvas.on('mouse:move', (options) => {
      if (this.shiftKeyDown && this.mouseDownPoint) {
        const pointer = this.canvas.getPointer(options.e, true);
        const mouseMovePoint = new fabric.Point(pointer.x, pointer.y);
        this.canvas.relativePan(mouseMovePoint.subtract(this.mouseDownPoint));
        this.mouseDownPoint = mouseMovePoint;
        this.keepPositionInBounds(this.canvas);
      }
    });
    this.canvas.on('mouse:wheel', (opt) => {
      const delta = opt.e.deltaY;
      let newzoom = this.canvas.getZoom();
      newzoom = newzoom + delta / 200;
      this.displayScaleFactor = newzoom.toFixed(1);
      if (newzoom >= 5) {
        newzoom = 5;
        this.displayScaleFactor = newzoom.toFixed(0);
      }
      if (newzoom <= 1) {
        newzoom = 1;
        this.displayScaleFactor = newzoom.toFixed(0);
      }
      fabric.util.animate({
        startValue: this.canvas.getZoom(),
        endValue: newzoom,
        onChange: () => {
          this.canvas.zoomToPoint(
            { x: opt.e.offsetX, y: opt.e.offsetY },
            newzoom
          );
          this.keepPositionInBounds(this.canvas);
          this.canvas.renderAll();
        },
      });
      opt.e.preventDefault();
      opt.e.stopPropagation();
    });
    this.canvas.on('object:modified', (options) => {
      this.restrictionToBoundaryLimit(options.target);
      this.restrictObjectOnRotate(options);
      this.actionIconsModelDispaly(options);
      if (this.canvas.getActiveObject().type === 'ellipse') {
        this.updateEllipseIntoSession();
        this.ellipseModifiedEvent(
          options.target.disease,
          options.target.canvas._activeObject
        );
      }
      this.displayMessage(options);
      this.objectSelected = true;
      this.selectedObject(options);
    });
    this.canvas.on('object:rotating', (e) => {
      this.restrictObjectOnRotate(e);
      if (!this.enableDrawEllipseMode) {
        this.dialog.closeAll();
      }
    });
    this.patientDetail = history.state.patientDetails;
    if (this.patientDetail === undefined) {
      const patientDetail = JSON.parse(sessionStorage.getItem('patientDetail'));
      this.patientDetail = patientDetail;
    }

    const reportPageSelection = sessionStorage.getItem('reportPageSelection');
    const isReportPageSelection = reportPageSelection === 'true' ? true : false;

    this.dbService.getByKey('PatientImage', 1).subscribe((patientImage) => {
      this.PatientImage = patientImage ? patientImage.base64Image : null;
      const isUser = this.patientDetail.isIndividualRadiologist ? true : false;
      this.patientId = this.patientDetail
        ? this.patientDetail.xRayList[0].xRayId
        : '';

      if (this.PatientImage && isUser) {
        this.setCanvasDimension();
      } else if (this.PatientImage && isReportPageSelection) {
        this.setCanvasDimension();
      } else if (!this.instanceId) {
        this.getPatientInstanceId(this.patientId);
      } else if (!this.PatientImage) {
        this.getPatientImage(this.instanceId);
      } else {
        this.setCanvasDimension();
      }
    });

    this.canvas.on('object:selected', (evt) => {
      this.objectSelected = true;
      this.selectedObject(evt);
      this.actionIconsModelDispaly(evt);
      this.canvas.sendToBack(this.canvas._activeObject);
      this.displayMessage(evt);
    });
    this.canvas.on('selection:cleared', (evt) => {
      if (!this.enableDrawEllipseMode) {
        this.dialog.closeAll();
      }
    });
    this.canvas.on('object:moving', (evt) => {
      this.objectSelected = true;
      document.getElementById('target').style.display = 'none';
      const obj = evt.target;
      this.objectAngle = obj.angle;
      this.restrictObjectOnRotate(evt);
      this.restrictionToBoundaryLimit(obj);
      if (!this.enableDrawEllipseMode) {
        this.dialog.closeAll();
      }
    });
    let left1 = 0;
    let top1 = 0;
    let scale1x = 0;
    let scale1y = 0;
    let width1 = 0;
    let height1 = 0;
    this.canvas.on('object:scaling', (e) => {
      let obj;
      if (this.objectModified) {
        obj = this.selctedObjectArray.target;
        this.objectModified = false;
      } else {
        obj = e.target;
      }
      obj.setCoords();
      const brNew = obj.getBoundingRect();

      if (
        brNew.width + brNew.left >= obj.canvas.width ||
        brNew.height + brNew.top >= obj.canvas.height ||
        brNew.left < 0 ||
        brNew.top < 0
      ) {
        obj.left = this.selctedObjectArray.target.left + 1;
        obj.top = this.selctedObjectArray.target.top + 1;
        obj.scaleX = this.selctedObjectArray.target.scaleX;
        obj.scaleY = this.selctedObjectArray.target.scaleY;
        obj.width = this.selctedObjectArray.target.width;
        obj.height = this.selctedObjectArray.target.height;
      } else {
        left1 = obj.left;
        top1 = obj.top;
        scale1x = obj.scaleX;
        scale1y = obj.scaleY;
        width1 = obj.width;
        height1 = obj.height;
      }
      if (!this.enableDrawEllipseMode) {
        this.dialog.closeAll();
      }
      this.canvas.getActiveObject().set('strokeUniform', true);
      this.canvas.requestRenderAll();
    });
    this.canvas.on('object:scaled', (e) => {
      document.getElementById('target').style.display = 'none';
      this.selectedObject(e);
    });
    this.canvas.on('object:moved', (evt) => {
      this.actionIconsModelDispaly(evt);
    });
    this.canvas.on('mouse:over', (e) => {
      this.displayMessage(e);
      this.onHoveringAnnotation(e);
    });
    this.canvas.on('mouse:out', (e) => {
      this.onHoveringOutAnnotation(e);
    });
    this.canvas.on('selection:updated', (evt) => {
      this.dialog.closeAll();
      this.actionIconsModelDispaly(evt);
    });
  }

  /**
   * This is a prevNextPatientChange function.
   * @param '{string}' value - A string param
   * @example
   * prevNextPatientChange(patientId);
   */
  prevNextPatientChange(patientId) {
    this.savedAnnotations = {
      data: {
        names: [],
        ndarray: [
          {
            Findings: {},
            Impression: [],
            diseases: [],
          },
        ],
      },
      meta: {},
    };
    this.resetZoom();
    this.keepPositionInBounds(this.canvas);
    this.canvas.clear();
    this.spinnerService.show();
    this.eventEmitterService.OnDefaultRanges(50);
    sessionStorage.removeItem('ellipse');
    sessionStorage.removeItem('freeHandDrawing');
    this.impressionArray = [];
    this.savedInfo = {
      data: {
        names: [],
        ndarray: [
          {
            Findings: {},
            Impression: [],
            diseases: [],
          },
        ],
      },
      meta: {},
    };
    const patientDetail = JSON.parse(sessionStorage.getItem('patientDetail'));
    this.patientDetail = patientDetail;
    this.getPatientInstanceId(patientId);
    if (this.patientDetail.xRayList[0].isAnnotated) {
      this.getStoredAnnotations(this.patientDetail.xRayList[0].xRayId);
    }
  }

  /**
   * This is a restrictionToBoundaryLimit function.
   * @param '{any}' data - A array param
   * @example
   * restrictionToBoundaryLimit(obj);
   */
  restrictionToBoundaryLimit(obj) {
    if (
      obj.currentHeight > obj.canvas.height ||
      obj.currentWidth > obj.canvas.width
    ) {
      return;
    }
    obj.setCoords();
    // top-left  corner
    if (obj.getBoundingRect().top < 0) {
      obj.top = Math.max(obj.top, obj.top - obj.getBoundingRect().top);
    }

    if (obj.getBoundingRect().left < 0) {
      obj.left = Math.max(obj.left, obj.left - obj.getBoundingRect().left);
    }
    // bot-right corner
    if (
      obj.getBoundingRect().top + obj.getBoundingRect().height >
        obj.canvas.height ||
      obj.getBoundingRect().left + obj.getBoundingRect().width >
        obj.canvas.width
    ) {
      obj.top = Math.min(
        obj.top,
        obj.canvas.height -
          obj.getBoundingRect().height +
          obj.top -
          obj.getBoundingRect().top
      );
      obj.left = Math.min(
        obj.left,
        obj.canvas.width -
          obj.getBoundingRect().width +
          obj.left -
          obj.getBoundingRect().left
      );
    }
  }

  /**
   * This is a action icons model display event.
   * @param '{any}' data - A array param
   * @example
   * actionIconsModelDispaly(data);
   */
  actionIconsModelDispaly(data) {
    this.markactionModelPosition(data);
    if (!this.enableDrawEllipseMode && this.canvas.isDrawingMode === false) {
      this.dialog.open(this.controlsModel, {
        panelClass: 'my-class',
        hasBackdrop: false,
        position: { left: this.left + 'px', top: this.top + 'px' },
      });
    }
  }

  /**
   * This is a markactionModelPosition function.
   * @param '{any}' data - A array param
   * @example
   * markactionModelPosition(data);
   */
  markactionModelPosition(data) {
    this.left = 0;
    this.top = 0;
    const obj = data.target;
    const objCenterX = this.canvas.getActiveObject().getCenterPoint().x;
    const objCenterY = this.canvas.getActiveObject().oCoords.tr.y;

    if (
      this.canvas.getActiveObject().top < 140 &&
      this.canvas.getActiveObject().left < 450 &&
      obj.angle > 240
    ) {
      this.left = objCenterX + 275;
      this.top = objCenterY + 150;
    } else if (
      this.canvas.getActiveObject().left < 200 &&
      this.canvas.getActiveObject().top > 105
    ) {
      this.left = objCenterX + 275;
      this.top = objCenterY;
    } else if (
      this.canvas.getActiveObject().left < 200 &&
      this.canvas.getActiveObject().top < 105
    ) {
      this.left = objCenterX + 275;
      this.top = objCenterY + 150;
    } else if (
      this.canvas.getActiveObject().left > 450 &&
      this.canvas.getActiveObject().top > 105
    ) {
      this.left = objCenterX;
      this.top = objCenterY;
    } else if (
      this.canvas.getActiveObject().left < 45 &&
      this.canvas.getActiveObject().top < 180
    ) {
      this.left = objCenterX + 150;
      this.top = objCenterY + 150;
    } else if (this.canvas.getActiveObject().top < 105) {
      this.left = objCenterX;
      this.top = objCenterY + 150;
    } else if (
      this.canvas.getActiveObject().top < 60 &&
      this.canvas.getActiveObject().left > 200
    ) {
      this.left = objCenterX - 100;
      this.top = objCenterY + 65;
    } else if (
      this.canvas.getActiveObject().top < 60 &&
      this.canvas.getActiveObject().left < 200
    ) {
      this.left = objCenterX + 350;
      this.top = objCenterY + 65;
    } else {
      if (obj.angle > 5 && obj.angle <= 40) {
        this.left = objCenterX + 270;
        this.top = objCenterY + 30;
      } else if (obj.angle > 40 && obj.angle <= 90) {
        this.left = objCenterX + 270;
        this.top = objCenterY + 30;
      } else if (obj.angle > 90 && obj.angle <= 130) {
        this.left = objCenterX + 270;
        this.top = objCenterY + 60;
      } else if (obj.angle > 130 && obj.angle <= 150) {
        this.left = objCenterX + 200;
        this.top = objCenterY + 100;
      } else if (obj.angle > 150 && obj.angle <= 180) {
        this.left = objCenterX + 150;
        this.top = objCenterY + 135;
      } else if (obj.angle > 180 && obj.angle <= 270) {
        this.left = objCenterX + 20;
        this.top = objCenterY + 50;
      } else if (obj.angle > 270 && obj.angle <= 300) {
        this.left = objCenterX + 70;
        this.top = objCenterY + 20;
      } else if (obj.angle > 300 && obj.angle <= 340) {
        this.left = objCenterX + 150;
        this.top = objCenterY + 0;
      } else if (obj.angle > 340 && obj.angle <= 359) {
        this.left = objCenterX + 240;
        this.top = objCenterY + 0;
      } else {
        this.left = objCenterX + 135;
        this.top = objCenterY - 40;
      }
    }
  }

  /**
   * This is a update search model function.
   * @param '{string}' value - A string param
   * @example
   * updateSearchModel(value);
   */
  updateSearchModel(value) {
    this.searchModel = value;
    this.selectedDiseases = false;
    this.selectedMainDisease = false;
    this.selectedSubDisease = false;
  }

  /**
   * This is a clear function.
   * @param '{void}' empty - A empty param
   * @example
   * clear();
   */
  clear() {
    this.selectedDisease = '';
    this.selectedMainDisease = false;
    this.selectedSubDisease = false;
  }

  /**
   * This is a  retrieve patient instance id from server  function.
   * @param '{string}' value - A string param
   * @example
   * getPatientInstanceId(id);
   */
  getPatientInstanceId(id) {
    this.xRayService.getPatientInstanceId(id).subscribe(
      (patientInstanceIdResponse: any) => {
        // this.instanceId =
        //   patientInstanceIdResponse.seriesList[0].instanceList[0].id;
        this.instanceId = history.state.xRayList
          ? history.state.xRayList[0].xRayId
          : '';
        if (this.instanceId === '') {
          const patient = JSON.parse(sessionStorage.getItem('patientDetail'));
          this.instanceId = patient.xRayList[0].xRayId;
        }
        this.getPatientImage(this.instanceId);
      },
      (errorMessage: any) => {
        this.spinnerService.hide();
        this.eventEmitterService.onErrorMessage({
          data: errorMessage,
        });
      }
    );
  }

  /**
   * This is setting dimension for canvas container function.
   * @param '{void}' empty - A empty param
   * @example
   * setCanvasDimension();
   */
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
    this.generateCanvas();
  }

  /**
   * retrieve patient image from api function.
   * @param '{string}' vale - A string param
   * @example
   * getPatientImage(instanceID);
   */
  getPatientImage(instanceID: string) {
    this.xRayService.getPatientImage(instanceID).subscribe(
      (PatientImageResponse: any) => {
        const imageResponse = JSON.parse(PatientImageResponse);
        this.PatientImage =
          'data:image/png;base64,' + imageResponse.base64Image;
        const imageInformation = {
          base64Image: this.PatientImage,
          filename: imageResponse.filename,
          id: 1,
        };
        this.setCanvasDimension();
        this.dbService
          .add('PatientImage', imageInformation)
          .subscribe((key) => {});
        sessionStorage.setItem('reportPageSelection', 'true');
      },
      (errorMessage: any) => {
        this.spinnerService.hide();
        this.eventEmitterService.onErrorMessage({
          data: errorMessage,
        });
      }
    );
  }

  /**
   * generate a canvas using fabric.js function.
   * @param '{void}' empty - A empty param
   * @example
   * generateCanvas();
   */
  generateCanvas() {
    fabric.Image.fromURL(this.PatientImage, (img) => {
      this.xRayImage = img;
      this.contrastRange = 50;
      this.brightnessRange = 50;
      this.resetZoom();
      this.setCanvasBackground();
      const xrayData = JSON.parse(sessionStorage.getItem('x-ray_Data'));
      if (this.savedAnnotations && !xrayData) {
        this.savedInfo = this.savedAnnotations;
        sessionStorage.setItem('x-ray_Data', JSON.stringify(this.savedInfo));
        this.mlApiEllipseLoop(this.savedAnnotations, 'savedAnnotations');
      } else {
        if (xrayData) {
          this.savedInfo = xrayData;
        }
        if (
          xrayData !== null &&
          xrayData.data.ndarray[0].Impression.length > 0
        ) {
          if (this.resize === false) {
            this.mlApiEllipseLoop(xrayData, 'session');
          }
        }
      }
    });
  }

  /**
   * function to compare image vs container aspect ratio width
   * @param '{string}' value - A string param
   * @param '{string}' value - A string param
   * @example
   * getWidthFirst(imageAspectRatio, containerAspectRatio);
   */
  getWidthFirst(imageAspectRatio, containerAspectRatio) {
    return imageAspectRatio > containerAspectRatio;
  }

  /**
   * setting BackgroundImage for canvas block
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

    this.canvas.setWidth(this.canvasCorrectedWidth);
    this.canvas.setHeight(this.canvasCorrectedHeight);

    this.xRayImage.set({
      opacity: 1,
      scaleX: this.canvasCorrectedWidth / this.xRayImage.width,
      scaleY: this.canvasCorrectedHeight / this.xRayImage.height,
    });
    this.canvasScaleX = this.xRayImage.width / this.canvas.width;
    this.canvasScaleY = this.xRayImage.height / this.canvas.height;
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

  /**
   *  draw ellipse, when user clicks ask ai accept button
   * @param '{any}' data - A array param
   * @param' {string}' value - A string param
   * @example
   * mlApiEllipseLoop(mlList, check);
   */
  mlApiEllipseLoop(mlList: any, check) {
    this.mlArray = mlList;
    const mLArray = mlList.data.ndarray[0];
    this.ellipseList = [];
    this.findingsList = [];
    mLArray.Impression.forEach((impression: any) => {
      const colorFinding = mLArray.diseases.filter(
        (book) => book.idx === impression.index
      );
      const impressionObject = {
        title: 'impression',
        id: impression.index,
        name: impression.sentence,
        isMLApi: impression.source === 'ML' ? true : false,
        source: impression.source,
        isUpdated: false,
        diseaseType: impression.diseaseType,
      };
    });
    if (mLArray.Impression.length === 0) {
      const impressionObject = {
        title: 'impression',
        idNew: '00',
        name: 'No significant abnormality detected',
        isMLApi: true,
      };
      this.eventEmitterService.onComponentDataShared(impressionObject);
    }
    const findingsData = mLArray.Findings ? Object.keys(mLArray.Findings) : [];
    const findingsOrdered = [];
    const order = this.constants.findings;
    order.forEach((element) => {
      if (findingsData.indexOf(element.Name) > -1) {
        findingsOrdered.push(element);
      }
    });
    findingsOrdered.forEach((info) => {
      if (
        mLArray.Findings[info.Name].length === 0 &&
        info.Name !== 'ADDITIONAL' &&
        mLArray.source !== 'DR'
      ) {
        const finalFinding = info.Name + ': ' + info.Desc;
        this.eventEmitterService.onComponentFindingsDataShared(finalFinding);
      } else {
        let finalFinding = '';
        mLArray.Findings[info.Name].forEach((finding: any, index) => {
          const currentFinding = mLArray.Impression.filter(
            (book) => book.index === finding
          );
          // tslint:disable-next-line: max-line-length
          if (currentFinding.length !== 0) {
            finalFinding +=
              currentFinding[0].sentence[0].toUpperCase() +
              currentFinding[0].sentence.substr(1).toLowerCase() +
              '. ';
          } else {
            finalFinding += '';
          }
        });
        if (
          finalFinding === '' &&
          info.Name !== 'ADDITIONAL' &&
          mLArray.source !== 'DR'
        ) {
          const finalFinding1 = info.Name + ': ' + info.Desc;
          this.eventEmitterService.onComponentFindingsDataShared(finalFinding1);
        } else {
          const finalData =
            info.Name !== 'ADDITIONAL'
              ? info.Name + ': ' + finalFinding
              : finalFinding;
          if (finalData !== '') {
            this.eventEmitterService.onComponentFindingsDataShared(finalData);
          }
        }
      }
    });
    let val1 = 0;
    mLArray.diseases.forEach((disease: any, index: any) => {
      if (disease.ellipses) {
        if (disease.ellipses.length === 0 || disease.ellipses === []) {
          const random = Math.floor(Math.random() * 100 + 1);
          const selectedObject = {
            title: 'impression',
            isMLApi: false,
            idNew: random,
            name: disease.name,
            color: disease.color,
            source: disease.source,
            type: '',
            isUpdated: false,
            diseaseType: 'diffuse category',
          };
          this.impressionArray.push(selectedObject);
          this.eventEmitterService.onComponentDataShared(selectedObject);
        }
      }
      if (disease.ellipses && disease.ellipses.length !== 0) {
        const idValue = 1000 + val1;
        let val2 = 0;
        if (disease.source === 'ML') {
          disease.isMlAi = true;
        }
        disease.ellipses.forEach((ellipse: any, index) => {
          ellipse.color =
            DISEASE_COLOR_MAPPING[disease.name.toLowerCase()] || RANDOM_COLOR;
          ellipse.id = idValue + '' + val2;
          // ellipse.color = disease.color;
          ellipse.source =
            ellipse.source === 'ML' || ellipse.source === undefined
              ? 'ML'
              : 'DR';
          ellipse.strokeDashArray = ellipse.isUpdated
            ? (ellipse.strokeDashArray = [15, 3])
            : ellipse.strokeDashArray;
          // ellipse.type = ellipse.freeHandDrawing ? '' : 'ellipse';
          if (ellipse.strokeDashArray && disease.isMlAi) {
            ellipse.strokeDashArray = ellipse.strokeDashArray;
          } else if (!ellipse.strokeDashArray && disease.isMlAi) {
            ellipse.strokeDashArray = [4, 2];
          } else {
            ellipse.strokeDashArray = [0, 0];
          }
          ellipse.name = disease.name;
          // ellipse.index = index;
          if (ellipse.a !== 0 && ellipse.b !== 0) {
            this.eventEmitterService.onComponentEllipseDataShared({
              name: disease.name,
              index: ellipse.id,
              source: ellipse.source,
              isUpdated: false,
            });
            const random = Math.floor(Math.random() * 100 + 1);
            const selectedObject = {
              title: 'impression',
              isMLApi: ellipse.source === 'DR' ? false : true,
              id: disease.idx,
              idNew: ellipse.id,
              name: disease.name,
              color: ellipse.color,
              source: ellipse.source,
              type: 'ellipse',
              isUpdated: false,
            };
            this.impressionArray.push(selectedObject);
            this.eventEmitterService.onComponentDataShared(selectedObject);
            ellipse.idvalue = random;
            this.drawEllipse([], true, ellipse);
          }
          val2++;
        });
        val1++;
      } else if (disease.freeHandDrawing) {
        this.eventEmitterService.onComponentEllipseDataShared({
          name: disease.name,
          index: disease.idx,
          source: 'DR',
          isUpdated: false,
        });
        const random = Math.floor(Math.random() * 100 + 1);
        const selectedObject = {
          title: 'impression',
          isMLApi: false,
          id: disease.idx,
          idNew: check !== 'session' ? random : disease.idx,
          name: disease.name,
          color: disease.color,
          source: 'DR',
          isUpdated: false,
        };
        this.impressionArray.push(selectedObject);
        this.eventEmitterService.onComponentDataShared(selectedObject);
        this.coordinateList = [];

        const coordinatePath = [];
        disease.contours[0].coordinates.forEach((data) => {
          coordinatePath.push(data[0]);
          coordinatePath.push(data[1]);
        });
        for (let i = 0; i < coordinatePath.length; i++) {
          if (i % 2 === 0) {
            let xPosition: any = coordinatePath[i];
            xPosition = xPosition / this.canvasScaleX;
            this.coordinateList.push(xPosition);
          } else {
            let yPosition: any = coordinatePath[i];
            yPosition = yPosition / this.canvasScaleY;
            this.coordinateList.push(yPosition);
          }
        }
        const appendCharacter = 'M' + ' ';
        this.coordinateList.unshift(appendCharacter);
        this.canvas.add(
          new fabric.Path(this.coordinateList.join(' '), {
            // @ts-ignore
            disease: disease.disease,
            stroke: disease.color,
            strokeWidth: 2,
            fill: '',
            originX: 'center',
            originY: 'center',
            opacity: 0.8,
            id: disease.idx,
          })
        );
        this.coordinateList = [];
      } else if (disease.contours.length !== 0) {
        this.eventEmitterService.onComponentEllipseDataShared({
          name: disease.name,
          index: disease.idx,
          source: 'DR',
          isUpdated: false,
        });
        const random = Math.floor(Math.random() * 100 + 1);
        const selectedObject = {
          title: 'impression',
          isMLApi: false,
          idNew: check !== 'session' ? random : disease.idx,
          name: disease.name,
          color: disease.color,
          source: 'DR',
          isUpdated: false,
        };
        this.impressionArray.push(selectedObject);
        this.eventEmitterService.onComponentDataShared(selectedObject);
        this.coordinateList = [];
        if (disease.contours[0] === undefined) {
          console.log('diffuse category does not contain disease contours');
        } else {
          const coordinatePath = [];
          disease.contours[0].coordinates.forEach((data) => {
            coordinatePath.push(data[0]);
            coordinatePath.push(data[1]);
          });
          for (let i = 0; i < coordinatePath.length; i++) {
            if (i % 2 === 0) {
              let xPosition: any = coordinatePath[i];
              xPosition = xPosition / this.canvasScaleX;
              this.coordinateList.push(xPosition);
            } else {
              let yPosition: any = coordinatePath[i];
              yPosition = yPosition / this.canvasScaleY;
              this.coordinateList.push(yPosition);
            }
          }
          const appendCharacter = 'M' + ' ';
          this.coordinateList.unshift(appendCharacter);
          this.canvas.add(
            new fabric.Path(this.coordinateList.join(' '), {
              stroke: disease.color,
              strokeWidth: 2,
              fill: '',
              originX: 'center',
              originY: 'center',
              opacity: 0.8,
              id: disease.idx,
            })
          );
          this.coordinateList = [];
          this.canvas.renderAll();
        }
        this.dialog.closeAll();
      }
    });
  }

  /**
   * on destroy event subscription
   * @param '{void}' empty - A empty param
   * @example
   * ngOnDestroy();
   */
  ngOnDestroy() {
    this.dialog.closeAll();
    this.eventsSubscription.unsubscribe();
    this._subscription.unsubscribe();
    this.toastrService.clear();
  }

  /**
   * Register click function from another component
   * @param '{string}' value - A string param
   * @example
   * firstComponentFunction(title);
   */
  firstComponentFunction(title) {
    this.eventEmitterService.onComponentButtonClick(title);
  }

  /**
   * Draw Ellipse Functionality
   * @param '{string}' value - A string param
   * @param '{string}' value - A string param
   * @param '{string}' value - A string param
   * @example
   *  drawEllipse(data, isMlAi?, diseaseItem?);
   */
  drawEllipse(data, isMlAi?, diseaseItem?) {
    if (diseaseItem) {
      if (diseaseItem.source === 'DR') {
        diseaseItem.type = 'ellipse';
      }
    }
    this.updateDisease = false;
    this.canvas.isDrawingMode = false;
    this.enableDrawEllipseMode = true;
    if (isMlAi) {
      this.canvasScaleX = this.xRayImage.width / this.canvas.width;
      this.canvasScaleY = this.xRayImage.height / this.canvas.height;
      const ellipse = new fabric.Ellipse({
        width: 0,
        height: 0,
        disease: diseaseItem.name,
        originX: diseaseItem.type === 'ellipse' ? 'left' : 'center',
        originY: diseaseItem.type === 'ellipse' ? 'top' : 'center',
        left:
          diseaseItem.type === 'ellipse'
            ? diseaseItem.x
            : (diseaseItem.x as any) / this.canvasScaleX,
        top:
          diseaseItem.type === 'ellipse'
            ? diseaseItem.y
            : (diseaseItem.y as any) / this.canvasScaleY,
        rx:
          diseaseItem.type === 'ellipse'
            ? diseaseItem.a
            : (diseaseItem.a as any) / this.canvasScaleX / 2,
        ry:
          diseaseItem.type === 'ellipse'
            ? diseaseItem.b
            : (diseaseItem.b as any) / this.canvasScaleY / 2,
        angle: diseaseItem.r,
        stroke: diseaseItem.color,
        strokeDashArray: diseaseItem.strokeDashArray,
        strokeWidth: 2,
        fill: '',
        selectable: true,
        strokeUniform: true,
        index: diseaseItem.index !== 0 ? diseaseItem.index : diseaseItem.id,
        id: diseaseItem.idvalue,
        isMLAi: diseaseItem.source === 'ML' ? true : false,
        idNew: diseaseItem.id,
        type: 'ellipse',
      });
      this.canvas.add(ellipse);
      this.canvas.renderAll();
      this.canvas.setActiveObject(ellipse);
      this.canvas.discardActiveObject();
      this.enableDrawEllipseMode = false;
      this.scaleSaveEllipse(ellipse);
    } else {
      this.changeSelectableStatus(false);
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
              stroke: '#ffff00',
              fill: '',
              selectable: true,
              strokeUniform: true,
            });
            this.canvas.add(ellipse);
            this.canvas.renderAll();
            this.canvas.setActiveObject(ellipse);
          }
        });
        this.canvas.observe('mouse:move', (e) => {
          if (!this.isDown) {
            return;
          }
          const pointer = this.canvas.getPointer(e.e);
          const activeObj = this.canvas.getActiveObject();
          if (
            pointer.x <= 0 ||
            pointer.x >= this.canvasCorrectedWidth ||
            pointer.y <= 0 ||
            pointer.y >= this.canvasCorrectedHeight
          ) {
            this.stopDragging(e.target);
          }
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
          this.changeSelectableStatus(true);
          this.canvas.defaultCursor = 'default';
        });
      }
    }
  }

  /**
   *  This is scaleSaveEllipse function
   * @param'{string}' value - A string param
   * @example
   *  scaleSaveEllipse(data);
   */
  scaleSaveEllipse(data) {
    const saveEllipse = {} as SaveEllipse;
    saveEllipse.id = data.id;
    saveEllipse.left = data.left * this.canvasScaleX;
    saveEllipse.top = data.top * this.canvasScaleY;
    saveEllipse.rx = data.width * data.scaleX * this.canvasScaleX;
    saveEllipse.ry = data.height * data.scaleY * this.canvasScaleY;
    saveEllipse.width = data.width * data.scaleX * this.canvasScaleX;
    saveEllipse.height = data.height * data.scaleY * this.canvasScaleY;
    saveEllipse.angle = data.angle;
    saveEllipse.color = data.stroke;
    saveEllipse.strokeDashArray = data.strokeDashArray;
    saveEllipse.type = data.type;
    saveEllipse.isMLAi = data.isMLAi;
    this.sessionSelectedEllipseObject.push(saveEllipse);
    sessionStorage.removeItem('ellipse');
    sessionStorage.setItem(
      'ellipse',
      JSON.stringify(this.sessionSelectedEllipseObject)
    );
  }

  /**
   *  This is  changeSelectableStatus function
   * @param '{string}' value - A string param
   * @example
   *  changeSelectableStatus(val);
   */
  changeSelectableStatus(val) {
    this.canvas.forEachObject((obj) => {
      obj.selectable = val;
    });
    this.canvas.renderAll();
  }

  /**
   * delete ellipse function
   * @param '{void}' empty - A empty param
   * @example
   * deleteEllipse();
   */
  deleteEllipse(obj?) {
    this.diffuseObject = obj;
    const activeObject = this.canvas.getActiveObject();
    if (activeObject || obj.title === 'Delete Diffuse Impression') {
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
   * @param '{void}' empty - A empty param
   * @example
   * openPathologyModal();
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
   * @param '{string}' value - A string param
   * @param '{string}' value - A string param
   * @example
   * onSelect(event, item);
   */
  onSelect(event, item) {
    this.selectedDiseases = true;
    if (item.length === 0) {
      this.selectedDisease = event.target.textContent.replace(
        /[^a-zA-Z/ ]/g,
        ''
      );
    } else if (item === '') {
      this.selectedDisease = event.target.textContent.replace(
        /[^a-zA-Z/ ]/g,
        ''
      );
    }
    const abnormality = [];
    const names = [];
    this.pathologyNames.forEach((element) => {
      abnormality.push(element.abnormality);
      element.Names.forEach((value) => {
        names.push(value);
      });
    });

    const indexs = names.findIndex(
      (value) => value === event.target.textContent
    );
    const index = abnormality.findIndex(
      (value) => value === event.target.textContent
    );
    if (indexs !== -1 && index !== -1) {
      this.selectedSubDisease = true;
    } else if (index !== -1 && item.length === 0) {
      this.selectedMainDisease = true;
    } else if (indexs !== -1) {
      this.selectedSubDisease = true;
    }
  }

  /**
   * This is storeDataInSession function
   * @param '{string}' value - A string param
   * @param '{string}' value - A string param
   * @example
   * storeDataInSession(newdata, check);
   */
  storeDataInSession(newdata, check) {
    if (check === 'impression') {
      // tslint:disable-next-line: no-string-literal
      this.savedInfo['data'].ndarray[0].Impression.push(newdata);
    }
    sessionStorage.setItem('x-ray_Data', JSON.stringify(this.savedInfo));
  }

  /**
   * Emitting selected disease to Impression component
   * @param '{void}' empty - A empty param
   * @example
   * savePrediction();
   */
  savePrediction() {
    const random = Math.floor(Math.random() * 100 + 1);
    let emptyObject;
    let selectedObjectPrediction;
    if (
      this.canvas.getActiveObject() === undefined ||
      this.canvas.getActiveObject() === null
    ) {
      emptyObject = {
        index: random,
        diseaseType: 'diffuse category',
      };
      this.selectedObjectPrediction = emptyObject;
      selectedObjectPrediction = emptyObject;
      selectedObjectPrediction.idNew = random;
      this.diseaseType = 'diffuse category';
    } else {
      this.canvas.getActiveObject().index = random;
      this.canvas.getActiveObject().diseaseType = 'normal category';
      this.selectedObjectPrediction = this.canvas.getActiveObject();
      selectedObjectPrediction = this.canvas.getActiveObject();
      selectedObjectPrediction.idNew = random;
      this.diseaseType = 'normal category';
    }
    const selectedObject = {
      idNew: random,
      name: this.selectedDisease,
      source: 'DR',
      diseaseType: this.diseaseType,
    };
    this.savedObjects.push(selectedObjectPrediction);
    this.storeDataInSession(
      {
        index: random,
        sentence: this.selectedDisease,
        source: 'DR',
        diseaseType: this.diseaseType,
      },
      'impression'
    );
    this.eventEmitterService.onComponentDataShared(selectedObject);

    this.getColorMapping(this.selectedDisease, 'save', 'DR');
    this.clear();
    this.activeIcon.active = false;
    this.dialog.closeAll();
    if (this.selectedObjectPrediction.type === 'ellipse') {
      this.saveEllipseIntoSession();
    }
    if (this.selectedObjectPrediction.type === 'path') {
      this.saveFreeHandDrawingIntoSession();
    }
    this.pathologyNames = this.constants.diseases;
    this.toastrService.success('Annotation saved successfully');
    this.canvas.discardActiveObject();
    this.canvas.renderAll();
  }

  /**
   * Delete active object
   * @param '{void}' empty - A empty param
   * @example
   * deletePrediction();
   */
  deletePrediction() {
    sessionStorage.removeItem('x-ray_Data');
    // tslint:disable-next-line: no-string-literal
    this.savedInfo['data'].ndarray[0].Impression.forEach((element, index) => {
      if (
        this.canvas.getActiveObject() === null ||
        this.canvas.getActiveObject() === undefined
      ) {
        // tslint:disable-next-line:no-string-literal
        this.savedInfo['data'].ndarray[0].Impression.splice(
          this.diffuseObject.obj.name,
          1
        );
        // tslint:disable-next-line:no-string-literal
        this.savedInfo['data'].ndarray[0].diseases.splice(
          this.diffuseObject.obj.name,
          1
        );
        sessionStorage.setItem('x-ray_Data', JSON.stringify(this.savedInfo));
        const selectedObject = {
          id: '',
          check: 'delete',
          disease: this.diffuseObject.obj.name,
          objectindex: 'diffuse category',
          isMLAi: '',
        };
        this.eventEmitterService.onComponentButtonClick(selectedObject);
      } else {
        const compare = this.canvas.getActiveObject().index
          ? this.canvas.getActiveObject().index
          : this.canvas.getActiveObject().id;
        if (element.disease === compare) {
          // tslint:disable-next-line: no-string-literal
          this.savedInfo['data'].ndarray[0].Impression.splice(index, 1);
          // tslint:disable-next-line: no-string-literal
          this.savedInfo['data'].ndarray[0].diseases.splice(index, 1);
        } else if (element.sentence === this.canvas.getActiveObject().disease) {
          // tslint:disable-next-line: no-string-literal
          this.savedInfo['data'].ndarray[0].Impression.splice(index, 1);
          // tslint:disable-next-line: no-string-literal
          this.savedInfo['data'].ndarray[0].diseases.splice(index, 1);
        }
      }
    });
    sessionStorage.setItem('x-ray_Data', JSON.stringify(this.savedInfo));
    const selectedObject = {
      id: this.canvas.getActiveObject().idNew
        ? this.canvas.getActiveObject().idNew
        : this.canvas.getActiveObject().id,
      check: 'delete',
      disease: this.canvas.getActiveObject().disease,
      objectindex: this.canvas.getActiveObject().index,
      isMLAi: this.canvas.getActiveObject().isMLAi,
    };
    this.eventEmitterService.onComponentButtonClick(selectedObject);
    this.dialog.closeAll();
    if (this.canvas.getActiveObject()) {
      if (this.canvas.getActiveObject().type === 'ellipse') {
        this.deleteEllipseInSession();
      } else {
        this.deleteFreeHandDrawingInSession();
      }
    }
    this.toastrService.success('Annotation deleted successfully');
  }

  /**
   * ellipse modified event
   * @param '{void}' empty - A empty param
   * @example
   * ellipseModifiedEvent();
   */
  ellipseModifiedEvent(disease: string, activeObject: any) {
    const savedInfo = cloneDeep(this.savedInfo);
    const selectedObject = {
      id: this.canvas.getActiveObject().id,
      check: 'update',
      name: disease,
    };
    const activeObj = this.canvas.getActiveObject();
    if (activeObj.type === 'ellipse') {
      if (activeObj.isMLAi) {
        activeObj.set({
          strokeDashArray: [15, 3],
        });
      }
      this.canvas.renderAll();
      // tslint:disable-next-line: no-string-literal
      savedInfo['data'].ndarray[0].diseases.forEach(
        (element: any, index: number) => {
          if (element.ellipses) {
            element.ellipses.forEach((ellipse: any, indexId: number) => {
              if (activeObj.id === ellipse.idvalue) {
                this.canvasScaleX = this.xRayImage.width / this.canvas.width;
                this.canvasScaleY = this.xRayImage.height / this.canvas.height;
                if (element.ellipses.length > 1) {
                  // tslint:disable-next-line: no-string-literal
                  savedInfo['data'].ndarray[0].diseases[index].ellipses[
                    indexId
                  ].strokeDashArray = [15, 3];
                  const obj = {
                    x: activeObj.isMLAi
                      ? activeObject.left * this.canvasScaleX
                      : activeObject.left,
                    y: activeObj.isMLAi
                      ? activeObject.top * this.canvasScaleY
                      : activeObject.top,
                    a: activeObj.isMLAi
                      ? activeObject.rx * this.canvasScaleX * 2
                      : activeObject.rx,
                    b: activeObj.isMLAi
                      ? activeObject.ry * this.canvasScaleY * 2
                      : activeObject.ry,
                    r: activeObject.angle,
                    index: activeObject.id,
                    type: 'ellipse',
                    strokeDashArray: [15, 3],
                    source: activeObj.isMLAi ? 'ML' : 'DR',
                    isUpdated: activeObj.isMLAi ? true : false,
                  };
                  // tslint:disable-next-line: no-string-literal
                  savedInfo['data'].ndarray[0].diseases[index].ellipses.splice(
                    indexId,
                    1,
                    obj
                  );
                } else {
                  // tslint:disable-next-line: no-string-literal
                  savedInfo['data'].ndarray[0].diseases[index].ellipses[
                    indexId
                  ].strokeDashArray = [15, 3];
                  const obj = {
                    // tslint:disable-next-line: no-string-literal
                    color: savedInfo['data'].ndarray[0].diseases[index].color,
                    ellipses: [
                      {
                        x: activeObj.isMLAi
                          ? activeObject.left * this.canvasScaleX
                          : activeObject.left,
                        y: activeObj.isMLAi
                          ? activeObject.top * this.canvasScaleY
                          : activeObject.top,
                        a: activeObj.isMLAi
                          ? activeObject.rx * this.canvasScaleX * 2
                          : activeObject.rx,
                        b: activeObj.isMLAi
                          ? activeObject.ry * this.canvasScaleY * 2
                          : activeObject.ry,
                        r: activeObject.angle,
                        index: activeObject.id,
                        type: 'ellipse',
                        strokeDashArray: [15, 3],
                        source: activeObj.isMLAi ? 'ML' : 'DR',
                        isUpdated: activeObj.isMLAi ? true : false,
                      },
                    ],
                    index: this.canvas._activeObject.id,
                    name: disease,
                    isMlAi: true,
                    source: activeObj.isMLAi ? 'ML' : 'DR',
                  };
                  // tslint:disable-next-line: no-string-literal
                  savedInfo['data'].ndarray[0].diseases.splice(index, 1, obj);
                }
                this.savedInfo = savedInfo;
                sessionStorage.removeItem('x-ray_Data');
                sessionStorage.setItem('x-ray_Data', JSON.stringify(savedInfo));
                this.updateEllipseIntoSession();
              }
            });
          }
        }
      );
    }
  }

  /**
   * Update active object
   * @param '{void}' empty - A empty param
   * @example
   * updatePrediction();
   */
  updatePrediction() {
    const savedInfo = cloneDeep(this.savedInfo);
    const selectedObject = {
      id: this.canvas.getActiveObject().idNew
        ? this.canvas.getActiveObject().idNew
        : this.canvas.getActiveObject().id,
      check: 'update',
      name: this.selectedDisease,
      source: 'DR',
      isUpdated: this.canvas._activeObject.isMLAi ? true : false,
    };
    this.eventEmitterService.onComponentButtonClick(selectedObject);
    this.getColorMapping(this.selectedDisease, 'update', 'DR');
    this.clear();
    this.dialog.closeAll();
    if (this.canvas.getActiveObject().type === 'ellipse') {
      this.updateEllipseIntoSession();
    } else {
      this.updateFreeHandDrawingIntoSession();
    }
    const activeObj = this.canvas.getActiveObject();
    if (activeObj.type === 'ellipse') {
      if (activeObj.isMLAi) {
        activeObj.set({
          strokeDashArray: [15, 3],
        });
      }
      this.canvas.renderAll();
      const colorName =
        DISEASE_COLOR_MAPPING[selectedObject.name.toLowerCase()] ||
        RANDOM_COLOR;
      // tslint:disable-next-line: no-string-literal
      savedInfo['data'].ndarray[0].diseases.forEach(
        (element: any, index: number) => {
          element.ellipses.forEach((ellipse: any, indexId: number) => {
            if (activeObj.idNew === ellipse.id) {
              if (element.ellipses.length > 1) {
                // tslint:disable-next-line: no-string-literal
                savedInfo['data'].ndarray[0].diseases[index].ellipses[
                  indexId
                ].strokeDashArray = [15, 3];
                // tslint:disable-next-line: no-string-literal
                savedInfo['data'].ndarray[0].diseases[index].ellipses[
                  indexId
                ].source = activeObj.isMLAi ? 'ML' : 'DR';
                const obj = {
                  color: colorName,
                  ellipses: [
                    // tslint:disable-next-line: no-string-literal
                    savedInfo['data'].ndarray[0].diseases[index].ellipses[
                      indexId
                    ],
                  ],
                  index: this.canvas._activeObject.id,
                  name: selectedObject.name,
                  isMlAi: activeObj.isMLAi,
                  source: activeObj.isMLAi ? 'ML' : 'DR',
                  isUpdated: activeObj.isMLAi ? true : false,
                  isDeleted: false,
                };
                // tslint:disable-next-line: no-string-literal
                savedInfo['data'].ndarray[0].diseases[index].ellipses[
                  indexId
                ].isUpdated = activeObj.isMLAi ? true : false;
                // tslint:disable-next-line: no-string-literal
                savedInfo['data'].ndarray[0].diseases[index].ellipses.splice(
                  indexId,
                  1,
                  obj
                );
              } else {
                // tslint:disable-next-line: no-string-literal
                savedInfo['data'].ndarray[0].diseases[index].ellipses[
                  indexId
                ].strokeDashArray = [15, 3];
                // tslint:disable-next-line: no-string-literal
                savedInfo['data'].ndarray[0].diseases[index].ellipses[
                  indexId
                ].source = activeObj.isMLAi ? 'ML' : 'DR';
                const obj = {
                  color: colorName,
                  ellipses: [
                    // tslint:disable-next-line: no-string-literal
                    savedInfo['data'].ndarray[0].diseases[index].ellipses[
                      indexId
                    ],
                  ],
                  index: this.canvas._activeObject.id,
                  name: selectedObject.name,
                  isMlAi: activeObj.isMLAi,
                  source: activeObj.isMLAi ? 'ML' : 'DR',
                  isUpdated: activeObj.isMLAi ? true : false,
                  isDeleted: false,
                };
                // tslint:disable-next-line: no-string-literal
                savedInfo['data'].ndarray[0].diseases[index].ellipses[
                  indexId
                ].isUpdated = activeObj.isMLAi ? true : false;
                // tslint:disable-next-line: no-string-literal
                savedInfo['data'].ndarray[0].diseases.splice(index, 1, obj);
              }
              this.savedInfo = savedInfo;
              sessionStorage.removeItem('x-ray_Data');
              sessionStorage.setItem('x-ray_Data', JSON.stringify(savedInfo));
              this.updateEllipseIntoSession();
            }
          });
        }
      );
    }
    this.clear();
    this.selectedDisease = '';
    this.toastrService.success('Annotation updated successfully');
    this.canvas.discardActiveObject();
    this.canvas.renderAll();
  }

  /**
   * Close Pathology modal functionality
   * @param '{void}' empty - A empty param
   * @example
   * closePathologyModal();
   */
  closePathologyModal() {
    this.pathologyNames = this.constants.diseases;
    this.clear();
    if (!this.updateDisease) {
      this.canvas.remove(this.canvas.getActiveObject());
      this.canvas.renderAll();
      this.activeIcon.active = false;
    }
    this.activeIcon.active = false;
    this.canvas.isDrawingMode = false;
    this.enableDrawEllipseMode = false;
    this.dialog.closeAll();
  }

  /**
   * Free hand Drawing functionality
   * @param '{string}' value - A string param
   * @example
   *  freeHandDrawing(data) ;
   */
  freeHandDrawing(data) {
    this.changeSelectableStatus(false);
    this.activeIcon = data;
    if (data.active) {
      this.updateDisease = false;
      this.enableDrawEllipseMode = false;
      this.canvas.isDrawingMode = true;
      this.canvas.freeDrawingBrush.color = '#ffff00';
      this.canvas.freeDrawingBrush.width = 2;
      this.canvas.freeDrawingBrush.strokeUniform = true;
      this.canvas.observe('mouse:move', (e) => {
        const pointer = this.canvas.getPointer(e.e);
        if (this.enableFreeHandDrawing) {
          if (
            pointer.x <= 0 ||
            pointer.x >= this.canvasCorrectedWidth ||
            pointer.y <= 0 ||
            pointer.y >= this.canvasCorrectedHeight
          ) {
            this.canvas.isDrawingMode = false;
          } else {
            this.canvas.isDrawingMode = true;
          }
        }
      });
      this.canvas.observe('mouse:out', (e) => {
        this.canvas.isDrawingMode = false;
      });
      this.canvas.observe('mouse:in', (e) => {
        this.canvas.isDrawingMode = true;
      });
      this.canvas.observe('object:added', (e) => {
        const object = e.target;
        this.canvas.setActiveObject(object);
        this.save();
        this.canvas.isDrawingMode = false;
        this.enableFreeHandDrawing = false;
      });
    } else {
      this.canvas.isDrawingMode = false;
    }
  }

  /**
   * function to open pathology modal
   * @param '{void}' empty - A empty param
   * @example
   *  save() ;
   */
  save() {
    if (this.canvas.isDrawingMode) {
      this.dialog.open(this.pathologyModal, {
        height: '500px',
        width: '320px',
        disableClose: true,
      });
      this.canvas.isDrawingMode = false;
    }
    this.changeSelectableStatus(true);
  }

  /**
   * function to open pathology modal for update
   * @param '{void}' empty - A empty param
   * @example
   *  updateEllipse();
   */
  updateEllipse() {
    this.updateDisease = true;
    this.dialog.open(this.pathologyModal, {
      height: '500px',
      width: '320px',
      disableClose: true,
    });
  }

  /**
   * onSubmitPatientDetails function to navigate to report page
   * @param '{void}' empty - A empty param
   * @example
   *  onSubmitPatientDetails() ;
   */
  onSubmitPatientDetails() {
    this.resetZoom();
    this.keepPositionInBounds(this.canvas);
    this.ellipseLists(true, '');
    this.processedImage = this.canvas.toDataURL('image/png');
    sessionStorage.setItem('annotatedImage', this.processedImage);
    this.annotatedXrayService.xrayAnnotatedService(this.processedImage);
    this.router.navigate(['report'], {
      state: { patientDetails: this.patientDetail },
    });
  }

  /**
   *  This is getColorMapping function
   * @param '{string}' value - A string param
   * @param '{string}' value - A string param
   * @example
   * getColorMapping(diseases, check);
   */
  getColorMapping(diseases, check, src) {
    const colorName =
      DISEASE_COLOR_MAPPING[diseases.toLowerCase()] || RANDOM_COLOR;
    if (
      this.canvas._activeObject === null ||
      this.canvas._activeObject === undefined
    ) {
      const obj = {
        color: colorName,
        ellipses: [],
        index: this.selectedObjectPrediction.id,
        name: diseases,
        source: src,
        diseaseType: this.diseaseType,
      };
      // tslint:disable-next-line: no-string-literal
      this.savedInfo['data'].ndarray[0].diseases.push(obj);
      sessionStorage.removeItem('x-ray_Data');
      sessionStorage.setItem('x-ray_Data', JSON.stringify(this.savedInfo));
      return;
    }
    if (!this.canvas._activeObject.path) {
      const obj = {
        color: colorName,
        diseaseType: this.diseaseType,
        ellipses: [
          {
            x: this.canvas._activeObject.left,
            y: this.canvas._activeObject.top,
            a: this.canvas._activeObject.rx,
            b: this.canvas._activeObject.ry,
            r: this.canvas._activeObject.angle,
            index: this.canvas._activeObject.id,
            type: 'ellipse',
            source: src,
          },
        ],
        index: this.canvas._activeObject.id,
        name: diseases,
        source: src,
      };
      if (check === 'update') {
        sessionStorage.removeItem('x-ray_Data');
        // tslint:disable-next-line: no-string-literal
        this.savedInfo['data'].ndarray[0].Impression.forEach(
          (element, index) => {
            const compare = this.canvas.getActiveObject().index
              ? this.canvas.getActiveObject().index
              : this.canvas.getActiveObject().id;
            if (element.index === compare) {
              // tslint:disable-next-line: no-string-literal
              this.savedInfo['data'].ndarray[0].Impression.splice(index, 1, {
                index: this.canvas._activeObject.id,
                sentence: diseases,
                source: src,
              });
              // tslint:disable-next-line: no-string-literal
              this.savedInfo['data'].ndarray[0].diseases.splice(index, 1, obj);
            }
          }
        );
      } else {
        // tslint:disable-next-line: no-string-literal
        this.savedInfo['data'].ndarray[0].diseases.push(obj);
      }
      this.enableDrawEllipseMode = false;
    } else {
      const newArrayValues = [];
      this.canvas.freeDrawingBrush._points.forEach((pathElement) => {
        newArrayValues.push({
          x: pathElement.x * this.canvasScaleX,
          y: pathElement.y * this.canvasScaleY,
        });
      });
      const obj = {
        color: colorName,
        freeHandDrawing: true,
        coordinatevalues: newArrayValues,
        index: this.canvas._activeObject.id
          ? this.canvas._activeObject.id
          : Math.floor(Math.random() * 300 + 1),
        name: diseases,
        type: 'ellipse',
        source: src,
        diseaseType: this.diseaseType,
        angle: this.canvas._activeObject.angle,
      };
      if (check === 'update') {
        sessionStorage.removeItem('x-ray_Data');
        // tslint:disable-next-line: no-string-literal
        this.savedInfo['data'].ndarray[0].Impression.forEach(
          (element, index) => {
            const compare = this.canvas.getActiveObject().index
              ? this.canvas.getActiveObject().index
              : this.canvas.getActiveObject().id;
            if (element.index === compare) {
              // tslint:disable-next-line: no-string-literal
              this.savedInfo['data'].ndarray[0].Impression.splice(index, 1, {
                index: this.canvas._activeObject.id,
                sentence: diseases,
                source: src,
              });
              if (obj.coordinatevalues.length === 0) {
                const getArrayValues = [];
                this.savedInfo['data'].ndarray[0].diseases[
                  index
                ].contours[0].coordinates.forEach((pathElement) => {
                  getArrayValues.push({ x: pathElement[0], y: pathElement[1] });
                });
                // tslint:disable-next-line: no-string-literal
                obj.coordinatevalues = getArrayValues;
              }
              // tslint:disable-next-line: no-string-literal
              this.savedInfo['data'].ndarray[0].diseases.splice(index, 1, obj);
            }
          }
        );
      } else {
        // tslint:disable-next-line: no-string-literal
        this.savedInfo['data'].ndarray[0].diseases.push(obj);
      }
    }
    sessionStorage.removeItem('x-ray_Data');
    sessionStorage.setItem('x-ray_Data', JSON.stringify(this.savedInfo));
    if (this.canvas.getActiveObject() != null) {
      this.canvas.getActiveObject().set({
        stroke: colorName,
      });
      this.canvas.renderAll();
    }
  }

  /**
   * This is saveEllipseIntoSession function
   * @param '{void}' empty - A empty param
   * @example
   * saveEllipseIntoSession();
   */
  saveEllipseIntoSession() {
    const selectedObject = this.canvas.getActiveObject();
    this.scaleSaveEllipse(selectedObject);
  }

  /**
   * This is updateEllipseIntoSession function
   * @param '{void}' empty - A empty param
   * @example
   * updateEllipseIntoSession();
   */
  updateEllipseIntoSession() {
    const object = this.canvas.getActiveObject();
    const index = this.sessionSelectedEllipseObject.findIndex(
      (item) => item.id === object.id
    );
    this.sessionSelectedEllipseObject.splice(index, 1);
    const updateEllipse = {} as UpdateEllipse;
    updateEllipse.id = object.id;
    updateEllipse.left = object.left * this.canvasScaleX;
    updateEllipse.top = object.top * this.canvasScaleY;
    updateEllipse.rx = object.width * object.scaleX * this.canvasScaleX;
    updateEllipse.ry = object.height * object.scaleY * this.canvasScaleY;
    updateEllipse.color = object.stroke;
    updateEllipse.angle = object.angle;
    updateEllipse.width = object.angle;
    updateEllipse.height = object.angle;
    updateEllipse.strokeDashArray = object.strokeDashArray;
    updateEllipse.isMLAi = object.isMLAi;
    updateEllipse.type = object.type;
    this.sessionSelectedEllipseObject.push(updateEllipse);
    sessionStorage.removeItem('ellipse');
    sessionStorage.setItem(
      'ellipse',
      JSON.stringify(this.sessionSelectedEllipseObject)
    );
  }

  /**
   * This is updateFreeHandDrawingIntoSession function
   * @param '{void}' empty - A empty param
   * @example
   * updateFreeHandDrawingIntoSession();
   */
  updateFreeHandDrawingIntoSession() {
    this.selectedPathArray = [];
    const object = this.canvas.getActiveObject();
    const SelectedPath = object.canvas.freeDrawingBrush._points;
    const selectedPathString = SelectedPath.join(' ');
    const selectedPathStrings = selectedPathString.split(' ');
    selectedPathStrings.forEach((pathElement) => {
      const pathArray = pathElement.split(',');
      const x = pathArray[0] * this.canvasScaleX;
      const y = pathArray[1] * this.canvasScaleY;
      this.selectedPathArray.push(x);
      this.selectedPathArray.push(y);
    });
    const selectedObjectPath = this.selectedPathArray.join(' ');
    const UpdateFreeHand = {} as UpdateFreeHandDrawing;
    UpdateFreeHand.id = object.id;
    UpdateFreeHand.color = object.stroke;
    UpdateFreeHand.coordinateValue = selectedObjectPath;
    const index = this.sessionSelectedFreeDrawObject.findIndex(
      (item) => item.id === object.id
    );
    this.sessionSelectedFreeDrawObject.splice(index, 1);
    this.sessionSelectedFreeDrawObject.push(UpdateFreeHand);
    sessionStorage.removeItem('freeHandDrawing');
    sessionStorage.setItem(
      'freeHandDrawing',
      JSON.stringify(this.sessionSelectedFreeDrawObject)
    );
  }

  /**
   * This is deleteEllipseInSession function
   * @param '{void}' empty - A empty param
   * @example
   * deleteEllipseInSession();
   */
  deleteEllipseInSession() {
    const object = this.canvas.getActiveObject();
    const index = this.sessionSelectedEllipseObject.findIndex(
      (item) => item.id === object.id
    );
    this.sessionSelectedEllipseObject.splice(index, 1);
    sessionStorage.removeItem('ellipse');
    sessionStorage.setItem(
      'ellipse',
      JSON.stringify(this.sessionSelectedEllipseObject)
    );
    this.canvas.remove(this.canvas.getActiveObject());
  }

  /**
   * This is deleteFreeHandDrawingInSession function
   * @param '{void}' empty - A empty param
   * @example
   * deleteFreeHandDrawingInSession();
   */
  deleteFreeHandDrawingInSession() {
    const object = this.canvas.getActiveObject();
    const index = this.sessionSelectedFreeDrawObject.findIndex(
      (item) => item.id === object.id
    );
    this.sessionSelectedFreeDrawObject.splice(index, 1);
    sessionStorage.removeItem('freeHandDrawing');
    sessionStorage.setItem(
      'freeHandDrawing',
      JSON.stringify(this.sessionSelectedFreeDrawObject)
    );
    this.canvas.remove(this.canvas.getActiveObject());
  }

  /**
   * This is saveFreeHandDrawingIntoSession function
   * @param '{void}' empty - A empty param
   * @example
   * saveFreeHandDrawingIntoSession();
   */
  saveFreeHandDrawingIntoSession() {
    this.selectedPathArray = [];
    const saveFreeHandDrawing = {} as SaveFreeHandDrawing;
    const SelectedPath = this.selectedObjectPrediction.canvas.freeDrawingBrush
      ._points;
    const selectedPathString = SelectedPath.join(' ');
    const selectedPathStrings = selectedPathString.split(' ');
    selectedPathStrings.forEach((pathElement) => {
      const pathArray = pathElement.split(',');
      const x = pathArray[0] * this.canvasScaleX;
      const y = pathArray[1] * this.canvasScaleY;
      this.selectedPathArray.push(x);
      this.selectedPathArray.push(y);
    });
    const selectedObjectPath = this.selectedPathArray.join(' ');
    saveFreeHandDrawing.coordinateValue = selectedObjectPath;
    saveFreeHandDrawing.color = this.selectedObjectPrediction.stroke;
    saveFreeHandDrawing.id = this.selectedObjectPrediction.id;
    this.sessionSelectedFreeDrawObject.push(saveFreeHandDrawing);
    sessionStorage.setItem(
      'freeHandDrawing',
      JSON.stringify(this.sessionSelectedFreeDrawObject)
    );
  }

  /**
   * This is getSessionEllipse function
   * @param '{void}' empty - A empty param
   * @example
   * getSessionEllipse();
   */
  getSessionEllipse() {
    const ellipses = JSON.parse(sessionStorage.getItem('ellipse'));
    if (ellipses) {
      ellipses.forEach((element) => {
        const sessionEllipse = new fabric.Ellipse({
          width: element.width / this.canvasScaleX,
          height: element.height / this.canvasScaleY,
          left: element.left / this.canvasScaleX,
          top: element.top / this.canvasScaleY,
          rx: element.rx / this.canvasScaleX / 2,
          ry: element.ry / this.canvasScaleY / 2,
          angle: element.angle,
          stroke: element.color,
          id: element.id,
          originX: 'left',
          originY: 'top',
          strokeWidth: 2,
          fill: '',
          selectable: true,
          strokeDashArray: element.strokeDashArray,
          type: element.type,
          isMLAi: element.isMLAi,
        });
        this.dialog.closeAll();
        this.canvas.add(sessionEllipse);
      });
      this.canvas.renderAll();
    }
  }

  /**
   * This is getSessionFreeHandDrawing function
   * @param '{void}' empty - A empty param
   * @example
   * getSessionFreeHandDrawing();
   */
  getSessionFreeHandDrawing() {
    const path = JSON.parse(sessionStorage.getItem('freeHandDrawing'));
    if (path === null) {
      return;
    }
    if (path.length !== 0) {
      path.forEach((element) => {
        const coordinatePath = element.coordinateValue.split(' ');
        for (let i = 0; i < coordinatePath.length; i++) {
          if (i % 2 === 0) {
            let xPosition: any = coordinatePath[i];
            xPosition = xPosition / this.canvasScaleX;
            this.coordinateList.push(xPosition);
          } else {
            let yPosition: any = coordinatePath[i];
            yPosition = yPosition / this.canvasScaleY;
            this.coordinateList.push(yPosition);
          }
        }
        const appendCharacter = 'M' + ' ';
        this.coordinateList.unshift(appendCharacter);
        this.canvas.add(
          new fabric.Path(this.coordinateList.join(' '), {
            // @ts-ignore
            stroke: element.color,
            strokeWidth: 2,
            fill: '',
            originX: 'center',
            originY: 'center',
            opacity: 0.8,
            id: element.id,
          })
        );
        this.coordinateList = [];
      });
      this.canvas.renderAll();
      this.dialog.closeAll();
    }
  }

  /**
   * This is resetZoom function
   * @param '{void}' empty - A empty param
   * @example
   * resetZoom(123);
   */
  resetZoom() {
    this.displayScaleFactor = 1.0;
    this.shiftKeyDown = false;
    this.canvas.setZoom(1);
    this.keepPositionInBounds(this.canvas);
  }

  /**
   * This is keepPositionInBounds function
   * @param '{any}' data - A array param
   * @example
   * keepPositionInBounds(e);
   */
  keepPositionInBounds(e: any) {
    const zoom = this.canvas.getZoom();
    const xMin = ((2 - zoom) * this.canvas.getWidth()) / 2;
    const xMax = (zoom * this.canvas.getWidth()) / 2;
    const yMin = ((2 - zoom) * this.canvas.getHeight()) / 2;
    const yMax = (zoom * this.canvas.getHeight()) / 2;
    const point = new fabric.Point(
      this.canvas.getWidth() / 2,
      this.canvas.getHeight() / 2
    );
    const center = fabric.util.transformPoint(
      point,
      this.canvas.viewportTransform
    );
    const clampedCenterX = this.clamp(center.x, xMin, xMax);
    const clampedCenterY = this.clamp(center.y, yMin, yMax);
    const diffX = clampedCenterX - center.x;
    const diffY = clampedCenterY - center.y;
    if (diffX !== 0 || diffY !== 0) {
      this.canvas.relativePan(new fabric.Point(diffX, diffY));
    }
  }

  /**
   * This is clamp function
   * @param '{number}' index - A number param
   * @param '{number}' index - A number param
   * @param '{number}' index - A number param
   * @example
   * clamp(123, 23, 13);
   */
  clamp(value: number, min: number, max: number) {
    return Math.max(min, Math.min(value, max));
  }
  /**
   * Hide/Show list of drawn ellipseList
   * @param '{any}' data - A array param
   * @example
   * ellipseLists();
   */
  ellipseLists(value, event: any) {
    const objects = this.canvas.getObjects();
    if (event.type === 'click') {
      this.eventEmitterService2.onEyeIconClick(value);
    }
    if (value === true) {
      objects.forEach((object) => {
        this.isChangeable = true;
        this.canvas.setVisible = object.visible = value;
        this.canvas.renderAll();
      });
    } else {
      objects.forEach((object) => {
        this.isChangeable = false;
        this.canvas.setVisible = object.visible = value;
        this.canvas.discardActiveObject();
        this.canvas.renderAll();
      });
    }
  }

  /**
   * This is showHideAnnotations function
   * @param '{any}' array - A array param
   * @example
   * showHideAnnotations(data);
   */
  showHideAnnotations(data) {
    this.canvas._objects.forEach((element) => {
      element.stroke = element.stroke.trim();
      data.info.colors = data.info.colors.trim();
      if (element.stroke[0] === '#') {
        const hex2rgb = (c) =>
          `rgb(${c
            .substr(1)
            .match(/../g)
            .map((x) => +`0x${x}`)})`;
        element.stroke = hex2rgb(element.stroke);
      }
      if (data.info.colors[0] === '#') {
        const hex2rgb = (c) =>
          `rgb(${c
            .substr(1)
            .match(/../g)
            .map((x) => +`0x${x}`)})`;
        data.info.colors = hex2rgb(data.info.colors);
      }
      if (element.stroke === data.info.colors) {
        this.canvas.setVisible = element.visible = data.check;
        this.canvas.discardActiveObject();
        this.canvas.renderAll();
      }
    });
  }

  /**
   * This is getBrightness function
   * @param '{number}' value - A number param
   * @example
   * getBrightness(data);
   */
  getBrightness(data: number) {
    this.checkBrightnessContrast = 'brightness';
    this.brightnessRange = data;
    this.getRange();
  }

  /**
   * This is getContrast function
   * @param '{number}' value - A number param
   * @example
   * getContrast();
   */
  getContrast(data: number) {
    this.checkBrightnessContrast = 'contrast';
    this.contrastRange = data;
    this.getRange();
  }

  /**
   * This is getRange function
   * @param '{void}' empty - A empty param
   * @example
   * getRange();
   */
  getRange() {
    if (this.checkBrightnessContrast === 'brightness') {
      this.brightness = this.sanitizer.bypassSecurityTrustStyle(
        'brightness(' + this.brightnessRange * 2 + '%)'
      );
    } else {
      this.brightness = this.sanitizer.bypassSecurityTrustStyle(
        'contrast(' + this.contrastRange * 2 + '%)'
      );
    }
  }

  /**
   * This is stopDragging function
   * @param '{any}' array - A array param
   * @example
   * stopDragging(element);
   */
  stopDragging(element) {
    element.lockMovementX = true;
    element.lockMovementY = true;
  }

  /**
   * This is getStoredAnnotations function
   * @param '{number}' index - A number param
   * @example
   * getStoredAnnotations(xRayId);
   */
  getStoredAnnotations(xRayId) {
    this.spinnerService.show();
    this.annotatedXrayService.getAnnotatedData(xRayId).subscribe(
      (response) => {
        this.savedAnnotations = response;
        if (this.savedAnnotations.data.ndarray[0].Source !== 'DR') {
          this.eventEmitterService.onAskAiButtonClick('success');
        }
      },
      (errorMessage: string) => {
        this.spinnerService.hide();
        this.toastrService.error('Failed to fetch annotated data');
      }
    );
  }

  /**
   * This is diffusePathology function
   * @param '{any}' array - A array param
   * @example
   * diffusePathology(data);
   */
  diffusePathology(data) {
    this.dialog.closeAll();
    this.activeIcon = data;
    this.pathologyNames = this.constants.diffusePathology;
    this.openPathologyModal();
  }

  /**
   * This is displayMessage function
   * @param '{any}' array - A array param
   * @example
   * displayMessage(obj);
   */
  displayMessage(obj: any) {
    if (obj.target === null) {
      return true;
    } else if (obj.target.lockRotation) {
      this.lockRotation = true;
      this.onHoveringAnnotation(obj);
    } else {
      this.lockRotation = false;
    }
  }

  /**
   * This is restrictObjectOnRotate function
   * @param '{any}' array - A array param
   * @example
   * restrictObjectOnRotate(obj);
   */

  restrictObjectOnRotate(obj: any) {
    const object = obj.target;
    const coords = object.calcCoords();
    const blx = coords.bl.x;
    const bly = coords.bl.y;
    const brx = coords.br.x;
    const bry = coords.br.y;
    const tlx = coords.tl.x;
    const tly = coords.tl.y;
    const txr = coords.tr.x;
    const tyr = coords.tr.y;
    if (
      blx >= object.canvas.width ||
      brx >= object.canvas.width ||
      tlx >= object.canvas.width ||
      txr >= object.canvas.width
    ) {
      this.canvas.getActiveObject().set({
        lockRotation: true,
      });
      this.canvas.renderAll();
    } else if (blx <= 0 || brx <= 0 || tlx <= 0 || txr <= 0) {
      this.canvas.getActiveObject().set({
        lockRotation: true,
      });
      this.canvas.renderAll();
    } else if (
      bly >= object.canvas.height ||
      bry >= object.canvas.height ||
      tly >= object.canvas.height ||
      tyr >= object.canvas.height
    ) {
      this.canvas.getActiveObject().set({
        lockRotation: true,
      });
      this.canvas.renderAll();
    } else if (bly <= 0 || bry <= 0 || tly <= 0 || tyr <= 0) {
      this.canvas.getActiveObject().set({
        lockRotation: true,
      });
      this.canvas.renderAll();
    } else {
      this.canvas.getActiveObject().set({
        lockRotation: false,
      });
      this.lockRotation = false;
      this.canvas.renderAll();
      // this.objectSelected = true;
      this.selectedObject(obj);
    }
  }

  /**
   * This is onHoveringOutAnnotation function
   * @param '{any}' array - A array param
   * @example
   * onHoveringOutAnnotation(obj);
   */

  onHoveringOutAnnotation(obj: any) {
    if (obj.target === null) {
      return true;
    } else if (obj.target.lockRotation) {
      document.getElementById('target').style.display = 'none';
    } else {
      return true;
    }
  }

  /**
   * This is onHoveringAnnotation function
   * @param '{any}' array - A array param
   * @example
   * onHoveringAnnotation(obj);
   */

  onHoveringAnnotation(obj: any) {
    if (this.lockRotation === true) {
      const object = obj.target;
      if (object === null) {
        return;
      } else {
        const coords = object.calcCoords();
        document.getElementById('target').style.display = 'block';
        if (object.getBoundingRect().top <= 70) {
          const mbx = coords.mb.x;
          const mby = coords.mb.y;
          document.getElementById('target').style.top = mby + 100 + 'px';
          document.getElementById('target').style.left = mbx + 150 + 'px';
        } else {
          const mtx = coords.mt.x;
          const mty = coords.mt.y;
          document.getElementById('target').style.top = mty - 40 + 'px';
          document.getElementById('target').style.left = mtx + 150 + 'px';
        }
      }
    }
    this.canvas.renderAll();
  }

  /**
   * This is selectedObject function
   * @param '{any}' array - A array param
   * @example
   * selectedObject(evt);
   */

  selectedObject(evt: any) {
    this.objectModified = true;
    this.selctedObjectArray = evt;
  }
}
