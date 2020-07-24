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
import { XRayImageService } from 'src/app/service/canvasImage';
import { Observable, Subscription, Subject } from 'rxjs';
import { XRayService } from 'src/app/service/x-ray.service';
import {
  DISEASE_COLOR_MAPPING,
  RANDOM_COLOR,
} from '../../../../constants/findingColorConstants';
import { ToastrService } from 'ngx-toastr';
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
  ellipseList: any[];
  findingsList: any[];
  processedImage: any;
  showError: boolean;
  errorMessage: string;
  errorStatus: any;
  canvasScaleX: number;
  canvasScaleY: number;
  savedObjects: any[] = [];
  mlArray: any;
  sampleData: object;
  savedInfo: object;
  coordinateList = [];

  constructor(
    private spinnerService: SpinnerService,
    private eventEmitterService: EventEmitterService,
    private dialog: MatDialog,
    private xRayService: XRayImageService,
    private annotatedXrayService: XRayService,
    private router: Router,
    private toastrService: ToastrService,
  ) {}

  @HostListener('window:resize', [])
  public onResize() {
    this.setCanvasDimension();
    this.setCanvasBackground();
  }

  /* initialization method */
  ngOnInit() {
    this.savedInfo = {
      data: { 
        names: [],
        ndarray: [
          {
            Findings: {},
            Impression: [],
            diseases: [],
          }
        ]
      }, 
      meta: {}
    };
    this.pathologyNames = this.constants.diseases;
    this.enableDrawEllipseMode = false;
    this.isDown = false;
    this.eventEmitterService.invokeComponentFunction.subscribe((data: any) => {
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
    });
    this.spinnerService.show();
    this.eventsSubscription = this.events.subscribe(
      (mlResponse: any) => {
        // tslint:disable-next-line: no-string-literal
        this.savedInfo['data'].ndarray[0].Findings = mlResponse.data.ndarray[0].Findings;
        mlResponse.data.ndarray[0].Impression.forEach(element => {
          // tslint:disable-next-line: no-string-literal
          this.savedInfo['data'].ndarray[0].Impression.push(element);
        });
        mlResponse.data.ndarray[0].diseases.forEach(element => {
          // tslint:disable-next-line: no-string-literal
          this.savedInfo['data'].ndarray[0].diseases.push(element);
        });
        sessionStorage.setItem('x-ray_Data', JSON.stringify(this.savedInfo));
        this.mlApiEllipseLoop(mlResponse);
      },
      (errorMessage: any) => {
        this.showError = true;
        this.spinnerService.hide();
        this.eventEmitterService.onErrorMessage({
          data: errorMessage,
        });
      }
    );
    this.canvas = new fabric.Canvas('at-id-x-ray-Canvas', { selection: false });
    fabric.Object.prototype.cornerColor = 'white';
    fabric.Object.prototype.cornerStyle = 'circle';
    fabric.Object.prototype.borderColor = 'white';
    this.patientDetail = history.state.patientDetails;
    if (this.patientDetail === undefined) {
      const patientDetail = JSON.parse(sessionStorage.getItem('patientDetail'));
      this.patientDetail = patientDetail;
    }
    this.PatientImage = this.patientDetail.imageSource
      ? this.patientDetail.imageSource
      : sessionStorage.getItem('PatientImage');
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
      this.actionIconsModelDispaly();
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
    this.canvas.on('object:moved', (evt) => {
      this.actionIconsModelDispaly();
    });
    this.canvas.on('selection:updated', (evt) => {
      this.dialog.closeAll();
      this.actionIconsModelDispaly();
    });
  }

  actionIconsModelDispaly() {
    const bodyRect = document.body.getBoundingClientRect();
    const right = bodyRect.right - this.canvas.getActiveObject().left;
    const top = this.canvas.getActiveObject().top - bodyRect.top;
    if (!this.enableDrawEllipseMode && this.canvas.isDrawingMode === false) {
      this.dialog.open(this.controlsModel, {
        panelClass: 'my-class',
        hasBackdrop: false,
        // tslint:disable-next-line: max-line-length
        position:
          this.canvas.getActiveObject().top < 60
            ? { right: right - 390 + 'px', top: top + 130 + 'px' }
            : { right: right - 390 + 'px', top: top + 'px' },
      });
    }
  }

  updateSearchModel(value) {
    this.searchModel = value;
  }

  /**
   * Get Patient Instance ID
   * @param patientId Patient ID
   * @return void
   */
  /* retrieve patient instance id from server */
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
    this.xRayService.getPatientImage(instanceID).subscribe(
      (PatientImageResponse: any) => {
        const imageResponse = JSON.parse(PatientImageResponse);
        this.PatientImage =
          'data:image/png;base64,' + imageResponse.base64Image;
        sessionStorage.setItem('PatientImage', JSON.stringify(imageResponse));
        this.setCanvasDimension();
        this.generateCanvas();
      },
      (errorMessage: any) => {
        this.spinnerService.hide();
        this.eventEmitterService.onErrorMessage({
          data: errorMessage,
        });
      }
    );
  }

  /* generate a canvas using fabric.js */
  generateCanvas() {
    fabric.Image.fromURL(this.PatientImage, (img) => {
      this.xRayImage = img;
      this.setCanvasBackground();
      const xrayData = JSON.parse(sessionStorage.getItem('x-ray_Data'));
      if (xrayData){
        this.savedInfo = xrayData;
      }
      if (xrayData !== null && xrayData.data.ndarray[0].Impression.length > 0){
        this.mlApiEllipseLoop(xrayData);
      }
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

  /* draw ellipse, when user clicks ask ai accept button */

  mlApiEllipseLoop(mlList: any) {
    this.mlArray = mlList;
    const mLArray = mlList.data.ndarray[0];
    this.ellipseList = [];
    this.findingsList = [];
    mLArray.Impression.forEach((impression: any) => {
      const colorFinding = mLArray.diseases.filter(
        (book) => book.name.toLowerCase() === impression.sentence.toLowerCase()
      );
      const impressionObject = {
        title: 'impression',
        id: impression.index,
        name: impression.sentence,
        isMLApi: true,
        color: colorFinding[0].color,
      };
      this.eventEmitterService.onComponentDataShared(impressionObject);
    });

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
              currentFinding[0].sentence +
              (mLArray.Findings[info.Name].length > 1 &&
              mLArray.Findings[info.Name].length - 1 !== index
                ? ', '
                : '.');
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
      if (disease.ellipses){
        disease.ellipses.forEach((ellipse: any, index) => {
          ellipse.id = ellipse.index;
          ellipse.color = disease.color;
          ellipse.name = disease.name;
          ellipse.index = index;
          if (ellipse.a !== 0 && ellipse.b !== 0) {
            this.drawEllipse([], true, ellipse);
            this.eventEmitterService.onComponentEllipseDataShared({
              name: disease.name,
              index: ellipse.index,
            });
          }
        });
      }
      if (disease.freeHandDrawing){
          const coordinatePath = disease.coordinatevalues;
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
          strokeUniform: true
          })
          );
      }
    });
  }

  ngOnDestroy() {
    this.dialog.closeAll();
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
      this.canvasScaleX = this.xRayImage.width / this.canvas.width;
      this.canvasScaleY = this.xRayImage.height / this.canvas.height;
      const ellipse = new fabric.Ellipse({
        width: 0,
        height: 0,
        disease: diseaseItem.name,
        left: diseaseItem.type === 'ellipse' ?  diseaseItem.x : (diseaseItem.x as any) / this.canvasScaleX,
        top: diseaseItem.type === 'ellipse' ?  diseaseItem.y : (diseaseItem.y as any) / this.canvasScaleY,
        rx: diseaseItem.type === 'ellipse' ?  diseaseItem.a : (diseaseItem.a as any) / this.canvasScaleX / 2,
        ry: diseaseItem.type === 'ellipse' ?  diseaseItem.b : (diseaseItem.b as any) / this.canvasScaleY / 2,
        angle: diseaseItem.r,
        stroke: diseaseItem.color,
        strokeWidth: 2,
        fill: '',
        selectable: true,
        strokeUniform: true,
        index: diseaseItem.index,
      });
      this.canvas.add(ellipse);
      this.canvas.renderAll();
      this.canvas.setActiveObject(ellipse);
      this.canvas.discardActiveObject();
      this.enableDrawEllipseMode = false;
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
              stroke: '#ffff00',
              fill: '',
              selectable: true,
              strokeUniform: true
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

  storeDataInSession(newdata, check){
    if (check === 'impression'){
      // tslint:disable-next-line: no-string-literal
      this.savedInfo['data'].ndarray[0].Impression.push(newdata);
    }
    sessionStorage.setItem('x-ray_Data', JSON.stringify(this.savedInfo));
  }

  /**
   * Emitting selected disease to Impression component
   */
  savePrediction() {
    const random = Math.floor(Math.random() * 100 + 1);
    this.canvas.getActiveObject().index = random;
    const selectedObjectPrediction = this.canvas.getActiveObject();
    selectedObjectPrediction.id = random;
    // const randomData = sessionStorage.getItem('randomIds');
    // const randomDatanew = randomData ? ((JSON.parse(randomData).length !== 0) ? JSON.parse(randomData) : []) : [];
    // randomDatanew.push({ id: random, name: this.selectedDisease });
    // sessionStorage.setItem('randomIds', JSON.stringify(randomData));
    const selectedObject = { id: random, name: this.selectedDisease };
    this.savedObjects.push(selectedObjectPrediction);
    this.storeDataInSession({ index: random, sentence: this.selectedDisease }, 'impression');
    this.eventEmitterService.onComponentDataShared(selectedObject);
    this.getColorMapping(this.selectedDisease, 'save');
    this.selectedDisease = '';
    this.activeIcon.active = false;
    this.dialog.closeAll();
    this.toastrService.success('Prediction saved successfully');
  }

  /**
   * Delete active object
   */
  deletePrediction() {
    sessionStorage.removeItem('x-ray_Data');
    // tslint:disable-next-line: no-string-literal
    this.savedInfo['data'].ndarray[0].Impression.forEach((element, index) => {
      const compare = this.canvas.getActiveObject().index ? this.canvas.getActiveObject().index : this.canvas.getActiveObject().id;
      
      if (element.index === compare){
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
    this.canvas.remove(this.canvas.getActiveObject());
    this.eventEmitterService.onComponentButtonClick(selectedObject);
    this.dialog.closeAll();
    this.toastrService.success('Prediction deleted successfully');
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
    this.getColorMapping(this.selectedDisease, 'update');
    this.selectedDisease = '';
    this.dialog.closeAll();
    this.toastrService.success('Prediction updated successfully');
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
  save() {
    if (this.canvas.isDrawingMode) {
      this.dialog.open(this.pathologyModal, {
        height: '500px',
        width: '320px',
        disableClose: true,
      });
      this.canvas.isDrawingMode = false;
    }
  }
  updateEllipse() {
    this.updateDisease = true;
    this.dialog.open(this.pathologyModal, {
      height: '500px',
      width: '320px',
      disableClose: true,
    });
  }
  onSubmitPatientDetails() {
    this.processedImage = this.canvas.toDataURL('image/png');
    sessionStorage.setItem('annotatedImage', this.processedImage);
    this.annotatedXrayService.xrayAnnotatedService(this.processedImage);
    this.router.navigate(['report'], {
      state: { patientDetails: this.patientDetail },
    });
  }
  getColorMapping(diseases, check) {
    const colorName = DISEASE_COLOR_MAPPING[diseases.toLowerCase()] || RANDOM_COLOR;
    if (this.enableDrawEllipseMode){
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
        }
      ],
      index: this.canvas._activeObject.id,
      name: diseases,
    };
    if (check === 'update'){
      sessionStorage.removeItem('x-ray_Data');
      // tslint:disable-next-line: no-string-literal
      this.savedInfo['data'].ndarray[0].Impression.forEach((element, index) => {
        const compare = this.canvas.getActiveObject().index ? this.canvas.getActiveObject().index : this.canvas.getActiveObject().id;
        if (element.index === compare){
          // tslint:disable-next-line: no-string-literal
          this.savedInfo['data'].ndarray[0].Impression.splice(index, 1, {index: this.canvas._activeObject.id, sentence: diseases});
          // tslint:disable-next-line: no-string-literal
          this.savedInfo['data'].ndarray[0].diseases.splice(index, 1, obj);
        }
      });
    }
    else{
      // tslint:disable-next-line: no-string-literal
      this.savedInfo['data'].ndarray[0].diseases.push(obj);
    }
    this.enableDrawEllipseMode = false;
    }
    else{
      const obj = {
        color: colorName,
        freeHandDrawing: true,
        coordinatevalues: this.canvas._activeObject.path,
        index: this.canvas._activeObject.id,
        name: diseases,
        type: 'ellipse'
      };
      if (check === 'update'){
        sessionStorage.removeItem('x-ray_Data');
        // tslint:disable-next-line: no-string-literal
        this.savedInfo['data'].ndarray[0].Impression.forEach((element, index) => {
          const compare = this.canvas.getActiveObject().index ? this.canvas.getActiveObject().index : this.canvas.getActiveObject().id;
          if (element.index === compare){
            // tslint:disable-next-line: no-string-literal
            this.savedInfo['data'].ndarray[0].Impression.splice(index, 1, {index: this.canvas._activeObject.id, sentence: diseases});
            // tslint:disable-next-line: no-string-literal
            this.savedInfo['data'].ndarray[0].diseases.splice(index, 1, obj);
          }
        });
      }
      else{
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
}
