import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { HeaderComponent } from './layout/component/header/header.component';
import { SideNavComponent } from './layout/component/side-nav/side-nav.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';
import { DashboardComponent } from './layout/component/dashboard/dashboard.component';
import { MyAccountComponent } from './layout/component/my-account/my-account.component';
import { ChatRoomComponent } from './layout/component/chat-room/chat-room.component';
import { CalendarComponent } from './layout/component/calendar/calendar.component';
import { SettingsComponent } from './layout/component/settings/settings.component';
import { GridcolsDirective } from '../module/shared/gridcols.directive';

@NgModule({
  declarations: [
    AuthLayoutComponent,
    MainLayoutComponent,
    HeaderComponent,
    SideNavComponent,
    DashboardComponent,
    MyAccountComponent,
    ChatRoomComponent,
    CalendarComponent,
    SettingsComponent,
    GridcolsDirective
  ],
  imports: [CommonModule, RouterModule, MaterialModule],
  exports: [],
})
export class CoreModule {}
