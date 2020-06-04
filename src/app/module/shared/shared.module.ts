import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './UI/spinner/spinner.component';

const sharedComponents = [SpinnerComponent];

@NgModule({
  declarations: [...sharedComponents],
  exports: [...sharedComponents],
  imports: [CommonModule],
})
export class SharedModule {}
