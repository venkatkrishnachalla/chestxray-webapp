import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { XRayComponent } from './x-ray.component';
import { MaterialModule } from 'src/app/material.module';
import { Ng5SliderModule } from 'ng5-slider';
import { ActionPanelComponent } from './component/action-panel/action-panel.component';
import { ImpressionComponent } from './component/impression/impression.component';
import { FindingsComponent } from './component/findings/findings.component';
import { PatientDetailsComponent } from './component/patient-details/patient-details.component';
import { ImageSlidingComponent } from './component/image-sliding/image-sliding.component';

@NgModule({
  declarations: [
    XRayComponent, 
    ActionPanelComponent,
    ImpressionComponent, 
    FindingsComponent, 
    PatientDetailsComponent, 
    ImageSlidingComponent],
  imports: [
    CommonModule,
    MaterialModule,
    Ng5SliderModule
  ]
})

export class XRayModule {}
