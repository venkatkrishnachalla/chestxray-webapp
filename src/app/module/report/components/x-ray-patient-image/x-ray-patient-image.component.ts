import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { XRayService } from 'src/app/service/x-ray.service';
import { PatientDetailData } from 'src/app/module/auth/interface.modal';
import { fabric } from 'fabric';
@Component({
  selector: 'cxr-x-ray-patient-image',
  templateUrl: './x-ray-patient-image.component.html',
  styleUrls: ['./x-ray-patient-image.component.scss'],
})
// XRayPatientImageComponent class implementation
export class XRayPatientImageComponent implements OnInit {
  patientImage: any;
  xrayAnnotatedImage: string;
  xrayAnnotatedImpression: string;
  patientInfo: PatientDetailData;
  pdfTitle: string;
  @Output() printEvent = new EventEmitter();

  /*  
* constructor for XRayPatientImageComponent class  
*/ 
  constructor(private annotatedXrayService: XRayService) {}

/**  
* This is a init function.  
* @param {void} empty - A empty param  
* @example  
* ngOnInit();
*/ 
  ngOnInit(): void {
    this.patientInfo = history.state.patientDetails;
    if (this.patientInfo === undefined) {
      const patientInfo = JSON.parse(sessionStorage.getItem('patientDetail'));
      this.patientInfo = patientInfo;
    }
    const timestamp = Number(new Date());
    const hospitalPatientId = this.patientInfo.hospitalPatientId
      ? this.patientInfo.hospitalPatientId
      : this.patientInfo.name;
    this.pdfTitle = hospitalPatientId + '_' + timestamp;
    this.annotatedXrayService
      .getAnnotatedImageData()
      .subscribe((xrayAnnotatedImage: string) => {
        this.xrayAnnotatedImage = xrayAnnotatedImage;
        if (Object.keys(this.xrayAnnotatedImage).length === 0) {
          const image = sessionStorage.getItem('annotatedImage');
          this.xrayAnnotatedImage = image;
        }
      });
  }

  /**  
* This is a print button click emit function.  
* @param {void} empty - A empty param  
* @example  
* printClick();
*/ 
  printClick() {
    this.printEvent.emit(true);
  }
}
