import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { XRayComponent } from './x-ray.component';
import { MaterialModule } from 'src/app/material.module';



@NgModule({
  declarations: [XRayComponent],
  imports: [
    CommonModule,
    MaterialModule,
  ]
})
export class XRayModule { }
