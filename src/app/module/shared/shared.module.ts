import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './UI/spinner/spinner.component';
import { MaterialModule } from '../../material.module';

const sharedComponents = [SpinnerComponent];

@NgModule({
  declarations: [...sharedComponents],
  exports: [...sharedComponents],
  imports: [CommonModule, MaterialModule],
})
export class SharedModule {}
