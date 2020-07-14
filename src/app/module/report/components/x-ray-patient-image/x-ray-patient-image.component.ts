import { Component, OnInit, Input } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { XRayService } from 'src/app/service/x-ray.service';
import { EventEmitterService } from 'src/app/service/event-emitter.service';

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
    private annotatedXrayService: XRayService,
    private xrayAnnotatedImpressionService: EventEmitterService
  ) {}

  ngOnInit(): void {
    this.annotatedXrayService
      .getAnnotatedImageData()
      .subscribe((xrayAnnotatedImage) => {
        this.xrayAnnotatedImage = xrayAnnotatedImage;
      });
  }
}
