import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CalendarComponent } from './calendar/calendar.component';
import { ChatRoomComponent } from './chat-room/chat-room.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { SettingsComponent } from './settings/settings.component';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImplicitReceiver } from '@angular/compiler';
import { PatientListComponent } from './patient-list/patient-list.component';
import { LocalFilesystemComponent } from './local-filesystem/local-filesystem.component';
import { DragDropComponent } from './local-filesystem/drag-drop/drag-drop.component';

@NgModule({
  declarations: [
    HomeComponent,
    DashboardComponent,
    CalendarComponent,
    ChatRoomComponent,
    MyAccountComponent,
    SettingsComponent,
    PatientListComponent,
    LocalFilesystemComponent,
    DragDropComponent,
  ],
  imports: [
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    AgGridModule.withComponents([]),
  ],
})
export class HomeModule {}
