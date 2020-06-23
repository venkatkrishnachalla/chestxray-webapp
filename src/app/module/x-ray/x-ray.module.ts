import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { XRayComponent } from './x-ray.component';
import { MaterialModule } from 'src/app/material.module';
import { ImpressionComponent } from './components/impression/impression.component';
import { FindingsComponent } from './components/findings/findings.component';
import { PatientDetailsComponent } from './components/patient-details/patient-details.component';
import { ImageSlidingComponent } from './components/image-sliding/image-sliding.component';
// import { Ng5SliderModule } from 'ng5-slider';

@NgModule({
  declarations: [XRayComponent, ImpressionComponent, FindingsComponent, PatientDetailsComponent, ImageSlidingComponent],
  imports: [
    CommonModule,
    MaterialModule,
    // Ng5SliderModule
  ],
})
export class XRayModule {}
