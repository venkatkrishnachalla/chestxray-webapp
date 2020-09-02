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
  zoomLevel: number;
  zoomLevelMin: number;
  zoomLevelMax: number;
  shiftKeyDown: boolean;
  mouseDownPoint: null;
  resize: boolean;
  Direction = {
    LEFT: 0,
    UP: 1,
    RIGHT: 2,
    DOWN: 3,
  };

  /*
   * constructor for CanvasImageComponent class
   */
  isChangeable: boolean = true;

  constructor(
    private spinnerService: SpinnerService,
    private eventEmitterService: EventEmitterService,
    private dialog: MatDialog,
    private xRayService: XRayImageService,
    private annotatedXrayService: XRayService,
    private router: Router,
    private toastrService: ToastrService
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
   * @param {string} value - A string param
   * @param {any} array - A array param
   * @example
   * HostListener('window:resize', []);
   */

  @HostListener('window:resize', [])
  public onResize() {
    this.resize = true;
    this.canvas.clear(fabric.Ellipse);
    this.canvas.clear(fabric.Path);
    this.canvasDynamicHeight = 0;
    this.canvasDynamicWidth = 0;
    this.canvasScaleX = 0;
    this.canvasScaleY = 0;
    this.setCanvasDimension();
    this.setCanvasBackground();
    this.getSessionEllipse();
    this.getSessionFreeHandDrawing();
  }

  /**
   * This is a init function.
   * @param {void} empty - A empty param
   * @example
   * ngOnInit();
   */

  ngOnInit() {
    this.zoomLevel = 0;
    this.zoomLevelMin = 0;
    this.zoomLevelMax = 5;
    this.shiftKeyDown = false;
    this.resize = false;
    sessionStorage.removeItem('ellipse');
    sessionStorage.removeItem('freeHandDrawing');
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
    this.eventEmitterService.invokeComponentFunction.subscribe(
      (data: InvokeComponentData) => {
        switch (data.title) {
          case 'Draw Ellipse':
            this.drawEllipse(data);
            break;
          case 'Free Hand Drawing':
            this.freeHandDrawing(data);
            break;
          case 'Delete':
            break;
          default:
            break;
        }
      }
    );
    this.spinnerService.show();
    this.eventsSubscription = this.events.subscribe(
      (mlResponse: any) => {
        // tslint:disable-next-line: no-string-literal
        this.savedInfo['data'].ndarray[0].Findings =
          mlResponse.data.ndarray[0].Findings;
        mlResponse.data.ndarray[0].Impression.forEach((element) => {
          // tslint:disable-next-line: no-string-literal
          this.savedInfo['data'].ndarray[0].Impression.push(element);
        });
        mlResponse.data.ndarray[0].diseases.forEach((element) => {
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
    //double click event for reset zoom of image
    this.canvas.on('mouse:dblclick', (options) => {
      this.canvas.setZoom(1);
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
    this.canvas.on('mouse:wheel', (options) => {
      const delta = options.e.deltaY;
      if (delta !== 0) {
        const pointer = this.canvas.getPointer(options.e, true);
        const point = new fabric.Point(pointer.x, pointer.y);
        if (delta > 0) {
          this.zoomOut(point);
        } else if (delta < 0) {
          this.zoomIn(point);
        }
      }
    });
    this.canvas.on('object:modified', (options) => {
      this.actionIconsModelDispaly(options);
      if (this.canvas.getActiveObject().type === 'ellipse') {
        this.updateEllipseIntoSession();
      }
    });
    this.canvas.on('object:rotating', (e) => {
      if (!this.enableDrawEllipseMode) {
        this.dialog.closeAll();
      }
    });
    this.patientDetail = history.state.patientDetails;
    if (this.patientDetail === undefined) {
      const patientDetail = JSON.parse(sessionStorage.getItem('patientDetail'));
      this.patientDetail = patientDetail;
    }
    const patientImage = JSON.parse(sessionStorage.getItem('PatientImage'));
    this.PatientImage = patientImage ? patientImage.base64Image : null;
    const isUser = this.patientDetail.isIndividualRadiologist ? true : false;
    this.patientId = this.patientDetail ? this.patientDetail.id : '';

    if (this.PatientImage && isUser) {
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
      this.actionIconsModelDispaly(evt);
      this.canvas.sendToBack(this.canvas._activeObject);
    });
    this.canvas.on('selection:cleared', (evt) => {
      if (!this.enableDrawEllipseMode) {
        this.dialog.closeAll();
      }
    });
    this.canvas.on('object:moving', (evt) => {
      const obj = evt.target;
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
      const obj = e.target;
      obj.setCoords();
      const brNew = obj.getBoundingRect();

      if (
        brNew.width + brNew.left >= obj.canvas.width ||
        brNew.height + brNew.top >= obj.canvas.height ||
        brNew.left < 0 ||
        brNew.top < 0
      ) {
        obj.left = left1;
        obj.top = top1;
        obj.scaleX = scale1x;
        obj.scaleY = scale1y;
        obj.width = width1;
        obj.height = height1;
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
    this.canvas.on('object:moved', (evt) => {
      this.actionIconsModelDispaly(evt);
    });
    this.canvas.on('selection:updated', (evt) => {
      this.dialog.closeAll();
      this.actionIconsModelDispaly(evt);
    });
  }

  /**
   * This is a prevNextPatientChange function.
   * @param {string} value - A string param
   * @example
   * prevNextPatientChange(patientId);
   */

  prevNextPatientChange(patientId) {
    this.canvas.setZoom(1);
    this.keepPositionInBounds(this.canvas);
    this.canvas.clear();
    this.spinnerService.show();
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
  }

  /**
   * This is a restrictionToBoundaryLimit function.
   * @param {any} data - A array param
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
    if (obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0) {
      obj.top = Math.max(obj.top, obj.top - obj.getBoundingRect().top);
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
   * @param {any} data - A array param
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
   * @param {any} data - A array param
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
        this.top = objCenterY;
      } else if (obj.angle > 40 && obj.angle <= 90) {
        this.left = objCenterX + 270;
        this.top = objCenterY;
      } else if (obj.angle > 90 && obj.angle <= 130) {
        this.left = objCenterX + 270;
        this.top = objCenterY + 30;
      } else if (obj.angle > 130 && obj.angle <= 150) {
        this.left = objCenterX + 200;
        this.top = objCenterY + 70;
      } else if (obj.angle > 150 && obj.angle <= 180) {
        this.left = objCenterX + 150;
        this.top = objCenterY + 105;
      } else if (obj.angle > 180 && obj.angle <= 270) {
        this.left = objCenterX + 20;
        this.top = objCenterY + 80;
      } else if (obj.angle > 270 && obj.angle <= 300) {
        this.left = objCenterX + 70;
        this.top = objCenterY + 50;
      } else if (obj.angle > 300 && obj.angle <= 340) {
        this.left = objCenterX + 150;
        this.top = objCenterY + 20;
      } else if (obj.angle > 340 && obj.angle <= 359) {
        this.left = objCenterX + 240;
        this.top = objCenterY + 10;
      } else {
        this.left = objCenterX + 230;
        this.top = objCenterY;
      }
    }
  }

  /**
   * This is a update search model function.
   * @param {string} value - A string param
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
   * @param {void} empty - A empty param
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
   * @param {string} value - A string param
   * @example
   * getPatientInstanceId(id);
   */
  getPatientInstanceId(id) {
    this.xRayService.getPatientInstanceId(id).subscribe(
      (patientInstanceIdResponse: any) => {
        this.instanceId =
          patientInstanceIdResponse[0].seriesList[0].instanceList[0].id;
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
   * @param {void} empty - A empty param
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
   * @param {string} vale - A string param
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
        };
        sessionStorage.setItem(
          'PatientImage',
          JSON.stringify(imageInformation)
        );
        this.setCanvasDimension();
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
   * @param {void} empty - A empty param
   * @example
   * generateCanvas();
   */
  generateCanvas() {
    fabric.Image.fromURL(this.PatientImage, (img) => {
      this.xRayImage = img;
      this.setCanvasBackground();
      const xrayData = JSON.parse(sessionStorage.getItem('x-ray_Data'));
      if (xrayData) {
        this.savedInfo = xrayData;
      }
      if (xrayData !== null && xrayData.data.ndarray[0].Impression.length > 0) {
        if (this.resize === false) {
          this.mlApiEllipseLoop(xrayData, 'session');
        }
      }
    });
  }

  /**
   * function to compare image vs container aspect ratio width
   * @param {string} value - A string param
   * @param {string} value - A string param
   * @example
   * getWidthFirst(imageAspectRatio, containerAspectRatio);
   */
  getWidthFirst(imageAspectRatio, containerAspectRatio) {
    return imageAspectRatio > containerAspectRatio;
  }

  /**
   * setting BackgroundImage for canvas block
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
   * @param {any} data - A array param
   * @param {string} value - A string param
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
        isMLApi: true,
      };
    });
    if (mlList.data.ndarray[0].Impression.length === 0) {
      const impressionObject = {
        title: 'impression',
        id: '00',
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
        info.Name !== 'ADDITIONAL'
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
        if (finalFinding === '' && info.Name !== 'ADDITIONAL') {
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
    mLArray.diseases.forEach((disease: any) => {
      if (disease.ellipses) {
        disease.ellipses.forEach((ellipse: any, index) => {
          ellipse.id = ellipse.index;
          ellipse.color = disease.color;
          ellipse.name = disease.name;
          ellipse.index = index;
          if (ellipse.a !== 0 && ellipse.b !== 0) {
            this.eventEmitterService.onComponentEllipseDataShared({
              name: disease.name,
              index: ellipse.index,
            });
            const random = Math.floor(Math.random() * 100 + 1);
            const selectedObject = {
              title: 'impression',
              isMLApi: true,
              id: check !== 'session' ? random : ellipse.id,
              name: disease.name,
              color: ellipse.color,
            };
            this.impressionArray.push(selectedObject);
            const colorFinding = this.impressionArray.filter(
              (book) => book.name.toLowerCase() === disease.name.toLowerCase()
            );
            if (colorFinding.length < 2) {
              this.eventEmitterService.onComponentDataShared(selectedObject);
            }
            ellipse.idvalue = random;
            this.drawEllipse([], true, ellipse);
          }
        });
      } else if (disease.freeHandDrawing) {
        const coordinatePath = disease.coordinatevalues;
        this.eventEmitterService.onComponentEllipseDataShared({
          name: disease.name,
          index: disease.index,
        });
        const random = Math.floor(Math.random() * 100 + 1);
        const selectedObject = {
          title: 'impression',
          isMLApi: true,
          id: check !== 'session' ? random : disease.id,
          name: disease.name,
          color: disease.color,
        };
        this.impressionArray.push(selectedObject);
        const colorFinding = this.impressionArray.filter(
          (book) => book.name.toLowerCase() === disease.name.toLowerCase()
        );
        if (colorFinding.length < 2) {
          this.eventEmitterService.onComponentDataShared(selectedObject);
        }
        this.canvas.add(
          new fabric.Path(coordinatePath.join(''), {
            id: disease.index,
            disease: disease.disease,
            stroke: disease.color,
            strokeWidth: 2,
            fill: '',
            originX: 'center',
            originY: 'center',
            opacity: 0.8,
            strokeUniform: true,
            types: true,
          })
        );
      }
    });
  }

  /**
   * on destroy event subscription
   * @param {void} empty - A empty param
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
   * @param {string} value - A string param
   * @example
   * firstComponentFunction(title);
   */
  firstComponentFunction(title) {
    this.eventEmitterService.onComponentButtonClick(title);
  }

  /**
   * Draw Ellipse Functionality
   * @param {string} value - A string param
   * @param {string} value - A string param
   * @param {string} value - A string param
   * @example
   *  drawEllipse(data, isMlAi?, diseaseItem?);
   */
  drawEllipse(data, isMlAi?, diseaseItem?) {
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
        strokeWidth: 2,
        fill: '',
        selectable: true,
        strokeUniform: true,
        index: diseaseItem.index !== 0 ? diseaseItem.index : diseaseItem.id,
        id: diseaseItem.idvalue,
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
   * @param {string} value - A string param
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
    this.sessionSelectedEllipseObject.push(saveEllipse);
    sessionStorage.removeItem('ellipse');
    sessionStorage.setItem(
      'ellipse',
      JSON.stringify(this.sessionSelectedEllipseObject)
    );
  }

  /**
   *  This is  changeSelectableStatus function
   * @param {string} value - A string param
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
   * @param {void} empty - A empty param
   * @example
   * deleteEllipse();
   */
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
   * @param {void} empty - A empty param
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
   * @param {string} value - A string param
   * @param {string} value - A string param
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
   * @param {string} value - A string param
   * @param {string} value - A string param
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
   * @param {void} empty - A empty param
   * @example
   * savePrediction();
   */
  savePrediction() {
    const random = Math.floor(Math.random() * 100 + 1);
    this.canvas.getActiveObject().index = random;
    this.selectedObjectPrediction = this.canvas.getActiveObject();
    const selectedObjectPrediction = this.canvas.getActiveObject();
    selectedObjectPrediction.id = random;
    const selectedObject = { id: random, name: this.selectedDisease };
    this.savedObjects.push(selectedObjectPrediction);
    this.storeDataInSession(
      { index: random, sentence: this.selectedDisease },
      'impression'
    );
    this.eventEmitterService.onComponentDataShared(selectedObject);
    this.getColorMapping(this.selectedDisease, 'save');
    this.clear();
    this.activeIcon.active = false;
    this.dialog.closeAll();
    if (this.selectedObjectPrediction.type === 'ellipse') {
      this.saveEllipseIntoSession();
    } else {
      this.saveFreeHandDrawingIntoSession();
    }
    this.toastrService.success('Annotation saved successfully');
    this.canvas.discardActiveObject();
    this.canvas.renderAll();
  }

  /**
   * Delete active object
   * @param {void} empty - A empty param
   * @example
   * deletePrediction();
   */
  deletePrediction() {
    sessionStorage.removeItem('x-ray_Data');
    // tslint:disable-next-line: no-string-literal
    this.savedInfo['data'].ndarray[0].Impression.forEach((element, index) => {
      const compare = this.canvas.getActiveObject().index
        ? this.canvas.getActiveObject().index
        : this.canvas.getActiveObject().id;

      if (element.index === compare) {
        // tslint:disable-next-line: no-string-literal
        this.savedInfo['data'].ndarray[0].Impression.splice(index, 1);
        // tslint:disable-next-line: no-string-literal
        this.savedInfo['data'].ndarray[0].diseases.splice(index, 1);
      }
    });
    sessionStorage.setItem('x-ray_Data', JSON.stringify(this.savedInfo));
    const selectedObject = {
      id: this.canvas.getActiveObject().id,
      check: 'delete',
      disease: this.canvas.getActiveObject().disease,
      objectindex: this.canvas.getActiveObject().index,
    };
    this.eventEmitterService.onComponentButtonClick(selectedObject);
    this.dialog.closeAll();
    if (this.canvas.getActiveObject().type === 'ellipse') {
      this.deleteEllipseInSession();
    } else {
      this.deleteFreeHandDrawingInSession();
    }
    this.toastrService.success('Annotation deleted successfully');
  }

  /**
   * Update active object
   * @param {void} empty - A empty param
   * @example
   * updatePrediction();
   */
  updatePrediction() {
    const selectedObject = {
      id: this.canvas.getActiveObject().id,
      check: 'update',
      name: this.selectedDisease,
    };
    this.eventEmitterService.onComponentButtonClick(selectedObject);
    this.getColorMapping(this.selectedDisease, 'update');
    this.clear();
    this.dialog.closeAll();
    if (this.canvas.getActiveObject().type === 'ellipse') {
      this.updateEllipseIntoSession();
    } else {
      this.updateFreeHandDrawingIntoSession();
    }
    this.clear();
    this.selectedDisease = '';
    this.toastrService.success('Annotation updated successfully');
    this.canvas.discardActiveObject();
    this.canvas.renderAll();
  }

  /**
   * Close Pathology modal functionality
   * @param {void} empty - A empty param
   * @example
   * closePathologyModal();
   */
  closePathologyModal() {
    this.clear();
    if (!this.updateDisease) {
      this.canvas.remove(this.canvas.getActiveObject());
      this.canvas.renderAll();
      this.activeIcon.active = false;
    }
    this.canvas.isDrawingMode = false;
    this.enableDrawEllipseMode = false;
    this.dialog.closeAll();
  }

  /**
   * Free hand Drawing functionality
   * @param {string} value - A string param
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
      this.canvas.observe('object:added', (e) => {
        const object = e.target;
        this.canvas.setActiveObject(object);
        this.save();
      });
    } else {
      this.canvas.isDrawingMode = false;
    }
  }

  /**
   * function to open pathology modal
   * @param {void} empty - A empty param
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
   * @param {void} empty - A empty param
   * @example
   *  updateEllipse() ;
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
   * @param {void} empty - A empty param
   * @example
   *  onSubmitPatientDetails() ;
   */
  onSubmitPatientDetails() {
    this.ellipseLists(true);
    this.processedImage = this.canvas.toDataURL('image/png');
    sessionStorage.setItem('annotatedImage', this.processedImage);
    this.annotatedXrayService.xrayAnnotatedService(this.processedImage);
    this.router.navigate(['report'], {
      state: { patientDetails: this.patientDetail },
    });
  }

  /**
   *  This is getColorMapping function
   * @param {string} value - A string param
   * @param {string} value - A string param
   * @example
   * getColorMapping(diseases, check);
   */
  getColorMapping(diseases, check) {
    const colorName =
      DISEASE_COLOR_MAPPING[diseases.toLowerCase()] || RANDOM_COLOR;
    if (!this.canvas._activeObject.path) {
      const obj = {
        color: colorName,
        ellipses: [
          {
            x: this.canvas._activeObject.left,
            y: this.canvas._activeObject.top,
            a: this.canvas._activeObject.rx,
            b: this.canvas._activeObject.ry,
            r: this.canvas._activeObject.angle,
            index: this.canvas._activeObject.id,
            type: 'ellipse',
          },
        ],
        index: this.canvas._activeObject.id,
        name: diseases,
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
      const obj = {
        color: colorName,
        freeHandDrawing: true,
        coordinatevalues: this.canvas._activeObject.path,
        index: this.canvas._activeObject.id,
        name: diseases,
        type: 'ellipse',
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
    }
    sessionStorage.removeItem('x-ray_Data');
    sessionStorage.setItem('x-ray_Data', JSON.stringify(this.savedInfo));
    this.canvas.getActiveObject().set({
      stroke: colorName,
    });
    this.canvas.renderAll();
  }

  /**
   * This is saveEllipseIntoSession function
   * @param {void} empty - A empty param
   * @example
   * saveEllipseIntoSession();
   */
  saveEllipseIntoSession() {
    const selectedObject = this.canvas.getActiveObject();
    this.scaleSaveEllipse(selectedObject);
  }

  /**
   * This is updateEllipseIntoSession function
   * @param {void} empty - A empty param
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
    this.sessionSelectedEllipseObject.push(updateEllipse);
    sessionStorage.removeItem('ellipse');
    sessionStorage.setItem(
      'ellipse',
      JSON.stringify(this.sessionSelectedEllipseObject)
    );
  }

  /**
   * This is updateFreeHandDrawingIntoSession function
   * @param {void} empty - A empty param
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
   * @param {void} empty - A empty param
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
   * @param {void} empty - A empty param
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
   * @param {void} empty - A empty param
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
   * @param {void} empty - A empty param
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
        });
        this.dialog.closeAll();
        this.canvas.add(sessionEllipse);
      });
      this.canvas.renderAll();
    }
  }

  /**
   * This is getSessionFreeHandDrawing function
   * @param {void} empty - A empty param
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
        this.dialog.closeAll();
        this.coordinateList = [];
      });
      this.canvas.renderAll();
      this.dialog.closeAll();
    }
  }

  /**
   * This is ZoomIn function
   * @param {number} index - A number param
   * @example
   * zoomIn(123);
   */
  zoomIn(point: number) {
    if (this.zoomLevel < this.zoomLevelMax) {
      this.zoomLevel++;
      this.zoomScale(point);
    }
  }

  /**
   * This is ZoomOut function
   * @param {number} index - A number param
   * @example
   * zoomOut(123);
   */

  zoomOut(point: number) {
    if (this.zoomLevel > this.zoomLevelMin) {
      this.zoomLevel--;
      this.zoomScale(point);
    }
  }

  /**
   * This is ZoomScale function
   * @param {number} index - A number param
   * @example
   * zoomScale(123);
   */

  zoomScale(point: number) {
    this.canvas.zoomToPoint(point, Math.pow(1.3, this.zoomLevel));
    this.keepPositionInBounds(this.canvas);
  }

  /**
   * This is keepPositionInBounds function
   * @param {any} data - A array param
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
   * @param {number} index - A number param
   * @param {number} index - A number param
   * @param {number} index - A number param
   * @example
   * clamp(123, 23, 13);
   */
  clamp(value: number, min: number, max: number) {
    return Math.max(min, Math.min(value, max));
  }
  /**
   * Hide/Show list of drawn ellipseList
   * * @param {any} data - A array param     
   * @example  
   * ellipseLists();
   */
  ellipseLists(event: any){
  let objects = this.canvas.getObjects();
  if(event === true){
    objects.forEach(object=>{
    this.isChangeable = true;
    this.canvas.setVisible = object.visible= event
    this.canvas.renderAll();
  })
  }else{
    objects.forEach(object=>{
    this.isChangeable = false;
    this.canvas.setVisible = object.visible= event
    this.canvas.renderAll();
      })
    } 
  };
}
