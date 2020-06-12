import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './UI/spinner/spinner.component';
import { GridColumnsDirective } from './grid-columns.directive';
import { MaterialModule } from '../../material.module';

const sharedComponents = [SpinnerComponent];

@NgModule({
  declarations: [...sharedComponents, GridColumnsDirective],
  exports: [...sharedComponents],
  imports: [CommonModule, MaterialModule],
})
export class SharedModule {}
