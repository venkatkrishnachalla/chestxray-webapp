import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { XRayService } from 'src/app/service/x-ray.service';

@Component({
  selector: 'cxr-x-ray-patient-image',
  templateUrl: './x-ray-patient-image.component.html',
  styleUrls: ['./x-ray-patient-image.component.scss'],
})
export class XRayPatientImageComponent implements OnInit {
  patientImage: any;
  xrayAnnotatedImage: string;
  xrayAnnotatedImpression: string;
  @Output() printEvent = new EventEmitter();

  constructor(private annotatedXrayService: XRayService) {}

  /*** class init function ***/
  ngOnInit(): void {
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

  /*** print button click emit function ***/
  printClick() {
    this.printEvent.emit(true);
  }
}
