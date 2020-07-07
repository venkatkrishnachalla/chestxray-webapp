import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportComponent } from './report.component';
import { XRayPatientDetailsComponent } from './components/x-ray-patient-details/x-ray-patient-details.component';
import { XRayPatientImageComponent } from './components/x-ray-patient-image/x-ray-patient-image.component';

@NgModule({
  declarations: [ReportComponent, XRayPatientDetailsComponent, XRayPatientImageComponent],
  imports: [
    CommonModule
  ]
})
export class ReportModule { }
