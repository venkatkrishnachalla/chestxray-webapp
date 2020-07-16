import { Component, OnInit } from '@angular/core';
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

  constructor(
    private annotatedXrayService: XRayService
  ) {}

  ngOnInit(): void {
    this.annotatedXrayService
      .getAnnotatedImageData()
      .subscribe((xrayAnnotatedImage) => {
        this.xrayAnnotatedImage = xrayAnnotatedImage;
      });
  }
}
