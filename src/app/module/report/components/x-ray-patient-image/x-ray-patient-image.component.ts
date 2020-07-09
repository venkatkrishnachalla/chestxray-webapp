import { Component, OnInit, Input } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { XRayService } from 'src/app/service/x-ray.service';

@Component({
  selector: 'cxr-x-ray-patient-image',
  templateUrl: './x-ray-patient-image.component.html',
  styleUrls: ['./x-ray-patient-image.component.scss']
})
export class XRayPatientImageComponent implements OnInit {
  patientImage: any;
  private anotatedXraySubscription: Subscription;
  constructor(private anotatedXrayService: XRayService) { }

  ngOnInit(): void {
    this.patientImage = sessionStorage.getItem('PatientImage');
  //   this.anotatedXraySubscription = this.anotatedXrayService.anotatedXraySubjectData.subscribe((mlResponse: any) =>
  //   // this.mlApiEllipseLoop(mlResponse)
  //   console.log(mlResponse)
  // );
    this.anotatedXrayService.getAnnotatedImageData().subscribe(refreshStatus => {
      console.log('Pramoda', refreshStatus);
  });
  }

}
