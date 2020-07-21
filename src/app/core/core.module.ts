import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { HeaderComponent } from './layout/component/header/header.component';
import { SideNavComponent } from './layout/component/side-nav/side-nav.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';
import { XRayHeaderComponent } from './layout/component/header/components/x-ray-header/x-ray-header.component';
import { ErrorMessageComponent } from './layout/component/error-message/error-message.component';

const coreComponents = [
  ErrorMessageComponent,
  XRayHeaderComponent,
  SideNavComponent,
  HeaderComponent,
  MainLayoutComponent,
  AuthLayoutComponent,
];
@NgModule({
  declarations: [...coreComponents],
  imports: [CommonModule, RouterModule, MaterialModule],
  exports: [...coreComponents],
})
export class CoreModule {}
