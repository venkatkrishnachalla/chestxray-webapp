import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { XRayComponent } from './x-ray.component';
import { MaterialModule } from 'src/app/material.module';
import { Ng5SliderModule } from 'ng5-slider';
import { ActionPanelComponent } from './component/action-panel/action-panel.component';


@NgModule({
  declarations: [XRayComponent, ActionPanelComponent],
  imports: [
    CommonModule,
    MaterialModule,
    Ng5SliderModule
  ]
})
export class XRayModule { }
