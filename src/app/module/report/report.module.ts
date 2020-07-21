import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportComponent } from './report.component';
import { XRayPatientDetailsComponent } from './components/x-ray-patient-details/x-ray-patient-details.component';
import { XRayPatientImageComponent } from './components/x-ray-patient-image/x-ray-patient-image.component';
import { MaterialModule } from 'src/app/material.module';
import { NgxPrintModule } from 'ngx-print';
import { ReportFooterComponent } from './components/report-footer/report-footer.component';
import { ReportHeaderComponent } from './components/report-header/report-header.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ReportComponent,
    XRayPatientDetailsComponent,
    XRayPatientImageComponent,
    ReportFooterComponent,
    ReportHeaderComponent,
  ],
  imports: [CommonModule, MaterialModule, NgxPrintModule, FormsModule],
})
export class ReportModule {}
