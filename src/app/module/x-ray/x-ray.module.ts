import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { XRayComponent } from './x-ray.component';
import { CanvasImageComponent } from './canvas-image/canvas-image.component';
import { MaterialModule } from 'src/app/material.module';
import { Ng5SliderModule } from 'ng5-slider';

@NgModule({
  declarations: [XRayComponent, CanvasImageComponent],
  imports: [CommonModule, MaterialModule, Ng5SliderModule],
})
export class XRayModule {}
