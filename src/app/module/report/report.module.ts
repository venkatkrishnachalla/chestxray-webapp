import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportComponent } from './report.component';
import { XRayPatientDetailsComponent } from './components/x-ray-patient-details/x-ray-patient-details.component';
import { XRayPatientImageComponent } from './components/x-ray-patient-image/x-ray-patient-image.component';
import { MaterialModule } from 'src/app/material.module';

@NgModule({
  declarations: [
    ReportComponent,
    XRayPatientDetailsComponent,
    XRayPatientImageComponent,
  ],
  imports: [CommonModule, MaterialModule],
})
export class ReportModule {}
