import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { XRayComponent } from './x-ray.component';
import { MaterialModule } from 'src/app/material.module';
import { Ng5SliderModule } from 'ng5-slider';
import { ActionPanelComponent } from './component/action-panel/action-panel.component';
import { FindingsComponent } from './component/findings/findings.component';
import { ImageSlidingComponent } from './component/image-sliding/image-sliding.component';
import { ImpressionComponent } from './component/impression/impression.component';
import { PatientDetailsComponent } from './component/patient-details/patient-details.component';
import { CanvasImageComponent } from './component/canvas-image/canvas-image.component';
import { FormsModule } from '@angular/forms';
import { SearchFilterPipe } from 'src/app/filters/search-filter.pipe';
import { AskAiComponent } from './component/ask-ai/ask-ai.component';

@NgModule({
  declarations: [
    XRayComponent,
    ActionPanelComponent,
    FindingsComponent,
    ImageSlidingComponent,
    ImpressionComponent,
    PatientDetailsComponent,
    CanvasImageComponent,
    SearchFilterPipe,
    AskAiComponent
  ],
  imports: [CommonModule, MaterialModule, Ng5SliderModule, FormsModule],
  exports: [SearchFilterPipe]
})
export class XRayModule {}
