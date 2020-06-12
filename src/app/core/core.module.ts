import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { HeaderComponent } from './layout/component/header/header.component';
import { SideNavComponent } from './layout/component/side-nav/side-nav.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';
import { GridcolsDirective } from '../module/shared/gridcols.directive';

@NgModule({
  declarations: [
    AuthLayoutComponent,
    MainLayoutComponent,
    HeaderComponent,
    SideNavComponent,
    GridcolsDirective,
  ],
  imports: [CommonModule, RouterModule, MaterialModule],
  exports: [],
})
export class CoreModule {}
