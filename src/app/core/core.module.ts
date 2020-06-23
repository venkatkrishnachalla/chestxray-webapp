import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { HeaderComponent } from './layout/component/header/header.component';
import { SideNavComponent } from './layout/component/side-nav/side-nav.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';
import { XRayHeaderComponent } from './layout/component/header/components/x-ray-header/x-ray-header.component';

@NgModule({
  declarations: [
    AuthLayoutComponent,
    MainLayoutComponent,
    HeaderComponent,
    SideNavComponent,
    XRayHeaderComponent,
  ],
  imports: [CommonModule, RouterModule, MaterialModule],
  exports: [],
})
export class CoreModule {}
