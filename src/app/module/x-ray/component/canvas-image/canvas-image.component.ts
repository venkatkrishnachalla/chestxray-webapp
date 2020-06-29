import { Component, OnInit, HostListener, TemplateRef, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { fabric } from 'fabric';
import "fabric-customise-controls";
import { SpinnerService } from 'src/app/module/shared/UI/spinner/spinner.service';
import { DashboardService } from 'src/app/service/dashboard.service';
import { EventEmitterService } from 'src/app/service/event-emitter.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { pathology } from 'src/app/constants/pathologyConstants';
import { Observable } from 'rxjs';
import { StateGroup } from "../../healthDetails";
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { xrayImageService } from 'src/app/service/canvasImage';

@Component({
  selector: 'cxr-canvas-image',
  templateUrl: './canvas-image.component.html',
  styleUrls: ['./canvas-image.component.scss'],
})
export class CanvasImageComponent implements OnInit {
  @ViewChild('pathologyModal') pathologyModal: TemplateRef<any>;
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
  ellipse:any;
  isDown:any;
  origX:any;
  origY:any;
  enableDrawEllipseMode:boolean;
  deleteIcon:String;
  deleteImg:any;
  readonly constants = pathology;
  pathologyNames:any;
  stateGroupOptions: Observable<StateGroup[]>;
  searchModel:string;
  selectedDisease:string;
  patientImage: any;
  instanceId: any;
  patientId: string;

  constructor(
    private spinnerService: SpinnerService,
    private router: Router,
    private dashboardService: DashboardService,
    private eventEmitterService: EventEmitterService,
    private dialog : MatDialog,
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
    this.deleteIcon =  "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";
    this.deleteImg = document.createElement('img');
    this.deleteImg.src = this.deleteIcon;
    if (this.eventEmitterService.subsVar==undefined) {    
      this.eventEmitterService.subsVar = this.eventEmitterService.    
      invokeComponentFunction.subscribe((title:string) => {  
        switch (title) {
          case 'Draw Ellipse':
              this.drawEllipse();   
            break;
          case 'Free Hand Drawing':
              this.freeHandDrawing();   
            break;
          default:
            break;
        }   
      });    
    } 
    this.spinnerService.show();
    this.canvas = new fabric.Canvas('at-id-x-ray-Canvas');
    fabric.Canvas.prototype.customiseControls({
      position: { x: 0.5, y: -0.5 },
      offsetY: 16,
      cursorStyle: 'pointer',
      mouseUpHandler: this.deleteObject,
      render: this.renderIcon,
      cornerSize: 24
    });
    // fabric.object.prototype.transparentCorners = false;
    // fabric.object.prototype.cornerColor = 'blue';
    // fabric.object.prototype.cornerStyle = 'circle';
  //   fabric.Canvas.prototype.customiseControls({
  //     settings: {
  //         borderColor: 'black',
  //         cornerSize: 25,
  //         cornerShape: 'rect',
  //         cornerBackgroundColor: 'black',
  //         cornerPadding: 10
  //     },
  //     tl: {
  //         icon: 'src/assets/facebook.png',
  //         settings: {
  //             cornerShape: 'rect',
  //             cornerBackgroundColor: 'red',
  //             cornerPadding: 10,
  //         },
  //     },
  //     tr: {
  //         icon: 'src/assets/facebook.png',
  //         settings: {
  //             cornerShape: 'circle',
  //             cornerBackgroundColor: '#000',
  //             cornerPadding: 15,
  //         },
  //     },
  //     bl: {
  //         icon: 'src/assets/facebook.png'
  //     },
  //     br: {
  //         icon: 'src/assets/facebook.png'
  //     },
  //     mb: {
  //         icon: 'src/assets/facebook.png'
  //     },
  //     // only is hasRotatingPoint is not set to false
  //     mtr: {
  //         icon: 'src/assets/facebook.png'
  //     },
  // }, function() {
  //     this.canvas.renderAll();
  // } );
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
    this.canvas.on('object:selected', (evt) => {
      let selectedObject = this.canvas.getActiveObject();
      this.canvas.setActiveObject(selectedObject);
    });
  }

  renderIcon(ctx , left, top, styleOverride, fabricObject) {
    var size = this.canvas.cornerSize;
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
    ctx.drawImage(this.deleteImg, -size/2, -size/2, size, size);
    ctx.restore();
  }

deleteObject(eventData, target) {
  var canvas = target.canvas;
      canvas.remove(target);
      canvas.requestRenderAll();
}

  updateSearchModel(value) {
    this.searchModel = value;
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
  /**
   Register click function from another component
   */
  firstComponentFunction(title){    
    this.eventEmitterService.onComponentButtonClick(title);    
  } 
  /**Draw Ellipse Functionality */
  drawEllipse() {
    this.canvas.isDrawingMode = false;
    this.enableDrawEllipseMode = true;
    this.canvas.observe("mouse:down", (e) =>  {
      if (this.enableDrawEllipseMode == true) {
        this.isDown = true;
        let pointer = this.canvas.getPointer(e.e);
        this.origX = pointer.x;
        this.origY = pointer.y;
        let ellipse = new fabric.Ellipse({
              width:0,
              height:0,
              left: pointer.x,
              top: pointer.y,
              originX: "left",
              originY: "top",
              opacity: 0.3,
              strokeWidth: 1,
              fill: "rgb(255,127,80)",
              selection: false
        });
        this.canvas.add(ellipse);
        this.canvas.renderAll();
        this.canvas.setActiveObject(ellipse);
      }
    })  
    this.canvas.observe('mouse:move', (e) => {
          if (!this.isDown) return;
          let mouse = e.pointer;
          if (this.canvas._objects) {
            var w = (mouse.x - this.origX), h = (mouse.y - this.origY), rx = Math.abs(w) / 2, ry = Math.abs(h) / 2;
          }
          else {
            var w = (mouse.x - this.origX), h = (mouse.y - this.origY), rx = Math.abs(w) / 2, ry = Math.abs(h) / 2;
          }
          if (!rx || !ry) {
            return false;
          }
          let ellipse = this.canvas.getActiveObject();
          ellipse.set('rx', rx).set('ry', ry);
          this.ellipse = ellipse;
          this.canvas.setActiveObject(this.ellipse);
          this.canvas.renderAll();
    });

    this.canvas.observe('mouse:up', (e) => {
      this.isDown = false;
      if(this.enableDrawEllipseMode){
        this.openPathologyModal();
      }
      this.enableDrawEllipseMode = false;
    });
  }
  openPathologyModal(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.restoreFocus = false;
    dialogConfig.autoFocus = true;
    dialogConfig.role = 'dialog';
    this.dialog.open(this.pathologyModal, {panelClass: 'my-class'});

  }
  onSelect(event){
    this.selectedDisease = event.target.textContent;
  }

  savePrediction(){
    this.eventEmitterService.onComponentDataShared(this.selectedDisease);
    this.selectedDisease = '';
    this.dialog.closeAll();
  }

  closePathologyModal(){
    this.selectedDisease = '';
    let activeObject = this.canvas.getActiveObject();   
    this.canvas.remove(activeObject);
    this.canvas.renderAll();
  }
  

  freeHandDrawing() {
    this.enableDrawEllipseMode = false;
    this.canvas.isDrawingMode = true;
    this.canvas.observe("mouse:down", (e) =>  {
        let pointer = this.canvas.getPointer(e.e);
        this.origX = pointer.x;
        this.origY = pointer.y;
        this.ellipse = new fabric.Ellipse({
                width:0,
                height:0,
                left: pointer.x,
                top: pointer.y,
                originX: "left",
                originY: "top",
                stroke: "black",
                hoverCursor: "pointer",
                selection: true,
                opacity: 0.3,
                strokeWidth: 1,
                fill: "rgb(255,127,80)",
                rx: 0,
                ry: 0,
                angle: 0,
                hasRotatingPoint: false
              });
        this.canvas.add(this.ellipse);
        this.canvas.renderAll();
        this.canvas.setActiveObject(this.ellipse);
      })  
      this.canvas.observe('mouse:move', function(e){
        if (!this.isDown) return;
        var pointer = this.canvas.getPointer(e.e);
        this.ellipse.set({ rx: Math.abs(this.origX - pointer.x),ry:Math.abs(this.origY - pointer.y) });
        this.canvas.renderAll();
      });
      
      this.canvas.on('mouse:up', function(o){
        this.isDown = false;
        this.canvas.isDrawingMode = false;
      });
  } 
}
