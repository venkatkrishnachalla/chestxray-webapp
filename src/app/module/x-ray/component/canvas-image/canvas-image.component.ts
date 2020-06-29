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


@Component({
  selector: 'cxr-canvas-image',
  templateUrl: './canvas-image.component.html',
  styleUrls: ['./canvas-image.component.scss'],
})
export class CanvasImageComponent implements OnInit {
  @ViewChild('pathologyModal') pathologyModal: TemplateRef<any>;
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

  constructor(
    private spinnerService: SpinnerService,
    private router: Router,
    private dashboardService: DashboardService,
    private eventEmitterService: EventEmitterService,
    private dialog : MatDialog,
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
    if (!this.PatientImage) {
      this.getPatientImage(this.patientId);
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
    // this._service
    //   .getPatientImage(instanceID)
    //   .subscribe((data: HealthViewProcess) => {
    //     this.PatientImage = 'data:image/png;base64,' + data;
    //     sessionStorage.setItem('PatientImage', this.PatientImage);
    //     this.setCanvasDimension();
    //     this.generateCanvas();
    //   });

    this.dashboardService.getPatientList().subscribe(
      (patientsList: any) => {
        const rowData = patientsList;
        const patientId =  Number(this.patientId);
        if (patientId === rowData[0].patientId) {
          this.PatientImage =
            'data:image/jpeg;base64,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';
        } else if (patientId === rowData[1].patientId) {
          this.PatientImage =
            'data:image/jpeg;base64,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';
        } else if (patientId === rowData[2].patientId) {
          this.PatientImage =
            'data:image/jpeg;base64,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';
        } else {
          this.PatientImage =
            'data:image/jpeg;base64,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';
        }
        sessionStorage.setItem('PatientImage', this.PatientImage);
        this.setCanvasDimension();
        this.generateCanvas();
        this.spinnerService.hide();
      },
      (errorMessage: any) => {
        this.spinnerService.hide();
      }
    );
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
    const containerAspectRatio = this.canvasDynamicWidth / this.canvasDynamicHeight;
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
