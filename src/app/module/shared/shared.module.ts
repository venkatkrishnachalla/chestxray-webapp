import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './UI/spinner/spinner.component';
import { MaterialModule } from '../../material.module';
import { ControlMessageComponent } from './UI/control-message/control-message.component';

const sharedComponents = [SpinnerComponent, ControlMessageComponent];

@NgModule({
  declarations: [...sharedComponents],
  exports: [...sharedComponents],
  imports: [CommonModule, MaterialModule],
})
// SharedModule class implementation  
export class SharedModule {}
